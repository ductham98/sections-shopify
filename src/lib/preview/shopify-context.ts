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
    settings: defaultSettings,
    blocks: defaultBlocks,
  };

  const context: Record<string, unknown> = {
    section,
    product: dataset.featuredProduct,
    products,
    collection,
    collections: dataset.collections,
    shop: dataset.shop,
    routes: dataset.routes,
    cart: dataset.cart,
    form: {
      posted_successfully: false,
      "posted_successfully?": false,
      errors: [],
    },
    request: {
      page_type: "index",
      design_mode: false,
      host: dataset.shop.domain,
      path: "/",
    },
    localization: {
      language: { iso_code: "en", name: "English" },
      country: { iso_code: "US", name: "United States", currency: { iso_code: "USD", symbol: "$" } },
      market: { id: "us", handle: "us" },
    },
    ...overrides,
  };

  return context;
}
