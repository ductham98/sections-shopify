import { Liquid } from "liquidjs";

interface ImageObject {
  src?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  aspect_ratio?: number;
  preview_image?: ImageObject;
}

interface ParsedRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ShopifyFontDrop {
  family: string;
  fallback_families: string;
  style: string;
  weight: number;
  system: boolean;
  toString: () => string;
}

/**
 * Normalizes font_picker setting values or font handles into a Shopify Font object.
 */
export function toShopifyFontDrop(input: unknown): ShopifyFontDrop {
  if (typeof input === "object" && input !== null && "family" in input) {
    const obj = input as Record<string, unknown>;
    return {
      family: String(obj.family || "sans-serif"),
      fallback_families: String(obj.fallback_families || "sans-serif"),
      style: String(obj.style || "normal"),
      weight: Number(obj.weight) || 400,
      system: Boolean(obj.system),
      toString() {
        return this.family;
      },
    };
  }

  const str = String(input || "sans-serif").trim();
  // Standard Shopify font handle format: <family>_<style_char><weight_digit>
  // e.g. playfair_display_n4, assistant_n4, helvetica_n7, roboto_i4
  const match = str.match(/^([a-z0-9_]+?)(?:_([ni])(\d))?$/i);
  let familyName = str;
  let style = "normal";
  let weight = 400;

  if (match) {
    familyName = match[1]
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    if (match[2]?.toLowerCase() === "i") style = "italic";
    if (match[3]) weight = parseInt(match[3], 10) * 100;
  }

  const isSerif = /playfair|merriweather|garamond|times|georgia|serif|baskerville/i.test(familyName);
  const isMono = /mono|code|consolas/i.test(familyName);
  const fallback = isSerif ? "serif" : isMono ? "monospace" : "sans-serif";

  return {
    family: familyName,
    fallback_families: fallback,
    style,
    weight,
    system: false,
    toString() {
      return this.family;
    },
  };
}

/**
 * Parses color strings (hex, rgb, rgba, hsl, named colors) to RGBA components.
 */
function parseColorToRgba(input: unknown): ParsedRgba {
  const str = String(input || "").trim().toLowerCase();
  // Default fallback is black
  const fallback: ParsedRgba = { r: 0, g: 0, b: 0, a: 1 };
  if (!str) return fallback;

  // Hex (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (str.startsWith("#")) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100,
      };
    }
  }

  // rgb(...) or rgba(...)
  const rgbMatch = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return {
      r: Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))),
      g: Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))),
      b: Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))),
      a: rgbMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbMatch[4]))) : 1,
    };
  }

  // Common named colors fallback
  const named: Record<string, ParsedRgba> = {
    white: { r: 255, g: 255, b: 255, a: 1 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    transparent: { r: 0, g: 0, b: 0, a: 0 },
    red: { r: 239, g: 68, b: 68, a: 1 },
    green: { r: 34, g: 197, b: 94, a: 1 },
    blue: { r: 59, g: 130, b: 246, a: 1 },
    gray: { r: 107, g: 114, b: 128, a: 1 },
  };

  return named[str] || fallback;
}

/**
 * Standard Shopify Storefront translation dictionary (Dawn/Horizon baseline)
 */
const SHOPIFY_STANDARD_TRANSLATIONS: Record<string, string> = {
  "sections.featured_products.title": "Featured products",
  "sections.featured_products.view_all": "View all",
  "products.product.add_to_cart": "Add to cart",
  "products.product.sold_out": "Sold out",
  "products.product.unavailable": "Unavailable",
  "products.product.on_sale": "Sale",
  "products.product.regular_price": "Regular price",
  "products.product.sale_price": "Sale price",
  "products.product.unit_price": "Unit price",
  "products.product.quantity.label": "Quantity",
  "products.product.quantity.increase": "Increase quantity",
  "products.product.quantity.decrease": "Decrease quantity",
  "products.product.choose_options": "Choose options",
  "products.product.quick_view": "Quick view",
  "general.pagination.previous": "Previous",
  "general.pagination.next": "Next",
  "general.pagination.page": "Page {{ number }}",
  "templates.cart.cart": "Cart",
  "templates.cart.subtotal": "Subtotal",
  "templates.cart.checkout": "Check out",
  "templates.cart.empty": "Your cart is empty",
  "templates.contact.form.title": "Contact",
  "templates.contact.form.name": "Name",
  "templates.contact.form.email": "Email",
  "templates.contact.form.phone": "Phone number",
  "templates.contact.form.comment": "Comment",
  "templates.contact.form.send": "Send",
  "templates.contact.form.post_success": "Thanks for contacting us. We'll get back to you as soon as possible.",
  "accessibility.close": "Close",
  "accessibility.skip_to_text": "Skip to content",
};

