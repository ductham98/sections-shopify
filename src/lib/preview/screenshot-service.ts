import fs from "fs";
import path from "path";
import { chromium, Browser } from "playwright-core";
import { getSharedPreviewDocument } from "./shared-preview-document";
import {
  computeThumbnailIdentity,
  isThumbnailCacheValid,
  saveThumbnailCacheEntry,
  SectionThumbnail,
  THUMBNAIL_VIEWPORT,
  THUMBNAIL_ENGINE_VERSION,
} from "./thumbnail-cache";

export interface GenerateScreenshotOptions {
  sectionId: string;
  liquidSource?: string;
  force?: boolean;
}

export interface ScreenshotResult {
  sectionId: string;
  thumbnail: SectionThumbnail;
  reusedCache: boolean;
  durationMs: number;
  warnings?: string[];
}

const PUBLIC_THUMBNAILS_DIR = path.join(process.cwd(), "public", "thumbnails");

let sharedBrowserInstance: Browser | null = null;

/**
 * Resolves available Chromium executable path on current machine.
 */
export function getChromiumExecutablePath(): string | undefined {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(/*turbopackIgnore: true*/ c)) return c;
  }
  return undefined;
}

/**
 * Gets or initializes a singleton Playwright Chromium browser.
 */
async function getBrowserInstance(): Promise<Browser> {
  if (sharedBrowserInstance && sharedBrowserInstance.isConnected()) {
    return sharedBrowserInstance;
  }

  const execPath = getChromiumExecutablePath();
  sharedBrowserInstance = await chromium.launch({
    executablePath: execPath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=medium",
    ],
  });

  return sharedBrowserInstance;
}

/**
 * Gracefully shuts down the singleton browser instance when done.
 */
export async function closeScreenshotBrowser(): Promise<void> {
  if (sharedBrowserInstance) {
    try {
      await sharedBrowserInstance.close();
    } catch {
      // Ignore
    } finally {
      sharedBrowserInstance = null;
    }
  }
}

/**
 * Captures an actual WebP screenshot for a Shopify section using the shared preview pipeline.
 */
