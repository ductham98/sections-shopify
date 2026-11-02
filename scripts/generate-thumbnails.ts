import path from "path";
import { discoverAllSections } from "../src/lib/section-discovery";
import {
  generateSectionThumbnail,
  closeScreenshotBrowser,
  getChromiumExecutablePath,
} from "../src/lib/preview/screenshot-service";

async function main() {
  const rootDir = process.cwd();
  const sectionsDir = path.join(rootDir, "sections");
  const force = process.argv.includes("--force");

  console.log("==========================================================");
  console.log("   Shopify Sections Library — Thumbnail Generator V1      ");
  console.log("   Engine: Playwright Chromium (WebP 1200x700 @ 85%)      ");
  console.log("==========================================================");

  const chromePath = getChromiumExecutablePath();
  if (!chromePath) {
    console.warn("[ThumbnailGenerator] Warning: No Chromium binary found on this system.");
    console.warn("[ThumbnailGenerator] Skipping screenshot capture. Existing cached thumbnails will be used.");
    return;
  }
  console.log(`[ThumbnailGenerator] Browser binary: ${chromePath}`);
  console.log(`[ThumbnailGenerator] Force regeneration: ${force}`);

  const { sections, sources } = discoverAllSections(sectionsDir);
  console.log(`[ThumbnailGenerator] Discovered ${sections.length} sections to evaluate.`);

  let generatedCount = 0;
  let cacheHitCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  try {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const source = sources[section.id];
      const prefix = `[${i + 1}/${sections.length}] [${section.id}]`;

      try {
        const result = await generateSectionThumbnail({
          sectionId: section.id,
          liquidSource: source,
          force,
        });

        if (result.reusedCache) {
          cacheHitCount++;
          console.log(`${prefix} Cached ✓ (${result.durationMs}ms) -> ${result.thumbnail.url}`);
        } else if (result.thumbnail.status === "ready") {
          generatedCount++;
          console.log(`${prefix} Captured WebP ✓ (${result.durationMs}ms) -> ${result.thumbnail.url}`);
          if (result.warnings && result.warnings.length > 0) {
            console.log(`    ↳ Warnings: ${result.warnings.join("; ")}`);
          }
        } else {
          errorCount++;
          console.error(`${prefix} Error ✗ (${result.durationMs}ms): ${result.thumbnail.error}`);
        }
      } catch (err: unknown) {
        errorCount++;
        console.error(`${prefix} Unexpected failure:`, err);
      }
    }
  } finally {
    await closeScreenshotBrowser();
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("==========================================================");
  console.log(`Finished in ${totalTime}s.`);
  console.log(`Total: ${sections.length} | Generated: ${generatedCount} | Cache Hits: ${cacheHitCount} | Errors: ${errorCount}`);
  console.log("==========================================================");
}

main().catch((err) => {
  console.error("[ThumbnailGenerator] Fatal script error:", err);
  process.exit(1);
});
