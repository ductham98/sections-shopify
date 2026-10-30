/**
 * AUTO-DISCOVERED SECTIONS METADATA
 * No manual maintenance required.
 * Populated automatically from sections/*.liquid by scripts/generate-sections-meta.ts
 */

import { DiscoveredSectionMeta } from "@/lib/section-discovery";
import { DISCOVERED_SECTIONS } from "@/generated/sections-meta.generated";

export type SectionMeta = DiscoveredSectionMeta;

export const SECTIONS_METADATA: DiscoveredSectionMeta[] = DISCOVERED_SECTIONS;
