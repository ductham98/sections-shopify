import { CompiledPreviewResult, PreviewEngineContext } from "./preview-types";
import { extractSchema } from "./liquid-schema";
import { buildShopifyContext } from "./shopify-context";
import { getLiquidEngine } from "./liquid-engine";

/**
 * Generates an isolated HTML document wrapper with Shopify storefront baseline styles,
 * form/link click protection, and height auto-reporting for the parent iframe.
 */
function wrapHtmlEnvelope(contentHtml: string, title = "Shopify Section Preview"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #111827;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }
    #shopify-section-preview-root {
      display: flow-root;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    img, svg {
      display: block;
      max-width: 100%;
    }
    a {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    button, input, select, textarea {
      font-family: inherit;
    }
  </style>
</head>
<body>
  <div id="shopify-section-preview-root">
    ${contentHtml}
  </div>

  <script>
    (function() {
      // Prevent link clicks inside preview
      document.addEventListener('click', function(e) {
        var anchor = e.target.closest('a');
        if (anchor) {
          e.preventDefault();
        }
      }, true);

      // Prevent form submissions inside preview
      document.addEventListener('submit', function(e) {
        e.preventDefault();
      }, true);

      // Dynamic height reporter with requestAnimationFrame debounce
      var lastSentHeight = 0;
      var rafId = null;

      function measureAndSend() {
        var root = document.getElementById('shopify-section-preview-root');
        var body = document.body;
        var html = document.documentElement;

        var height = Math.max(
          root ? root.scrollHeight : 0,
          root ? root.offsetHeight : 0,
          body ? body.scrollHeight : 0,
          body ? body.offsetHeight : 0,
          html ? html.scrollHeight : 0,
          html ? html.offsetHeight : 0
        );

        if (height > 0 && Math.abs(height - lastSentHeight) >= 1) {
          lastSentHeight = height;
          if (window.parent) {
            window.parent.postMessage({
              type: 'shopify-preview-dimensions',
              height: height,
              width: root ? root.offsetWidth : (body ? body.offsetWidth : 1200)
            }, '*');
            // Backward compatibility
            window.parent.postMessage({
              type: 'shopify-preview-height',
              height: height
            }, '*');
          }
        }
      }

      function scheduleMeasure() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(measureAndSend);
      }

      window.addEventListener('load', scheduleMeasure);
      window.addEventListener('resize', scheduleMeasure);

      // Watch for font loading
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleMeasure);
      }

      // Watch for image loading
      var images = document.images;
      for (var i = 0; i < images.length; i++) {
        if (!images[i].complete) {
          images[i].addEventListener('load', scheduleMeasure);
          images[i].addEventListener('error', scheduleMeasure);
        }
      }

      // Watch DOM mutations and size changes
      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(scheduleMeasure);
        var rootEl = document.getElementById('shopify-section-preview-root');
        if (rootEl) ro.observe(rootEl);
        if (document.body) ro.observe(document.body);
      }

      // Timed fallbacks for animations and late css
      setTimeout(scheduleMeasure, 50);
      setTimeout(scheduleMeasure, 200);
      setTimeout(scheduleMeasure, 600);
      setTimeout(scheduleMeasure, 1500);
    })();
  </script>
</body>
</html>`;
}

/**
 * Compiles a raw Liquid section file into a complete preview HTML document.
 */
export async function compileSectionPreview(
  liquidSource: string,
  contextOptions: PreviewEngineContext = {}
): Promise<CompiledPreviewResult> {
  if (!liquidSource || !liquidSource.trim()) {
    return {
      previewHtml: wrapHtmlEnvelope("<p style='padding:40px;text-align:center;color:#6b7280;'>No Liquid source code provided.</p>"),
      hasLiquid: false,
    };
  }

  const { schema, templateWithoutSchema } = extractSchema(liquidSource);
  const engine = getLiquidEngine();

  const context = buildShopifyContext({
    sectionId: contextOptions.sectionId || "shopify-preview-section",
    schema,
    overrides: contextOptions.overrides,
  });

  try {
    const renderedBody = await engine.parseAndRender(templateWithoutSchema, context);
    const fullHtml = wrapHtmlEnvelope(renderedBody, schema?.name || "Shopify Section Preview");

    return {
      previewHtml: fullHtml,
      schema: schema || undefined,
      hasLiquid: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Preview compiler error:", message);

    const errorHtml = wrapHtmlEnvelope(`
      <div style="padding: 32px; font-family: -apple-system, sans-serif; color: #991b1b; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; margin: 24px;">
        <h3 style="margin-top: 0; font-size: 16px; font-weight: 600;">Liquid Rendering Error</h3>
        <pre style="white-space: pre-wrap; font-size: 13px; font-family: monospace; color: #b91c1c; background: #fee2e2; padding: 12px; border-radius: 6px;">${message}</pre>
        <p style="font-size: 13px; color: #7f1d1d; margin-bottom: 0;">Please review the section template syntax and mock context dependencies.</p>
      </div>
    `);

    return {
      previewHtml: errorHtml,
      error: message,
      schema: schema || undefined,
      hasLiquid: true,
    };
  }
}

