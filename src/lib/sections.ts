import type { DiscoveredSectionMeta } from "./section-discovery";
import { DISCOVERED_SECTIONS, getGeneratedSectionSource } from "@/generated/sections-meta.generated";

export type SectionItem = DiscoveredSectionMeta;

/**
 * Returns all discovered sections.
 * In development mode, performs dynamic hot discovery on every request.
 * In production mode, uses the fast pre-generated metadata bundle.
 */
export async function getAllSections(): Promise<SectionItem[]> {
  if (process.env.NODE_ENV !== "production") {
    try {
      const { discoverAllSections } = await import("./section-discovery");
      const { sections } = discoverAllSections();
      if (sections && sections.length > 0) {
        return sections;
      }
    } catch (err) {
      console.warn("[sections] Hot discovery fallback:", err);
    }
  }

  return DISCOVERED_SECTIONS;
}

/**
 * Retrieves the raw Liquid source code for a section by its ID.
 */
export async function getSectionSource(id: string): Promise<string | null> {
  return getGeneratedSectionSource(id);
}
