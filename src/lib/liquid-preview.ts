import { Liquid } from "liquidjs";
import { getMockShopifyContext } from "./preview-context";

// Create Liquid engine instance
const engine = new Liquid({
  extname: ".liquid",
  strictFilters: false,
  strictVariables: false,
});

interface ImageObject {
  src?: string;
  alt?: string;
}

// Register Shopify compatibility filters
engine.registerFilter("image_url", (input: unknown) => {
  if (typeof input === "object" && input !== null && "src" in input) {
    return (input as ImageObject).src || "";
  }
  if (typeof input === "string" && input.length > 0) return input;
  return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80";
});

engine.registerFilter("image_tag", (input: unknown, ...args: unknown[]) => {
  let src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80";
  let alt = "Preview image";

  if (typeof input === "object" && input !== null && "src" in input) {
    const imgObj = input as ImageObject;
    if (imgObj.src) src = imgObj.src;
    if (imgObj.alt) alt = imgObj.alt;
  } else if (typeof input === "string" && input.length > 0) {
    src = input;
  }

  let classes = "";
  const style = "max-width:100%;height:auto;display:block;";

  if (args && args.length > 0) {
    for (const a of args) {
      if (typeof a === "object" && a !== null) {
        const record = a as Record<string, string>;
        if (record.class) classes = record.class;
        if (record.alt) alt = record.alt;
      }
    }
  }

  return `<img src="${src}" alt="${alt}" class="${classes}" style="${style}" loading="lazy" />`;
});

engine.registerFilter("placeholder_svg_tag", (input: string, className?: string) => {
  return `<div class="${className || ""}" style="background:#f4f4f5;display:flex;align-items:center;justify-content:center;min-height:160px;color:#a1a1aa;font-size:12px;font-family:sans-serif;border:1px dashed #d4d4d8;">[Shopify Asset: ${input}]</div>`;
});

engine.registerFilter("money", (input: unknown) => {
  if (input === null || input === undefined || input === "") return "$0.00";
  const num = Number(input);
  if (isNaN(num)) return `$${input}`;
  return num >= 1000 ? `$${(num / 100).toFixed(2)}` : `$${num.toFixed(2)}`;
});

engine.registerFilter("t", (key: string) => {
  if (!key) return "";
  const parts = key.split(".");
  return parts[parts.length - 1].replace(/_/g, " ");
});

engine.registerFilter("default_errors", () => "");

// Register Shopify {% form %} tag
engine.registerTag("form", {
  parse(token, remainTokens) {
    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on("template", (t: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.templates.push(t as any);
      })
      .on("tag:endform", () => stream.stop())
      .on("end", () => {
        throw new Error("tag form not closed");
      });
    stream.start();
  },
  *render(ctx, emitter) {
    emitter.write('<form class="shopify-preview-form" onsubmit="event.preventDefault(); return false;">');
    yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
    emitter.write("</form>");
  },
});

export async function renderLiquidToHtml(
  liquidCode: string,
  filename: string
): Promise<string> {
  try {
    // 1. Extract Schema JSON
    const schemaMatch = liquidCode.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    let schema: Record<string, unknown> = {};
    if (schemaMatch && schemaMatch[1]) {
      try {
        schema = JSON.parse(schemaMatch[1].trim());
      } catch (err) {
        console.warn(`[renderLiquidToHtml] Failed to parse schema for ${filename}:`, err);
      }
    }

    // 2. Strip {% schema %}...{% endschema %}
    const templateWithoutSchema = liquidCode.replace(
      /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/g,
      ""
    );

    // 3. Prepare Mock Context
    const context = getMockShopifyContext(filename, schema);

    // 4. Render with LiquidJS
    const renderedBody = await engine.parseAndRender(templateWithoutSchema, context);

    // 5. Wrap in full isolated HTML document with base styles
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #18181b;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img {
      max-width: 100%;
      height: auto;
      vertical-align: middle;
    }
    a {
      color: inherit;
      text-decoration: inherit;
    }
    button, input, select, textarea {
      font-family: inherit;
    }
  </style>
</head>
<body>
  ${renderedBody}
</body>
</html>`;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[renderLiquidToHtml] Error rendering ${filename}:`, error);
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;color:#ef4444;background:#fef2f2;">
      <h3>Preview Rendering Notice</h3>
      <p>Could not render Liquid preview for ${filename}: ${errorMsg}</p>
    </body></html>`;
  }
}
