import fs from "fs";
import path from "path";
import { SectionSchema } from "./preview/preview-types";

export type SectionCategory =
  | "hero"
  | "features"
  | "product"
  | "social-proof"
  | "faq"
  | "header"
  | "uncategorized";

export type SectionPlan = "free" | "gold";

export type PreviewStatus = "ready" | "partial" | "error";

export interface DiscoveredSectionMeta {
  id: string;
  filename: string;
  title: string;
  presetName: string;
  category: SectionCategory;
  plan: SectionPlan;
  description: string;
  tags: string[];
  lineCount: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  updatedAt: string;
  hasSchema: boolean;
  previewStatus: PreviewStatus;
  schemaError?: string;
  settingsCount: number;
  blocksCount: number;
}

export interface SectionsConfigFile {
  categories?: Record<string, SectionCategory>;
  plans?: Record<string, SectionPlan>;
  titles?: Record<string, string>;
  descriptions?: Record<string, string>;
}

const SCHEMA_REGEX = /{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.liquid$/, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Loads optional developer config file from repository root.
 */
export function loadSectionsConfig(rootDir = process.cwd()): SectionsConfigFile {
  const configPath = path.join(rootDir, "sections.config.json");
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      return JSON.parse(raw) as SectionsConfigFile;
    } catch (err) {
      console.warn("Could not parse sections.config.json:", err);
    }
  }
  return {};
}

/**
 * Heuristically detects the category of a section from its schema, presets, and filename.
 */
export function detectCategory(
  filename: string,
  schema: SectionSchema | null,
  config: SectionsConfigFile = {}
): SectionCategory {
  const id = filename.replace(/\.liquid$/, "");

  // 1. Explicit override from external config file
  if (config.categories && config.categories[id]) {
    return config.categories[id];
  }

  // 2. Schema or preset category
  const schemaCat = (schema?.category as string) || (schema?.presets?.[0]?.category as string);
  if (schemaCat) {
    const sCatLower = schemaCat.toLowerCase();
    if (sCatLower.includes("hero") || sCatLower.includes("banner")) return "hero";
    if (sCatLower.includes("product") || sCatLower.includes("cart") || sCatLower.includes("commerce")) return "product";
    if (sCatLower.includes("feature") || sCatLower.includes("grid")) return "features";
    if (sCatLower.includes("review") || sCatLower.includes("trust") || sCatLower.includes("testimonial")) return "social-proof";
    if (sCatLower.includes("faq") || sCatLower.includes("help")) return "faq";
    if (sCatLower.includes("header") || sCatLower.includes("announcement")) return "header";
  }

  // 3. Keyword analysis from filename, section title, and preset name
  const text = `${filename} ${schema?.name || ""} ${schema?.presets?.[0]?.name || ""}`.toLowerCase();

  if (text.includes("hero") || text.includes("billboard") || text.includes("banner")) {
    return "hero";
  }

  if (text.includes("bento") || text.includes("features-grid") || filename.startsWith("feature-")) {
    return "features";
  }

  if (
    text.includes("product") ||
    text.includes("cart") ||
    text.includes("buy") ||
    text.includes("atc") ||
    text.includes("checkout")
  ) {
    return "product";
  }

  if (
    text.includes("testimonial") ||
    text.includes("review") ||
    text.includes("trust") ||
    text.includes("logo") ||
    text.includes("social") ||
    text.includes("rating") ||
    text.includes("client")
  ) {
    return "social-proof";
  }

  if (
    text.includes("faq") ||
    text.includes("question") ||
    text.includes("contact") ||
    text.includes("accordion") ||
    text.includes("support") ||
    text.includes("help")
  ) {
    return "faq";
  }

  if (
    text.includes("announcement") ||
    text.includes("ticker") ||
    text.includes("marquee") ||
    text.includes("top-bar") ||
    text.includes("header")
  ) {
    return "header";
  }

  if (text.includes("feature") || text.includes("grid") || text.includes("categor")) {
    return "features";
  }

  return "uncategorized";
}

/**
 * Extracts and formats tags for filtering and search.
 */
