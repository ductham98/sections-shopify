import { SectionSchema } from "./preview-types";
import { getDefaultSectionSettings, getDefaultSectionBlocks } from "./liquid-schema";
import { MOCK_PRODUCTS, MOCK_STICKY_PRODUCT } from "../../data/preview/products";
import { MOCK_COLLECTION, MOCK_COLLECTIONS } from "../../data/preview/collections";
import { MOCK_SHOP, MOCK_ROUTES, MOCK_CART } from "../../data/preview/shop";

export interface ShopifyContextOptions {
  sectionId?: string;
  schema?: SectionSchema | null;
  overrides?: Record<string, unknown>;
}

export function buildShopifyContext(options: ShopifyContextOptions = {}): Record<string, unknown> {
  const { sectionId = "template--preview-section", schema = null, overrides = {} } = options;

  const defaultSettings = getDefaultSectionSettings(schema, sectionId);
  const defaultBlocks = getDefaultSectionBlocks(schema);

  const section = {
    id: sectionId,
    settings: {
      ...defaultSettings,
      ...(overrides.settings as Record<string, unknown> || {}),
    },
    blocks: defaultBlocks,
  };

  const context: Record<string, unknown> = {
    section,
    product: MOCK_STICKY_PRODUCT,
    products: MOCK_PRODUCTS,
    collection: MOCK_COLLECTION,
    collections: MOCK_COLLECTIONS,
    shop: MOCK_SHOP,
    routes: MOCK_ROUTES,
    cart: MOCK_CART,
    form: {
      posted_successfully: false,
      "posted_successfully?": false,
      errors: [],
    },
    request: {
      page_type: "index",
      design_mode: false,
      host: "example.store",
      path: "/",
    },
    ...overrides,
  };

  return context;
}
