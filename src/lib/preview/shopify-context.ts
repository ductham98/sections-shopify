import { SectionSchema } from "./preview-types";
import { buildSectionSettings, buildSectionBlocks } from "./schema-engine";
import { getMockDataset } from "./mock-data/datasets";
import { DatasetId } from "./mock-data/types";

export interface ShopifyContextOptions {
  sectionId?: string;
  datasetId?: DatasetId;
  schema?: SectionSchema | null;
  overrides?: Record<string, unknown>;
  productLimit?: number;
}

/**
 * Standard Shopify Global Theme Settings (Dawn / OS 2.0 default properties)
 */
export const MOCK_GLOBAL_THEME_SETTINGS: Record<string, unknown> = {
  page_width: 1200,
  spacing_sections: 36,
  spacing_grid_horizontal: 16,
  spacing_grid_vertical: 16,
  currency_code_enabled: true,
  badge_position: "top-left",
  badge_corner_radius: 4,
  sale_badge_color_scheme: "accent-1",
  sold_out_badge_color_scheme: "inverse",
  card_style: "standard",
  card_image_padding: 0,
  card_color_scheme: "background-1",
  card_text_alignment: "left",
  cart_type: "drawer",
  show_vendor: false,
  social_twitter_link: "https://twitter.com/shopify",
  social_facebook_link: "https://facebook.com/shopify",
  social_instagram_link: "https://instagram.com/shopify",
  social_tiktok_link: "https://tiktok.com/@shopify",
  social_youtube_link: "https://youtube.com/shopify",
  predictive_search_enabled: true,
  inputs_shadow_opacity: 0,
  buttons_shadow_opacity: 0,
};

/**
 * Builds standard Shopify Storefront Liquid context.
 */
export function buildShopifyContext(options: ShopifyContextOptions = {}): Record<string, unknown> {
  const {
    sectionId = "preview-section",
    datasetId = "general",
    schema = null,
    overrides = {},
    productLimit,
  } = options;

  const dataset = getMockDataset(datasetId);

  // Apply optional product limit from Inspector
  const products = productLimit ? dataset.products.slice(0, productLimit) : dataset.products;
  const collection = {
    ...dataset.collection,
    products,
    products_count: products.length,
    all_products_count: products.length,
  };

  const defaultSettings = buildSectionSettings(
    schema,
    dataset,
    sectionId,
    (overrides.settings as Record<string, unknown>) || {}
  );
  const defaultBlocks = buildSectionBlocks(schema);

  const section = {
    id: sectionId,
    index: 1,
    location: "template",
    settings: defaultSettings,
    blocks: defaultBlocks,
  };

  const context: Record<string, unknown> = {
    section,
    product: dataset.featuredProduct,
    products,
    collection,
    collections: dataset.collections,
    shop: {
      ...dataset.shop,
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} USD",
      customer_accounts_enabled: true,
      customer_accounts_optional: true,
      published_locales: [
        { iso_code: "en", name: "English", primary: true },
      ],
      enabled_currencies: [
        { iso_code: "USD", name: "US Dollar", symbol: "$" },
        { iso_code: "EUR", name: "Euro", symbol: "€" },
        { iso_code: "GBP", name: "British Pound", symbol: "£" },
      ],
    },
    theme: {
      id: 98765432,
      name: "Dawn (Shopify OS 2.0)",
      role: "main",
    },
    settings: {
      ...MOCK_GLOBAL_THEME_SETTINGS,
      ...((overrides.themeSettings as Record<string, unknown>) || {}),
    },
    customer: {
      id: 10099,
      first_name: "Alex",
      last_name: "Morgan",
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 555-0199",
      has_account: true,
      orders_count: 2,
      tags: ["VIP", "Newsletter"],
      default_address: {
        address1: "123 Market St",
        city: "San Francisco",
        province: "California",
        zip: "94105",
        country: "United States",
      },
    },
    routes: dataset.routes,
    cart: dataset.cart,
    form: {
      posted_successfully: false,
      "posted_successfully?": false,
      errors: [],
    },
    request: {
      page_type: "index",
      design_mode: true, // Emulates theme editor so dynamic scripts and editor features initialize
      host: dataset.shop.domain,
      path: "/",
      locale: { iso_code: "en", name: "English", direction: "ltr", primary: true },
    },
    localization: {
      language: { iso_code: "en", name: "English" },
      country: { iso_code: "US", name: "United States", currency: { iso_code: "USD", symbol: "$" } },
      market: { id: "us", handle: "us" },
      available_languages: [
        { iso_code: "en", name: "English", endonym_name: "English" },
        { iso_code: "fr", name: "French", endonym_name: "Français" },
      ],
      available_countries: [
        { iso_code: "US", name: "United States", currency: { iso_code: "USD", symbol: "$" } },
        { iso_code: "CA", name: "Canada", currency: { iso_code: "CAD", symbol: "$" } },
      ],
    },
    canonical_url: `https://${dataset.shop.domain}/`,
    content_for_header: "<!-- Shopify Header Scripts -->",
    content_for_layout: "<!-- Shopify Section Content -->",
    ...overrides,
  };

  return context;
}