function extractTags(filename: string, title: string, presetName: string, schema: SectionSchema | null): string[] {
  const set = new Set<string>();

  // Add filename segments
  filename
    .replace(/\.liquid$/, "")
    .split(/[-_]+/)
    .forEach((w) => {
      if (w.length > 2) set.add(w.toLowerCase());
    });

  // Add title words
  title.split(/\s+/).forEach((w) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (clean.length > 2) set.add(clean);
  });

  // Add preset name
  if (presetName && presetName !== title) {
    presetName.split(/\s+/).forEach((w) => {
      const clean = w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      if (clean.length > 2) set.add(clean);
    });
  }

  // Add schema block types
  if (schema?.blocks && Array.isArray(schema.blocks)) {
    schema.blocks.forEach((b) => {
      if (b && b.type) set.add(b.type.toLowerCase());
    });
  }

  // Key setting highlights
  if (schema?.settings && Array.isArray(schema.settings)) {
    const settingIds = schema.settings.map((s) => s?.id).filter(Boolean) as string[];
    if (settingIds.some((id) => id.includes("mobile"))) set.add("responsive");
    if (settingIds.some((id) => id.includes("color"))) set.add("themeable");
    if (settingIds.some((id) => id.includes("slider") || id.includes("carousel"))) set.add("slider");
  }

  return Array.from(set);
}

/**
 * Discovers a single section from its file path and raw code.
 */
export function parseSectionFile(
  filename: string,
  code: string,
  stats?: fs.Stats,
  config: SectionsConfigFile = {}
): DiscoveredSectionMeta {
  const id = filename.replace(/\.liquid$/, "");
  const lineCount = code.split("\n").length;
  const fileSizeBytes = Buffer.byteLength(code, "utf-8");
  const fileSizeFormatted = formatBytes(fileSizeBytes);
  const updatedAt = stats?.mtime ? stats.mtime.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

  let schema: SectionSchema | null = null;
  let hasSchema = false;
  let schemaError: string | undefined;
  let previewStatus: PreviewStatus = "ready";

  const match = code.match(SCHEMA_REGEX);
  if (match) {
    hasSchema = true;
    try {
      schema = JSON.parse(match[1]) as SectionSchema;
    } catch (err: unknown) {
      previewStatus = "error";
      schemaError = err instanceof Error ? err.message : String(err);
      console.warn(`[SectionDiscovery] Invalid JSON schema in ${filename}:`, schemaError);
    }
  } else {
    previewStatus = "partial";
  }

  const title = config.titles?.[id] || (schema?.name ? schema.name.trim() : humanizeFilename(filename));
  const presetName = schema?.presets?.[0]?.name ? schema.presets[0].name.trim() : title;
  const category = detectCategory(filename, schema, config);
  const plan: SectionPlan = config.plans?.[id] === "gold" ? "gold" : "free";

  const settingsCount = Array.isArray(schema?.settings) ? schema.settings.length : 0;
  const blocksCount = Array.isArray(schema?.blocks) ? schema.blocks.length : 0;

  const description =
    config.descriptions?.[id] ||
    (settingsCount > 0
      ? `Shopify Online Store 2.0 ${presetName} section with ${settingsCount} customizable settings.`
      : `Shopify Online Store 2.0 ${presetName} section.`);

  const tags = extractTags(filename, title, presetName, schema);

  return {
    id,
    filename,
    title,
    presetName,
    category,
    plan,
    description,
    tags,
    lineCount,
    fileSizeBytes,
    fileSizeFormatted,
    updatedAt,
    hasSchema,
    previewStatus,
    schemaError,
    settingsCount,
    blocksCount,
  };
}

/**
 * Scans the sections/ directory and returns discovered section metadata.
 */
export function discoverAllSections(
  sectionsDir = path.join(process.cwd(), "sections"),
  config = loadSectionsConfig()
): { sections: DiscoveredSectionMeta[]; sources: Record<string, string> } {
  if (!fs.existsSync(sectionsDir)) {
    console.warn(`[SectionDiscovery] Sections directory not found at: ${sectionsDir}`);
    return { sections: [], sources: {} };
  }

  const files = fs.readdirSync(sectionsDir).filter((f) => f.endsWith(".liquid"));
  const sections: DiscoveredSectionMeta[] = [];
  const sources: Record<string, string> = {};
  const seenIds = new Set<string>();

  for (const filename of files) {
    const filePath = path.join(sectionsDir, filename);
    try {
      const code = fs.readFileSync(filePath, "utf-8");
      const stats = fs.statSync(filePath);
      const meta = parseSectionFile(filename, code, stats, config);

      if (seenIds.has(meta.id)) {
        console.warn(`[SectionDiscovery] Duplicate section ID detected: ${meta.id} in ${filename}. Skipping duplicate.`);
        continue;
      }
      seenIds.add(meta.id);

      sections.push(meta);
      sources[meta.id] = code;
    } catch (err) {
      console.error(`[SectionDiscovery] Failed to read ${filename}:`, err);
    }
  }

  // Sort sections stably by title
  sections.sort((a, b) => a.title.localeCompare(b.title));

  return { sections, sources };
}

