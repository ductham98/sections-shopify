/**
 * Theme Runtime Manager
 * Manages Preview Base Theme styles, Dawn OS 2.0 CSS tokens,
 * Shopify JavaScript APIs, and in-iframe client interactions.
 */

export interface ThemeRuntimeConfig {
  fontFamily?: string;
  headingFontFamily?: string;
  baseFontSize?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  pageWidth?: number;
}

/**
 * Returns the Preview Base Theme CSS reset and Shopify Dawn storefront foundation.
 */
export function getBaseThemeCss(config: ThemeRuntimeConfig = {}): string {
  const bodyFont =
    config.fontFamily ||
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  const headingFont =
    config.headingFontFamily ||
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  const bgColor = config.backgroundColor || "#ffffff";
  const textColor = config.textColor || "#111827";
  const pageWidth = config.pageWidth || 1200;

  return `
/* ========================================================
 * Shopify Storefront Base Theme Foundation (Dawn OS 2.0)
 * ======================================================== */
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --font-body-family: ${bodyFont};
  --font-heading-family: ${headingFont};
  --font-body-scale: 1.0;
  --font-heading-scale: 1.0;

  --color-base-text: ${textColor};
  --color-base-background-1: ${bgColor};
  --color-base-background-2: #f9fafb;
  --color-base-solid-button-labels: #ffffff;
  --color-base-outline-button-labels: #111827;
  --color-base-accent-1: #111827;
  --color-base-accent-2: #3b82f6;
  --payment-terms-background-color: #ffffff;

  --page-width: ${pageWidth}px;
  --page-width-margin: 1.5rem;
  --grid-desktop-vertical-spacing: 24px;
  --grid-desktop-horizontal-spacing: 24px;
  --grid-mobile-vertical-spacing: 16px;
  --grid-mobile-horizontal-spacing: 16px;
  --media-radius: 8px;
  --buttons-radius: 6px;
  --inputs-radius: 6px;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: var(--color-base-background-1);
  color: var(--color-base-text);
  font-family: var(--font-body-family);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  width: 100%;
  min-height: 100%;
}

#shopify-section-preview-root {
  display: flow-root;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
}

.shopify-section {
  display: block;
  width: 100%;
}

img, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

ul, ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading-family);
  margin-top: 0;
  color: inherit;
}

p {
  margin-top: 0;
}

/* ========================================================
 * Shopify Standard Color Schemes & Utility Classes
 * ======================================================== */
.color-background-1,
.color-scheme-1 {
  background-color: #ffffff;
  color: #111827;
  --color-foreground: 17, 24, 39;
  --color-background: 255, 255, 255;
}

.color-background-2,
.color-scheme-2 {
  background-color: #f9fafb;
  color: #111827;
  --color-foreground: 17, 24, 39;
  --color-background: 249, 250, 251;
}

.color-inverse,
.color-scheme-3 {
  background-color: #111827;
  color: #ffffff;
  --color-foreground: 255, 255, 255;
  --color-background: 17, 24, 39;
}

.color-accent-1,
.color-scheme-4 {
  background-color: #f3f4f6;
  color: #111827;
}

.color-accent-2,
.color-scheme-5 {
  background-color: #1e293b;
  color: #ffffff;
}

/* Standard Page Width Container */
.page-width {
  max-width: var(--page-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.page-width-desktop {
  padding-left: 2rem;
  padding-right: 2rem;
}

@media screen and (max-width: 749px) {
  .page-width {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Accessibility */
.visually-hidden {
  position: absolute !important;
  overflow: hidden;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  word-wrap: normal !important;
}

/* Common Buttons */
.button, .button--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--buttons-radius);
  background-color: var(--color-base-accent-1);
  color: var(--color-base-solid-button-labels);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover, .button--primary:hover {
  opacity: 0.9;
}

.button--secondary {
  background-color: transparent;
  color: var(--color-base-text);
  border: 1px solid #d1d5db;
}

.button--secondary:hover {
  background-color: #f3f4f6;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 4px;
}

.badge--onsale {
  background-color: #ef4444;
  color: #ffffff;
}

.badge--soldout {
  background-color: #6b7280;
  color: #ffffff;
}

/* Ensure sticky elements (like Sticky Add to Cart) are visible in preview frame */
.sticky-atc-bar {
  transform: translateY(0) !important;
  position: relative !important;
}
`;
}

/**
 * Returns approved preview interaction and Shopify Storefront runtime scripts.
 */
