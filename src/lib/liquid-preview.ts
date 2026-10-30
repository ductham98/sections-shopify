import { compileSectionPreview } from "./preview/preview-compiler";

/**
 * Backward compatibility wrapper that routes to the new modular preview engine.
 */
export async function renderLiquidToHtml(liquidSource: string, filename?: string): Promise<string> {
  const sectionId = filename ? filename.replace(/\.liquid$/, "") : "preview-section";
  const result = await compileSectionPreview(liquidSource, { sectionId });
  return result.previewHtml;
}
