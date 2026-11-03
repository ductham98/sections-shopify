import { SectionSchema, SchemaBlockDef } from "./preview-types";
import { PREVIEW_FALLBACK_IMAGES } from "@/data/preview/settings";
import { MockDataset } from "./mock-data/types";
import { toShopifyFontDrop } from "./liquid-filters";

const SCHEMA_REGEX = /{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/i;

export interface ExtractedSchemaData {
  schema: SectionSchema | null;
  templateWithoutSchema: string;
  diagnostics: string[];
}

/**
 * Extracts and parses the JSON schema from a Liquid file.
 */
export function extractSchema(liquidSource: string): ExtractedSchemaData {
  const diagnostics: string[] = [];
  const match = liquidSource.match(SCHEMA_REGEX);

  if (!match) {
    return {
      schema: null,
      templateWithoutSchema: liquidSource,
      diagnostics: ["No {% schema %} block detected in section source."],
    };
  }

  let schema: SectionSchema | null = null;
  try {
    schema = JSON.parse(match[1].trim()) as SectionSchema;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    diagnostics.push(`Failed to parse section schema JSON: ${msg}`);
  }

  const templateWithoutSchema = liquidSource.replace(SCHEMA_REGEX, "").trim();

  return {
    schema,
    templateWithoutSchema,
    diagnostics,
  };
}

/**
 * Builds default section settings from schema definitions and presets.
 * Supports temporary overrides (e.g. from the Preview Inspector).
 */
export function buildSectionSettings(
  schema: SectionSchema | null,
  dataset: MockDataset,
  sectionId?: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  const settings: Record<string, unknown> = {};
  if (!schema) return overrides;

  // 1. Process schema setting definitions
  if (Array.isArray(schema.settings)) {
    for (const setting of schema.settings) {
      if (!setting || !setting.id) continue;

      if (setting.default !== undefined) {
        if (setting.type === "font_picker") {
          settings[setting.id] = toShopifyFontDrop(setting.default);
        } else {
          settings[setting.id] = setting.default;
        }
      } else {
        // Safe typed fallbacks by setting type
        switch (setting.type) {
          case "checkbox":
            settings[setting.id] = false;
            break;
          case "number":
          case "range":
            settings[setting.id] = setting.min ?? 0;
            break;
          case "color":
            settings[setting.id] = "#000000";
            break;
          case "color_background":
            settings[setting.id] = "#ffffff";
            break;
          case "font_picker":
            settings[setting.id] = toShopifyFontDrop("assistant_n4");
            break;
          case "select":
            settings[setting.id] = setting.options?.[0]?.value ?? "";
            break;
          case "collection":
            settings[setting.id] = dataset.collection;
            break;
          case "product":
            settings[setting.id] = dataset.featuredProduct;
            break;
          case "image_picker":
            settings[setting.id] = {
              src: PREVIEW_FALLBACK_IMAGES.hero,
              alt: "Preview image",
              width: 1200,
              height: 800,
            };
            break;
          case "text":
          case "textarea":
          case "richtext":
          case "url":
          default:
            settings[setting.id] = "";
        }
      }
    }
  }

  // 2. Overlay preset settings if available
  const preset = schema.presets?.[0];
  if (preset && preset.settings && typeof preset.settings === "object") {
    for (const [key, val] of Object.entries(preset.settings)) {
      const settingDef = schema.settings?.find((s) => s && s.id === key);
      if (settingDef?.type === "font_picker") {
        settings[key] = toShopifyFontDrop(val);
      } else {
        settings[key] = val;
      }
    }
  }

  // 3. Fallbacks for missing media / collection links
  if (settings.collection === undefined || settings.collection === "" || settings.collection === null) {
    settings.collection = dataset.collection;
  }

  if (sectionId?.includes("hero") || schema.name?.toLowerCase().includes("hero")) {
    if (!settings.image) {
      settings.image = {
        src: PREVIEW_FALLBACK_IMAGES.hero,
        alt: "Modern Concept Hero",
        width: 1600,
        height: 900,
      };
    }
    if (!settings.mobile_image) {
      settings.mobile_image = {
        src: PREVIEW_FALLBACK_IMAGES.heroMobile,
        alt: "Modern Concept Hero Mobile",
        width: 800,
        height: 1000,
      };
    }
  }

  // 4. Merge temporary overrides (Inspector)
  for (const [key, val] of Object.entries(overrides)) {
    const settingDef = schema.settings?.find((s) => s && s.id === key);
    if (settingDef?.type === "font_picker") {
      settings[key] = toShopifyFontDrop(val);
    } else {
      settings[key] = val;
    }
  }

  return settings;
}

/**
 * Builds section blocks based on presets or block definitions.
 */
export function buildSectionBlocks(
  schema: SectionSchema | null
): Array<{ id: string; type: string; settings: Record<string, unknown>; shopify_attributes: string }> {
  if (!schema) return [];

  const blockDefs = new Map<string, SchemaBlockDef>();
  if (Array.isArray(schema.blocks)) {
    for (const b of schema.blocks) {
      if (b && b.type) {
        blockDefs.set(b.type, b);
      }
    }
  }

  const result: Array<{ id: string; type: string; settings: Record<string, unknown>; shopify_attributes: string }> = [];

  const getBlockDefaults = (def?: SchemaBlockDef): Record<string, unknown> => {
    const s: Record<string, unknown> = {};
    if (def && Array.isArray(def.settings)) {
      for (const st of def.settings) {
        if (st && st.id) {
          s[st.id] = st.default !== undefined ? st.default : "";
        }
      }
    }
    return s;
  };

  const preset = schema.presets?.[0];
  if (preset && Array.isArray(preset.blocks) && preset.blocks.length > 0) {
    preset.blocks.forEach((pb, idx) => {
      const def = blockDefs.get(pb.type);
      const baseSettings = getBlockDefaults(def);
      const mergedSettings = { ...baseSettings, ...(pb.settings || {}) };

      // Enrich empty images for specific block types
      if (pb.type === "category" && !mergedSettings.image) {
        const fallbackImg = PREVIEW_FALLBACK_IMAGES.categories[idx % PREVIEW_FALLBACK_IMAGES.categories.length];
        mergedSettings.image = {
          src: fallbackImg,
          alt: String(mergedSettings.title || "Category"),
        };
      } else if (pb.type === "review" && !mergedSettings.avatar) {
        const fallbackAvatar = PREVIEW_FALLBACK_IMAGES.avatars[idx % PREVIEW_FALLBACK_IMAGES.avatars.length];
        mergedSettings.avatar = {
          src: fallbackAvatar,
          alt: String(mergedSettings.name || "Customer"),
        };
      }

      result.push({
        id: `block-${idx + 1}`,
        type: pb.type,
        settings: mergedSettings,
        shopify_attributes: `data-shopify-editor-block='{"id":"block-${idx + 1}"}'`,
      });
    });
  } else if (schema.blocks && schema.blocks.length > 0) {
    // Generate sample blocks if preset didn't specify them
    schema.blocks.slice(0, 3).forEach((b, idx) => {
      result.push({
        id: `block-${idx + 1}`,
        type: b.type,
        settings: getBlockDefaults(b),
        shopify_attributes: `data-shopify-editor-block='{"id":"block-${idx + 1}"}'`,
      });
    });
  }

  return result;
}