export function getPreviewRuntimeScript(sectionId: string = "preview-section"): string {
  return `
(function() {
  'use strict';

  // 1. Initialize Shopify Storefront global environment
  window.Shopify = window.Shopify || {};
  window.Shopify.shop = 'velroxa-demo.myshopify.com';
  window.Shopify.locale = 'en';
  window.Shopify.currency = { active: 'USD', rate: '1.0' };
  window.Shopify.country = 'US';
  window.Shopify.theme = { name: 'Dawn (Shopify OS 2.0)', id: 98765432, role: 'main' };
  window.Shopify.designMode = true;
  window.Shopify.routes = {
    root: '/',
    cart: '/cart',
    cart_add_url: '/cart/add.js',
    cart_change_url: '/cart/change.js',
    cart_update_url: '/cart/update.js',
    cart_clear_url: '/cart/clear.js',
    predictive_search_url: '/search/suggest.json'
  };

  window.Shopify.formatMoney = function(cents, format) {
    var n = Number(cents);
    if (isNaN(n)) return '$0.00';
    return '$' + (n / 100).toFixed(2);
  };

  // 2. Mock in-memory Shopify Cart API Interceptor
  var mockCart = {
    token: 'preview-cart-token',
    note: null,
    attributes: {},
    total_price: 12300,
    total_weight: 500,
    item_count: 2,
    items: [
      {
        id: 1001,
        title: 'Aura Minimal Desk Mat - Standard',
        price: 4800,
        line_price: 4800,
        quantity: 1,
        featured_image: { url: 'https://plus.unsplash.com/premium_photo-1678074057896-eee996d4a23e?w=300' }
      },
      {
        id: 1002,
        title: 'Ergonomic Lumbar Cushion',
        price: 7500,
        line_price: 7500,
        quantity: 1,
        featured_image: { url: 'https://plus.unsplash.com/premium_photo-1673548917477-4c0c8889b439?w=300' }
      }
    ],
    requires_shipping: true,
    currency: 'USD'
  };

  var originalFetch = window.fetch;
  window.fetch = function(input, init) {
    var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');

    // Match cart endpoints
    if (url.includes('/cart/add.js') || url.includes('/cart/add')) {
      mockCart.item_count += 1;
      mockCart.total_price += 4800;
      document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true, detail: mockCart }));
      document.dispatchEvent(new CustomEvent('shopify:cart:updated', { bubbles: true, detail: mockCart }));
      return Promise.resolve(new Response(JSON.stringify(mockCart.items[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    if (url.includes('/cart.js')) {
      return Promise.resolve(new Response(JSON.stringify(mockCart), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    if (url.includes('/cart/change.js') || url.includes('/cart/update.js')) {
      return Promise.resolve(new Response(JSON.stringify(mockCart), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    return originalFetch.apply(this, arguments);
  };

  // 3. Prevent top-level page navigation inside iframe preview
  document.addEventListener('click', function(e) {
    var anchor = e.target.closest('a');
    if (anchor) {
      var href = anchor.getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('/'))) {
        e.preventDefault();
      }
    }
  }, true);

  document.addEventListener('submit', function(e) {
    e.preventDefault();
  }, true);

  // 4. Dispatch Shopify Theme Editor Section Lifecycle Events
  function dispatchSectionEvents() {
    var currentSectionId = ${JSON.stringify(sectionId)};
    var detail = { sectionId: currentSectionId, load: false };
    document.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true, detail: detail }));
    document.dispatchEvent(new CustomEvent('shopify:section:select', { bubbles: true, detail: detail }));
  }

  // 5. Dynamic height measurement with requestAnimationFrame debounce
  var lastSentHeight = 0;
  var rafId = null;

  function measureAndReport() {
    var root = document.getElementById('shopify-section-preview-root') || document.body;
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

    var width = root ? root.offsetWidth : (body ? body.offsetWidth : 1200);

    if (height > 20 && Math.abs(height - lastSentHeight) >= 1) {
      lastSentHeight = height;
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'shopify-preview-dimensions',
          height: height,
          width: width
        }, '*');
      }
    }
  }

  function scheduleMeasure() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(measureAndReport);
  }

  window.addEventListener('load', function() {
    dispatchSectionEvents();
    scheduleMeasure();
  });
  window.addEventListener('resize', scheduleMeasure);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleMeasure);
  }

  var images = document.images;
  for (var i = 0; i < images.length; i++) {
    if (!images[i].complete) {
      images[i].addEventListener('load', scheduleMeasure);
      images[i].addEventListener('error', scheduleMeasure);
    }
  }

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(scheduleMeasure);
    var rootEl = document.getElementById('shopify-section-preview-root');
    if (rootEl) ro.observe(rootEl);
    if (document.body) ro.observe(document.body);
  }

  setTimeout(dispatchSectionEvents, 50);
  setTimeout(scheduleMeasure, 60);
  setTimeout(scheduleMeasure, 250);
  setTimeout(scheduleMeasure, 800);
  setTimeout(scheduleMeasure, 1500);
})();
`;
}
