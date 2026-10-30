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
    if (!input) {
      return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80";
    }

    let url = "";
    if (typeof input === "string") {
      url = input;
    } else if (typeof input === "object" && input !== null) {
      const img = input as ImageObject;
      if (img.src) {
        url = img.src;
      } else if (img.url) {
        url = img.url;
      } else if (img.preview_image?.src) {
        url = img.preview_image.src;
      }
    }

    if (!url) {
      return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80";
    }

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

    if (opts.class) {
      attrs.push(`class="${String(opts.class)}"`);
    }
    if (opts.loading) {
      attrs.push(`loading="${String(opts.loading)}"`);
    } else {
      attrs.push(`loading="lazy"`);
    }
    if (opts.width || width) {
      attrs.push(`width="${opts.width || width}"`);
    }
    if (opts.height || height) {
      attrs.push(`height="${opts.height || height}"`);
    }
    if (opts.style) {
      attrs.push(`style="${String(opts.style)}"`);
    }

    return `<img ${attrs.join(" ")} />`;
  });

  /**
   * Filter: placeholder_svg_tag
   * Usage: {{ 'collection-1' | placeholder_svg_tag: 'custom-class' }}
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

  /**
   * Filter: money
   * Usage: {{ product.price | money }}
   */
  engine.registerFilter("money", (cents: unknown) => {
    const num = Number(cents);
    if (isNaN(num)) return "$0.00";
    return `$${(num / 100).toFixed(2)}`;
  });

  /**
   * Filter: money_with_currency
   */
  engine.registerFilter("money_with_currency", (cents: unknown) => {
    const num = Number(cents);
    if (isNaN(num)) return "$0.00 USD";
    return `$${(num / 100).toFixed(2)} USD`;
  });

  /**
   * Filter: t (translation filter)
   * Usage: {{ 'products.product.price.from_price_html' | t: price: product.price }}
   */
  engine.registerFilter("t", (key: unknown, params?: Record<string, unknown>) => {
    const k = String(key || "");
    if (k.includes("from_price")) {
      const priceVal = params?.price ? `$${(Number(params.price) / 100).toFixed(2)}` : "$0.00";
      return `From ${priceVal}`;
    }
    if (k.includes("add_to_cart")) return "Add to cart";
    if (k.includes("sold_out")) return "Sold out";
    if (k.includes("sale")) return "Sale";
    return k.split(".").pop() || k;
  });

  /**
   * Filter: default_errors
   */
  engine.registerFilter("default_errors", () => {
    return "";
  });
}

