import { compileSectionPreview, ExtendedPreviewOptions } from "./preview-compiler";
import { SectionSourceManager } from "./source-manager";
import { CompiledPreviewResult } from "./preview-types";

export interface SharedPreviewDocumentOptions extends ExtendedPreviewOptions {
  customSource?: string;
}

/**
 * Shared Preview Document Service
 * 
 * Single source of truth for generating preview HTML documents.
 * Consumed by both:
 *  1. Interactive Preview Modal (Iframe rendering via /preview/render/[sectionId])
 *  2. Real Thumbnail Screenshot Generator (Playwright Chromium renderer)
 * 
 * Ensures identical Liquid compilation, mock dataset, theme runtime,
 * typography tokens, and CSS resets across all preview contexts.
 */
export async function getSharedPreviewDocument(
  sectionId: string,
  options: SharedPreviewDocumentOptions = {}
): Promise<CompiledPreviewResult> {
  // 1. Retrieve Liquid source (either provided or from SectionSourceManager)
  let source = options.customSource;
  if (!source) {
    source = (await SectionSourceManager.getSource(sectionId)) || "";
  }

  // 2. Standardize preview compilation options
  const compileOptions: ExtendedPreviewOptions = {
    sectionId,
    datasetId: options.datasetId || "general",
    productLimit: options.productLimit,
    overrides: options.overrides || {},
    device: options.device || "desktop",
  };

  // 3. Compile the standalone HTML document using the unified pipeline
  return compileSectionPreview(source, compileOptions);
}

