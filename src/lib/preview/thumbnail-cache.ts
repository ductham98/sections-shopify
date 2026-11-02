import fs from "fs";
import path from "path";
import crypto from "crypto";

export const THUMBNAIL_ENGINE_VERSION = "v1.0.0";
export const THUMBNAIL_DATASET_VERSION = "v1-general";
export const THUMBNAIL_DEPENDENCY_VERSION = "v1-theme-snippets";
export const THUMBNAIL_VIEWPORT = {
  width: 1200,
  height: 700,
} as const;

export interface SectionThumbnail {
  url: string;
  generatedAt: string;
  sourceHash: string;
  engineVersion: string;
  viewport: {
    width: number;
    height: number;
  };
  status: "ready" | "pending" | "error";
  compositeHash?: string;
  error?: string;
}

export interface ThumbnailIdentity {
  sectionId: string;
  sourceHash: string;
  schemaHash: string;
  compositeHash: string;
  engineVersion: string;
  datasetVersion: string;
  dependencyVersion: string;
  viewport: {
    width: number;
    height: number;
  };
}

const CACHE_FILE_PATH = path.join(process.cwd(), "src", "generated", "thumbnails-cache.json");
const THUMBNAILS_DIR = path.join(process.cwd(), "public", "thumbnails");

/**
 * Computes deterministic hashes for source, schema and full configuration.
 */
export function computeThumbnailIdentity(
  sectionId: string,
  source: string,
  schema: unknown = {}
): ThumbnailIdentity {
  const sourceHash = crypto.createHash("sha256").update(source.trim()).digest("hex").slice(0, 16);
  const schemaHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(schema || {}))
    .digest("hex")
    .slice(0, 16);

  const compositeKey = [
    sectionId,
    sourceHash,
    schemaHash,
    THUMBNAIL_ENGINE_VERSION,
    THUMBNAIL_DATASET_VERSION,
    THUMBNAIL_DEPENDENCY_VERSION,
    `${THUMBNAIL_VIEWPORT.width}x${THUMBNAIL_VIEWPORT.height}`,
  ].join(":");

  const compositeHash = crypto.createHash("sha256").update(compositeKey).digest("hex").slice(0, 16);

  return {
    sectionId,
    sourceHash,
    schemaHash,
    compositeHash,
    engineVersion: THUMBNAIL_ENGINE_VERSION,
    datasetVersion: THUMBNAIL_DATASET_VERSION,
    dependencyVersion: THUMBNAIL_DEPENDENCY_VERSION,
    viewport: { ...THUMBNAIL_VIEWPORT },
  };
}

/**
 * Reads all cached thumbnail entries from disk.
 */
export function loadAllThumbnailCache(): Record<string, SectionThumbnail> {
  if (!fs.existsSync(CACHE_FILE_PATH)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("[ThumbnailCache] Failed to read cache manifest:", err);
    return {};
  }
}

/**
 * Checks if a cached WebP image on disk matches the current composite identity.
 */
export function isThumbnailCacheValid(
  sectionId: string,
  currentIdentity: ThumbnailIdentity
): boolean {
  const imagePath = path.join(THUMBNAILS_DIR, `${sectionId}.webp`);
  if (!fs.existsSync(imagePath)) {
    return false;
  }

  // Ensure file has non-zero size
  try {
    const stats = fs.statSync(imagePath);
    if (stats.size === 0) return false;
  } catch {
    return false;
  }

  const cache = loadAllThumbnailCache();
  const entry = cache[sectionId];
  if (!entry) return false;

  return (
    entry.status === "ready" &&
    entry.compositeHash === currentIdentity.compositeHash &&
    entry.engineVersion === THUMBNAIL_ENGINE_VERSION
  );
}

/**
 * Persists an updated thumbnail entry into the cache manifest.
 */
export function saveThumbnailCacheEntry(sectionId: string, entry: SectionThumbnail): void {
  const dir = path.dirname(CACHE_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const cache = loadAllThumbnailCache();
  cache[sectionId] = entry;

  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), "utf-8");
}

