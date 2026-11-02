/**
 * Theme Runtime Manager
 * Manages Preview Base Theme styles, Google Fonts, theme CSS tokens,
 * dependency resolution, and approved client-side preview interactions.
 */

export interface ThemeRuntimeConfig {
  fontFamily?: string;
  headingFontFamily?: string;
  baseFontSize?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Returns the Preview Base Theme CSS reset and storefront styling foundation.
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

  return `
/* ========================================================
 * Shopify Storefront Base Theme Foundation
 * ======================================================== */
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --font-body-family: ${bodyFont};
  --font-heading-family: ${headingFont};
  --color-base-text: ${textColor};
  --color-base-background-1: ${bgColor};
  --color-base-solid-button-labels: #ffffff;
  --page-width: 1440px;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: ${bgColor};
  color: ${textColor};
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

/* Ensure sticky elements (like Sticky Add to Cart) are visible in preview frame */
.sticky-atc-bar {
  transform: translateY(0) !important;
  position: relative !important;
}
`;
}

/**
 * Returns approved preview interaction scripts:
 * - Dynamic height auto-reporting (ResizeObserver + postMessage)
 * - Accordion expand/collapse
 * - Carousel / slider navigation simulation
 * - Quantity selector controls
 * - Form/link navigation interceptor
 */
export function getPreviewRuntimeScript(): string {
  return `
(function() {
  'use strict';

  // 1. Intercept link clicks to prevent iframe navigation
  document.addEventListener('click', function(e) {
    var anchor = e.target.closest('a');
    if (anchor) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // 2. Intercept form submits
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  // 3. Dynamic height measurement with requestAnimationFrame debounce
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

  window.addEventListener('load', scheduleMeasure);
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

  // 4. Approved Preview Interaction Adapters:
  document.addEventListener('click', function(e) {
    // A. Quantity selectors (+ and -)
    var btn = e.target.closest('[data-quantity-button], .quantity__button, .quantity-btn');
    if (btn) {
      e.preventDefault();
      var input = btn.parentElement ? btn.parentElement.querySelector('input[type="number"], .quantity__input') : null;
      if (input) {
        var current = parseInt(input.value, 10) || 1;
        var isPlus = btn.name === 'plus' || btn.classList.contains('quantity__button--plus') || btn.textContent.trim() === '+';
        var next = isPlus ? current + 1 : Math.max(1, current - 1);
        input.value = next;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // B. Carousel / Slider arrows simulation
    var sliderBtn = e.target.closest('.slider-button, .carousel-prev, .carousel-next, [data-slider-prev], [data-slider-next]');
    if (sliderBtn) {
      e.preventDefault();
      var container = sliderBtn.closest('.carousel-container, .slider, .velroxa-featured-products__grid-wrap');
      if (container) {
        var scrollTarget = container.querySelector('.slider__grid, .carousel-track, ul') || container;
        var isNext = sliderBtn.classList.contains('carousel-next') || sliderBtn.hasAttribute('data-slider-next') || sliderBtn.textContent.includes('›') || sliderBtn.textContent.includes('>');
        var scrollAmount = 320;
        scrollTarget.scrollBy({ left: isNext ? scrollAmount : -scrollAmount, behavior: 'smooth' });
      }
    }
  });

  setTimeout(scheduleMeasure, 60);
  setTimeout(scheduleMeasure, 250);
  setTimeout(scheduleMeasure, 800);
  setTimeout(scheduleMeasure, 1500);
})();
`;
}

