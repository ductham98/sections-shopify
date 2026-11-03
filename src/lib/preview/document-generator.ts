import DOMPurify from "isomorphic-dompurify";
import { getBaseThemeCss, getPreviewRuntimeScript } from "./theme-runtime";

export interface GenerateDocumentOptions {
  title?: string;
  sectionId?: string;
  renderedHtml: string;
  sectionCss?: string;
  sectionScripts?: string;
  fontUrl?: string;
  error?: string;
}

/**
 * Generates a complete standalone HTML5 document for previewing in a sandboxed iframe.
 */
export function generatePreviewDocument(options: GenerateDocumentOptions): string {
  const {
    title = "Shopify Section Preview",
    sectionId = "preview-section",
    renderedHtml,
    sectionCss = "",
    sectionScripts = "",
    fontUrl,
    error,
  } = options;

  const baseThemeCss = getBaseThemeCss();
  const runtimeScript = getPreviewRuntimeScript(sectionId);

  if (error) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Error - ${title}</title>
  <style>
    ${baseThemeCss}
    .preview-error-box {
      margin: 32px;
      padding: 24px;
      border-radius: 8px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .preview-error-box h3 { margin-top: 0; font-size: 16px; font-weight: 600; }
    .preview-error-box pre {
      background: #fee2e2;
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
      font-family: monospace;
      white-space: pre-wrap;
      overflow-x: auto;
      color: #b91c1c;
    }
  </style>
</head>
<body>
  <div class="preview-error-box">
    <h3>Liquid Rendering Error</h3>
    <pre>${error}</pre>
    <p style="font-size: 13px; color: #7f1d1d; margin-bottom: 0;">Check section template syntax or schema configuration.</p>
  </div>
  <script>${runtimeScript}</script>
</body>
</html>`;
  }

  // Sanitize rendered HTML body while preserving valid SVG and data attributes
  const sanitizedHtml = DOMPurify.sanitize(renderedHtml, {
    FORBID_TAGS: ["script", "iframe", "frame", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "ondblclick", "onmouseover", "onmouseout"],
    ADD_TAGS: [
      "svg",
      "path",
      "g",
      "defs",
      "linearGradient",
      "stop",
      "circle",
      "rect",
      "line",
      "polyline",
      "polygon",
      "text",
      "tspan",
      "use",
    ],
    ADD_ATTR: [
      "target",
      "loading",
      "decoding",
      "viewBox",
      "xmlns",
      "fill",
      "stroke",
      "stroke-width",
      "stroke-linecap",
      "stroke-linejoin",
      "d",
      "cx",
      "cy",
      "r",
      "x",
      "y",
      "data-shopify-editor-block",
      "data-vfp-carousel",
      "data-vfp-track",
      "data-vfp-prev",
      "data-vfp-next",
      "data-vfp-pagination",
      "data-product-card",
      "data-loop",
      "data-autoplay",
      "data-autoplay-speed",
      "data-pagination",
      "data-pause-hover",
      "data-initialized",
    ],
    WHOLE_DOCUMENT: false,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${fontUrl ? `<link rel="stylesheet" href="${fontUrl}">` : ""}
  <style>
    ${baseThemeCss}
  </style>
  ${sectionCss ? `<style id="shopify-section-styles">\n${sectionCss}\n</style>` : ""}
</head>
<body>
  <div id="shopify-section-preview-root" class="shopify-section" data-section-id="${sectionId}">
    ${sanitizedHtml}
  </div>

  ${sectionScripts ? `<script data-shopify-section-scripts>\n${sectionScripts}\n</script>` : ""}

  <script>
    ${runtimeScript}
  </script>
</body>
</html>`;
}
