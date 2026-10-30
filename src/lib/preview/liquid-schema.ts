import { SectionSchema, SchemaBlockDef } from "./preview-types";
import { PREVIEW_FALLBACK_IMAGES } from "../../data/preview/settings";
import { MOCK_COLLECTION } from "../../data/preview/collections";

const SCHEMA_REGEX = /{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/;

export interface ExtractedSchemaData {
  schema: SectionSchema | null;
  templateWithoutSchema: string;
}

/**
 * Extracts and parses the JSON schema from a Liquid file, and returns
 * the Liquid template with the schema block stripped.
 */
export function extractSchema(liquidSource: string): ExtractedSchemaData {
  const match = liquidSource.match(SCHEMA_REGEX);
  if (!match) {
    return {
      schema: null,
      templateWithoutSchema: liquidSource,
    };
  }

  let schema: SectionSchema | null = null;
  try {
    schema = JSON.parse(match[1]) as SectionSchema;
  } catch (err) {
    console.warn("Failed to parse section schema JSON:", err);
  }

  const templateWithoutSchema = liquidSource.replace(SCHEMA_REGEX, "").trim();

  return {
    schema,
    templateWithoutSchema,
  };
}

/**
 * Builds default section settings based on schema settings and preset defaults.
 */
export function getDefaultSectionSettings(
  schema: SectionSchema | null,
  sectionId?: string
): Record<string, unknown> {
  const settings: Record<string, unknown> = {};

  if (!schema) return settings;

  // 1. Populate defaults from settings definitions
  if (Array.isArray(schema.settings)) {
    for (const setting of schema.settings) {
      if (!setting || !setting.id) continue;
      if (setting.default !== undefined) {
        settings[setting.id] = setting.default;
      } else {
        // Safe fallbacks by setting type
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
          case "text":
          case "textarea":
          case "richtext":
          case "url":
            settings[setting.id] = "";
            break;
          case "select":
            settings[setting.id] = setting.options?.[0]?.value ?? "";
            break;
          case "collection":
            settings[setting.id] = MOCK_COLLECTION;
            break;
          default:
            settings[setting.id] = "";
        }
      }
    }
  }

  // 2. Overlay preset settings if available
  const preset = schema.presets?.[0];
  if (preset && preset.settings && typeof preset.settings === "object") {
    Object.assign(settings, preset.settings);
  }

  // 3. Realistic fallbacks for prominent empty media settings
  if (settings.collection === undefined || settings.collection === "" || settings.collection === null) {
    settings.collection = MOCK_COLLECTION;
  }

  if (sectionId?.includes("hero") || schema.name?.toLowerCase().includes("hero")) {
    if (!settings.image) {
      settings.image = {
        src: PREVIEW_FALLBACK_IMAGES.hero,
        alt: "Modern Workspace Hero",
        width: 1600,
        height: 900,
      };
    }
    if (!settings.mobile_image) {
      settings.mobile_image = {
        src: PREVIEW_FALLBACK_IMAGES.heroMobile,
        alt: "Modern Workspace Hero Mobile",
        width: 800,
        height: 1000,
      };
    }
  }

  return settings;
}

/**
 * Builds default blocks based on presets or block definitions.
 */
export function getDefaultSectionBlocks(
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

  // Helper to extract default settings for a given block definition
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
    // Generate at least 1-3 blocks if preset didn't specify them
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
