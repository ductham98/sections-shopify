export interface MockShop {
  name: string;
  email: string;
  domain: string;
  permanent_domain: string;
  currency: string;
  money_format: string;
  money_with_currency_format: string;
  url: string;
  secure_url: string;
  phone: string;
  locale: string;
}

export const MOCK_SHOP: MockShop = {
  name: "Demo Concept Store",
  email: "support@example.com",
  domain: "example.com",
  permanent_domain: "demo.myshopify.com",
  currency: "USD",
  money_format: "${{amount}}",
  money_with_currency_format: "${{amount}} USD",
  url: "https://example.store",
  secure_url: "https://example.store",
  phone: "+1 (800) 555-0199",
  locale: "en",
};

export interface MockRoutes {
  root_url: string;
  cart_url: string;
  cart_add_url: string;
  cart_change_url: string;
  cart_clear_url: string;
  search_url: string;
  collections_url: string;
  all_products_collection_url: string;
}

export const MOCK_ROUTES: MockRoutes = {
  root_url: "/",
  cart_url: "/cart",
  cart_add_url: "/cart/add",
  cart_change_url: "/cart/change",
  cart_clear_url: "/cart/clear",
  search_url: "/search",
  collections_url: "/collections",
  all_products_collection_url: "/collections/all",
};

export interface MockCart {
  item_count: number;
  total_price: number;
  items: unknown[];
}

export const MOCK_CART: MockCart = {
  item_count: 2,
  total_price: 13700,
  items: [],
};