export async function generateSectionThumbnail(
  options: GenerateScreenshotOptions
): Promise<ScreenshotResult> {
  const startTime = Date.now();
  const { sectionId, force = false } = options;
  const warnings: string[] = [];

  if (!fs.existsSync(PUBLIC_THUMBNAILS_DIR)) {
    fs.mkdirSync(PUBLIC_THUMBNAILS_DIR, { recursive: true });
  }

  // 1. Compile the shared preview document
  const compileResult = await getSharedPreviewDocument(sectionId, {
    customSource: options.liquidSource,
    datasetId: "general",
  });

  const liquidSource = options.liquidSource || (compileResult.schema ? JSON.stringify(compileResult.schema) : sectionId);
  const identity = computeThumbnailIdentity(sectionId, liquidSource, compileResult.schema);

  // 2. Check deterministic cache if not forcing regeneration
  if (!force && isThumbnailCacheValid(sectionId, identity)) {
    const existingEntry: SectionThumbnail = {
      url: `/thumbnails/${sectionId}.webp?v=${identity.compositeHash}`,
      generatedAt: new Date().toISOString(),
      sourceHash: identity.sourceHash,
      engineVersion: THUMBNAIL_ENGINE_VERSION,
      viewport: { ...THUMBNAIL_VIEWPORT },
      status: "ready",
      compositeHash: identity.compositeHash,
    };

    return {
      sectionId,
      thumbnail: existingEntry,
      reusedCache: true,
      durationMs: Date.now() - startTime,
    };
  }

  // 3. Launch browser page and render document
  const browser = await getBrowserInstance();
  const context = await browser.newContext({
    viewport: {
      width: THUMBNAIL_VIEWPORT.width,
      height: THUMBNAIL_VIEWPORT.height,
    },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // Prevent esbuild/tsx __name injection issue in browser context
    await page.addInitScript("window.__name = (fn) => fn;");

    // Load compiled HTML document
    await page.setContent(compileResult.previewHtml, { waitUntil: "load" });

    // Wait for fonts to be ready
    await page.evaluate(`
      (async () => {
        if (document.fonts) {
          try {
            await document.fonts.ready;
          } catch (e) {}
        }
      })()
    `);

    // Wait for visible images to load, with naturalWidth check and timeout
    const imgReport = (await page.evaluate(`
      (async () => {
        const images = Array.from(document.querySelectorAll("img"));
        let loaded = 0;
        let failed = 0;
        const start = Date.now();

        await Promise.all(
          images.map((img) => {
            if (img.complete && img.naturalWidth > 0) {
              loaded++;
              return Promise.resolve();
            }
            return new Promise((resolve) => {
              const onDone = () => {
                if (img.naturalWidth > 0) loaded++;
                else failed++;
                resolve();
              };
              img.addEventListener("load", onDone, { once: true });
              img.addEventListener("error", onDone, { once: true });
              setTimeout(onDone, 3500);
            });
          })
        );

        return { total: images.length, loaded, failed };
      })()
    `)) as { total: number; loaded: number; failed: number };

    if (imgReport.failed > 0) {
      warnings.push(`Section has ${imgReport.failed}/${imgReport.total} images that failed or timed out.`);
    }

    // Stabilize layout for 300ms to eliminate any micro layout shifts
    await page.waitForTimeout(300);

    // Capture WebP screenshot of first viewport
    const webpBuffer = await page.screenshot({
      type: "webp",
      quality: 85,
      clip: {
        x: 0,
        y: 0,
        width: THUMBNAIL_VIEWPORT.width,
        height: THUMBNAIL_VIEWPORT.height,
      },
    });

    // Write WebP output to public/thumbnails/${sectionId}.webp
    const outputPath = path.join(PUBLIC_THUMBNAILS_DIR, `${sectionId}.webp`);
    fs.writeFileSync(outputPath, webpBuffer);

    const thumbnailEntry: SectionThumbnail = {
      url: `/thumbnails/${sectionId}.webp?v=${identity.compositeHash}`,
      generatedAt: new Date().toISOString(),
      sourceHash: identity.sourceHash,
      engineVersion: THUMBNAIL_ENGINE_VERSION,
      viewport: { ...THUMBNAIL_VIEWPORT },
      status: "ready",
      compositeHash: identity.compositeHash,
    };

    saveThumbnailCacheEntry(sectionId, thumbnailEntry);

    return {
      sectionId,
      thumbnail: thumbnailEntry,
      reusedCache: false,
      durationMs: Date.now() - startTime,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[ScreenshotService] Failed to capture ${sectionId}:`, errorMsg);

    const errorEntry: SectionThumbnail = {
      url: `/thumbnails/${sectionId}.webp`,
      generatedAt: new Date().toISOString(),
      sourceHash: identity.sourceHash,
      engineVersion: THUMBNAIL_ENGINE_VERSION,
      viewport: { ...THUMBNAIL_VIEWPORT },
      status: "error",
      error: errorMsg,
      compositeHash: identity.compositeHash,
    };

    saveThumbnailCacheEntry(sectionId, errorEntry);

    return {
      sectionId,
      thumbnail: errorEntry,
      reusedCache: false,
      durationMs: Date.now() - startTime,
      warnings: [errorMsg],
    };
  } finally {
    await page.close();
    await context.close();
  }
}

/**
 * Batch generates thumbnails for multiple sections sequentially or in controlled concurrency.
 */
export async function batchGenerateThumbnails(
  sectionIds: string[],
  options: { force?: boolean; onProgress?: (id: string, index: number, total: number) => void } = {}
): Promise<ScreenshotResult[]> {
  const results: ScreenshotResult[] = [];
  const total = sectionIds.length;

  try {
    for (let i = 0; i < total; i++) {
      const id = sectionIds[i];
      if (options.onProgress) {
        options.onProgress(id, i + 1, total);
      }
      const res = await generateSectionThumbnail({
        sectionId: id,
        force: options.force,
      });
      results.push(res);
    }
  } finally {
    await closeScreenshotBrowser();
  }

  return results;
}