export function registerShopifyFilters(engine: Liquid): void {
  /**
   * Filter: image_url
   * Usage: {{ product.featured_image | image_url: width: 600, height: 400 }}
   */
  engine.registerFilter("image_url", (input: unknown, options?: { width?: number; height?: number; crop?: string; format?: string } | number) => {
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
   * Filter: img_url (Legacy & standard Shopify filter)
   * Usage: {{ product.featured_image | img_url: 'master' }}
   * Usage: {{ product.featured_image | img_url: '600x' }}
   * Usage: {{ product.featured_image | img_url: '300x300', crop: 'center' }}
   */
  engine.registerFilter("img_url", (input: unknown, size?: string) => {
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

    const sizeStr = String(size || "master").toLowerCase();
    if (sizeStr === "master" || sizeStr === "original") {
      return url;
    }

    const widthMatch = sizeStr.match(/^(\d+)x?/);
    if (widthMatch && url.includes("images.unsplash.com")) {
      return url.replace(/w=\d+/, `w=${widthMatch[1]}`);
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
    if (opts.sizes) attrs.push(`sizes="${String(opts.sizes)}"`);
    if (opts.widths) {
      const wList = String(opts.widths).split(",").map((w) => w.trim()).filter(Boolean);
      const srcset = wList.map((w) => `${src.replace(/w=\d+/, `w=${w}`)} ${w}w`).join(", ");
      attrs.push(`srcset="${srcset}"`);
    }

    return `<img ${attrs.join(" ")} />`;
  });

  /**
   * Filter: placeholder_svg_tag
   * Usage: {{ 'hero-apparel-1' | placeholder_svg_tag: 'custom-class' }}
   */
  engine.registerFilter("placeholder_svg_tag", (input: unknown, className?: string) => {
    const name = String(input || "image");
    const cls = className ? `class="${className}"` : "";

    return `<svg ${cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="background:#f3f4f6;display:block">
      <defs>
        <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f9fafb" />
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

  // ==========================================================
  // Money Formatting Filters
  // ==========================================================
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

  // ==========================================================
  // Color Manipulation Filters (Shopify OS 2.0 Color Filters)
  // ==========================================================
  engine.registerFilter("color_to_rgb", (color: unknown) => {
    const { r, g, b } = parseColorToRgba(color);
    return `rgb(${r}, ${g}, ${b})`;
  });

  engine.registerFilter("color_to_hex", (color: unknown) => {
    const { r, g, b } = parseColorToRgba(color);
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  });

  engine.registerFilter("color_to_hsl", (color: unknown) => {
    const { r, g, b } = parseColorToRgba(color);
    const rf = r / 255, gf = g / 255, bf = b / 255;
    const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rf: h = (gf - bf) / d + (gf < bf ? 6 : 0); break;
        case gf: h = (bf - rf) / d + 2; break;
        case bf: h = (rf - gf) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  });

  engine.registerFilter("color_modify", (color: unknown, property: string, value: unknown) => {
    const parsed = parseColorToRgba(color);
    const prop = String(property || "").toLowerCase();
    const val = Number(value);

    if (prop === "alpha") {
      const alpha = isNaN(val) ? 1 : Math.max(0, Math.min(1, val));
      return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
    }

    if (prop === "red" && !isNaN(val)) parsed.r = Math.max(0, Math.min(255, val));
    if (prop === "green" && !isNaN(val)) parsed.g = Math.max(0, Math.min(255, val));
    if (prop === "blue" && !isNaN(val)) parsed.b = Math.max(0, Math.min(255, val));

    return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})`;
  });

  engine.registerFilter("color_lighten", (color: unknown, percent: unknown) => {
    const { r, g, b, a } = parseColorToRgba(color);
    const factor = Math.max(0, Math.min(100, Number(percent) || 10)) / 100;
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    return a < 1 ? `rgba(${newR}, ${newG}, ${newB}, ${a})` : `rgb(${newR}, ${newG}, ${newB})`;
  });

  engine.registerFilter("color_darken", (color: unknown, percent: unknown) => {
    const { r, g, b, a } = parseColorToRgba(color);
    const factor = 1 - Math.max(0, Math.min(100, Number(percent) || 10)) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    return a < 1 ? `rgba(${newR}, ${newG}, ${newB}, ${a})` : `rgb(${newR}, ${newG}, ${newB})`;
  });

  engine.registerFilter("color_extract", (color: unknown, component: string) => {
    const { r, g, b, a } = parseColorToRgba(color);
    const comp = String(component || "").toLowerCase();
    switch (comp) {
      case "red": return r;
      case "green": return g;
      case "blue": return b;
      case "alpha": return a;
      case "lightness":
        return Math.round(((Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255) * 100);
      default: return 0;
    }
  });

  engine.registerFilter("color_mix", (color1: unknown, color2: unknown, weight?: unknown) => {
    const c1 = parseColorToRgba(color1);
    const c2 = parseColorToRgba(color2);
    const w = Math.max(0, Math.min(100, Number(weight) || 50)) / 100;
    const r = Math.round(c1.r * (1 - w) + c2.r * w);
    const g = Math.round(c1.g * (1 - w) + c2.g * w);
    const b = Math.round(c1.b * (1 - w) + c2.b * w);
    const a = Math.round((c1.a * (1 - w) + c2.a * w) * 100) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  });

  // ==========================================================
  // Translation & Localization Filter
  // ==========================================================
  engine.registerFilter("t", (key: unknown, params?: Record<string, unknown>) => {
    const k = String(key || "").trim();
    if (!k) return "";

    // 1. Direct dictionary match
    if (SHOPIFY_STANDARD_TRANSLATIONS[k]) {
      let text = SHOPIFY_STANDARD_TRANSLATIONS[k];
      if (params && typeof params === "object") {
        for (const [pKey, pVal] of Object.entries(params)) {
          text = text.replace(new RegExp(`{{\\s*${pKey}\\s*}}`, "g"), String(pVal));
        }
      }
      return text;
    }

    // 2. Dynamic heuristic mappings
    if (k.includes("from_price")) {
      const priceVal = params?.price ? `$${(Number(params.price) / 100).toFixed(2)}` : "$0.00";
      return `From ${priceVal}`;
    }
    if (k.includes("add_to_cart")) return "Add to cart";
    if (k.includes("sold_out")) return "Sold out";
    if (k.includes("sale")) return "Sale";
    if (k.includes("regular_price")) return "Regular price";

    // 3. Fallback: extract last segment and humanize
    const lastPart = k.split(".").pop() || k;
    return lastPart
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  });

  // ==========================================================
  // Assets and URLs
  // ==========================================================
  engine.registerFilter("asset_url", (file: unknown) => `/assets/${file || ""}`);
  engine.registerFilter("asset_img_url", () => "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80");
  engine.registerFilter("file_url", (file: unknown) => `/files/${file || ""}`);
  engine.registerFilter("file_img_url", () => "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80");
  engine.registerFilter("shopify_asset_url", (file: unknown) => `/shopify-assets/${file || ""}`);
  engine.registerFilter("stylesheet_tag", (url: unknown) => `<link rel="stylesheet" href="${url}" />`);
  engine.registerFilter("script_tag", (url: unknown) => `<script src="${url}"></script>`);
  engine.registerFilter("link_to", (label: unknown, url: unknown) => `<a href="${url || "#"}">${label || ""}</a>`);
  engine.registerFilter("link_to_vendor", (vendor: unknown) => `<a href="/collections/all?filter.p.vendor=${encodeURIComponent(String(vendor || ""))}">${vendor || ""}</a>`);
  engine.registerFilter("link_to_type", (type: unknown) => `<a href="/collections/all?filter.p.product_type=${encodeURIComponent(String(type || ""))}">${type || ""}</a>`);
  engine.registerFilter("link_to_tag", (tag: unknown) => `<a href="/collections/all/${encodeURIComponent(String(tag || ""))}">${tag || ""}</a>`);
  engine.registerFilter("within", (url: unknown) => url || "#");

  // ==========================================================
  // String / Formatting / Utility Helpers
  // ==========================================================
  engine.registerFilter("json", (val: unknown) => {
    try {
      return JSON.stringify(val);
    } catch {
      return "{}";
    }
  });

  engine.registerFilter("handleize", (val: unknown) =>
    String(val || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );

  engine.registerFilter("handle", (val: unknown) =>
    String(val || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );

  engine.registerFilter("pluralize", (count: unknown, singular: string, plural: string) =>
    Number(count) === 1 ? singular : plural
  );

  engine.registerFilter("default_errors", () => "");

  engine.registerFilter("weight_with_unit", (weight: unknown, unit?: string) => {
    const w = Number(weight) || 0;
    const u = unit || "g";
    return `${w} ${u}`;
  });

  engine.registerFilter("highlight", (text: unknown, query: unknown) => {
    const t = String(text || "");
    const q = String(query || "").trim();
    if (!q) return t;
    const re = new RegExp(`(${q.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    return t.replace(re, "<mark>$1</mark>");
  });

  // Font Filters (Shopify OS 2.0 Typography)
  engine.registerFilter("font_face", (input: unknown, options?: { font_display?: string }) => {
    const font = toShopifyFontDrop(input);
    const display = options?.font_display || "swap";
    const googleFamily = font.family.replace(/\s+/g, "+");

    return `@import url('https://fonts.googleapis.com/css2?family=${googleFamily}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600;1,700&display=${display}');
@font-face {
  font-family: "${font.family}";
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: ${display};
  src: local("${font.family}");
}`;
  });

  engine.registerFilter("font_modify", (input: unknown, property: string, value: unknown) => {
    const font = toShopifyFontDrop(input);
    const prop = String(property || "").toLowerCase();
    const val = String(value || "");

    const modified = { ...font };
    if (prop === "weight") {
      if (val === "bold" || val === "bolder") modified.weight = 700;
      else if (val === "light" || val === "lighter") modified.weight = 300;
      else if (!isNaN(Number(val))) modified.weight = Number(val);
    } else if (prop === "style") {
      modified.style = val;
    }

    return modified;
  });

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
