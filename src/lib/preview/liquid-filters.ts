import { Liquid } from "liquidjs";

interface ImageObject {
  src?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  preview_image?: ImageObject;
}

export function registerShopifyFilters(engine: Liquid): void {
  /**
   * Filter: image_url
   * Usage: {{ product.featured_image | image_url: width: 600 }}
   */
  engine.registerFilter("image_url", (input: unknown, options?: { width?: number; height?: number } | number) => {
    const fallback = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80";
    if (!input) return fallback;

    let url = "";
    if (typeof input === "string") {
      url = input;
    } else if (typeof input === "object" && input !== null) {
      const img = input as ImageObject;
      url = img.src || img.url || img.preview_image?.src || "";
    }

    if (!url) return fallback;

    const requestedWidth = typeof options === "number" ? options : options?.width;
    if (requestedWidth && url.includes("images.unsplash.com")) {
      url = url.replace(/w=\d+/, `w=${requestedWidth}`);
    }

    return url;
  });

  /**
   * Filter: image_tag
   * Usage: {{ image | image_tag: class: 'my-img', loading: 'lazy' }}
   */
  engine.registerFilter("image_tag", (input: unknown, options?: Record<string, unknown>) => {
    let src = "";
    let defaultAlt = "Shopify section image";
    let width: number | string | undefined;
    let height: number | string | undefined;

    if (typeof input === "string") {
      src = input;
    } else if (typeof input === "object" && input !== null) {
      const img = input as ImageObject;
      src = img.src || img.url || img.preview_image?.src || "";
      if (img.alt) defaultAlt = img.alt;
      if (img.width) width = img.width;
      if (img.height) height = img.height;
    }

    if (!src) {
      src = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80";
    }

    const attrs: string[] = [`src="${src}"`];
    const opts = options || {};
    const alt = opts.alt !== undefined ? String(opts.alt) : defaultAlt;
    attrs.push(`alt="${alt.replace(/"/g, "&quot;")}"`);

    if (opts.class) attrs.push(`class="${String(opts.class)}"`);
    attrs.push(`loading="${opts.loading ? String(opts.loading) : "lazy"}"`);
    if (opts.width || width) attrs.push(`width="${opts.width || width}"`);
    if (opts.height || height) attrs.push(`height="${opts.height || height}"`);
    if (opts.style) attrs.push(`style="${String(opts.style)}"`);

    return `<img ${attrs.join(" ")} />`;
  });

  /**
   * Filter: placeholder_svg_tag
   */
  engine.registerFilter("placeholder_svg_tag", (input: unknown, className?: string) => {
    const name = String(input || "image");
    const cls = className ? `class="${className}"` : "";

    return `<svg ${cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="background:#e5e7eb;display:block">
      <defs>
        <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f3f4f6" />
          <stop offset="100%" stop-color="#e5e7eb" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#grad-${name})" />
      <g fill="#9ca3af" transform="translate(250, 150)">
        <rect x="10" y="10" width="80" height="60" rx="8" fill="none" stroke="#9ca3af" stroke-width="4"/>
        <circle cx="35" cy="35" r="8" fill="#9ca3af"/>
        <path d="M15 60 L45 35 L65 55 L75 45 L85 60" fill="none" stroke="#9ca3af" stroke-width="4" stroke-linejoin="round"/>
      </g>
      <text x="50%" y="245" text-anchor="middle" fill="#6b7280" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="14" font-weight="500">${name.toUpperCase()}</text>
    </svg>`;
  });

  // Money formatting
  engine.registerFilter("money", (cents: unknown) => {
    const num = Number(cents);
    if (isNaN(num)) return "$0.00";
    return `$${(num / 100).toFixed(2)}`;
  });

  engine.registerFilter("money_with_currency", (cents: unknown) => {
    const num = Number(cents);
    if (isNaN(num)) return "$0.00 USD";
    return `$${(num / 100).toFixed(2)} USD`;
  });

  engine.registerFilter("money_without_trailing_zeros", (cents: unknown) => {
    const num = Number(cents);
    if (isNaN(num)) return "$0";
    const val = num / 100;
    return val % 1 === 0 ? `$${val}` : `$${val.toFixed(2)}`;
  });

  engine.registerFilter("money_without_currency", (cents: unknown) => {
    const num = Number(cents);
    if (isNaN(num)) return "0.00";
    return (num / 100).toFixed(2);
  });

  // Translation filter: {{ 'key' | t }}
  engine.registerFilter("t", (key: unknown, params?: Record<string, unknown>) => {
    const k = String(key || "");
    if (k.includes("from_price")) {
      const priceVal = params?.price ? `$${(Number(params.price) / 100).toFixed(2)}` : "$0.00";
      return `From ${priceVal}`;
    }
    if (k.includes("add_to_cart")) return "Add to cart";
    if (k.includes("sold_out")) return "Sold out";
    if (k.includes("sale")) return "Sale";
    if (k.includes("regular_price")) return "Regular price";
    return k.split(".").pop() || k;
  });

  // Assets and URLs
  engine.registerFilter("asset_url", (file: unknown) => `/assets/${file || ""}`);
  engine.registerFilter("asset_img_url", () => "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80");
  engine.registerFilter("file_url", (file: unknown) => `/files/${file || ""}`);
  engine.registerFilter("file_img_url", () => "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80");
  engine.registerFilter("stylesheet_tag", (url: unknown) => `<link rel="stylesheet" href="${url}" />`);
  engine.registerFilter("script_tag", () => "");
  engine.registerFilter("link_to", (label: unknown, url: unknown) => `<a href="${url || "#"}">${label || ""}</a>`);
  engine.registerFilter("within", (url: unknown) => url || "#");

  // String / Format helpers
  engine.registerFilter("handleize", (val: unknown) => String(val || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  engine.registerFilter("handle", (val: unknown) => String(val || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  engine.registerFilter("pluralize", (count: unknown, singular: string, plural: string) => Number(count) === 1 ? singular : plural);
  engine.registerFilter("default_errors", () => "");

  // Date formatting
  engine.registerFilter("date", (val: unknown, format?: string) => {
    if (!val) return "";
    const d = new Date(String(val));
    if (isNaN(d.getTime())) return String(val);
    if (format === "%B %d, %Y") {
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
    return d.toLocaleDateString("en-US");
  });
}
