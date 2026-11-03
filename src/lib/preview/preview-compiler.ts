import { CompiledPreviewResult, PreviewEngineContext } from "./preview-types";
import { extractSchema } from "./schema-engine";
import { getLiquidEngine } from "./liquid-engine";
import { buildShopifyContext } from "./shopify-context";
import { generatePreviewDocument } from "./document-generator";
import { DatasetId } from "./mock-data/types";

export interface ExtendedPreviewOptions extends PreviewEngineContext {
  datasetId?: DatasetId;
  productLimit?: number;
}

/**
 * Compiles a raw Liquid section file into a complete standalone preview HTML document.
 */
export async function compileSectionPreview(
  liquidSource: string,
  contextOptions: ExtendedPreviewOptions = {}
): Promise<CompiledPreviewResult> {
  const sectionId = contextOptions.sectionId || "preview-section";

  if (!liquidSource || !liquidSource.trim()) {
    const emptyDoc = generatePreviewDocument({
      title: "No Content",
      sectionId,
      renderedHtml: "<p style='padding:40px;text-align:center;color:#6b7280;'>No Liquid source code provided.</p>",
    });
    return {
      previewHtml: emptyDoc,
      hasLiquid: false,
    };
  }

  // 1. Extract schema block and clean template
  const { schema, templateWithoutSchema } = extractSchema(liquidSource);

  // 2. Build mock Shopify context using selected dataset and any Inspector overrides
  const context = buildShopifyContext({
    sectionId,
    datasetId: contextOptions.datasetId || "general",
    schema,
    overrides: contextOptions.overrides,
    productLimit: contextOptions.productLimit,
  });

  const engine = getLiquidEngine();

  try {
    // 3. Render Liquid template
    const renderedBody = await engine.parseAndRender(templateWithoutSchema, context);

    // 4. Extract <style> and <script> blocks from rendered output
    const extractedStyles: string[] = [];
    let bodyClean = renderedBody.replace(
      /<style\b[^>]*>([\s\S]*?)<\/style>/gi,
      (_: string, css: string) => {
        if (css && css.trim()) {
          extractedStyles.push(css.trim());
        }
        return "";
      }
    );

    const extractedScripts: string[] = [];
    bodyClean = bodyClean.replace(
      /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
      (_: string, js: string) => {
        if (js && js.trim()) {
          extractedScripts.push(js.trim());
        }
        return "";
      }
    );

    const sectionCss = extractedStyles.join("\n\n");
    const sectionScripts = extractedScripts.join("\n\n");

    // 5. Generate standalone HTML document with complete sandbox
    const fullDocument = generatePreviewDocument({
      title: schema?.name || sectionId,
      sectionId,
      renderedHtml: bodyClean,
      sectionCss,
      sectionScripts,
    });

    return {
      previewHtml: fullDocument,
      schema: schema || undefined,
      hasLiquid: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Preview compiler error for ${sectionId}:`, message);

    const errorDocument = generatePreviewDocument({
      title: sectionId,
      sectionId,
      renderedHtml: "",
      error: message,
    });

    return {
      previewHtml: errorDocument,
      error: message,
      schema: schema || undefined,
      hasLiquid: true,
    };
  }
}
