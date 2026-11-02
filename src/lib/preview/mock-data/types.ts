export type DatasetId = "general" | "fashion" | "beauty" | "furniture" | "electronics";

export interface MockImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface MockMedia {
  media_type: "image";
  preview_image: MockImage;
  alt: string;
}

export interface MockVariant {
  id: number | string;
  title: string;
  price: number;
  compare_at_price?: number | null;
  available: boolean;
  sku?: string;
  featured_image?: MockImage;
}

export interface MockProduct {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  type: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  available: boolean;
  url: string;
  has_only_default_variant: boolean;
  featured_image: MockImage;
  featured_media: MockMedia;
  images: MockImage[];
  media: MockMedia[];
  variants: MockVariant[];
  selected_or_first_available_variant: MockVariant;
  options: Array<{ name: string; values: string[] }>;
  tags: string[];
  rating?: number;
  rating_count?: number;
}

export interface MockCollection {
  id: number | string;
  handle: string;
  title: string;
  description: string;
  url: string;
  products_count: number;
  all_products_count: number;
  products: MockProduct[];
  image?: MockImage;
}

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

export interface MockCartItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
  line_price: number;
  product: MockProduct;
  variant: MockVariant;
}

export interface MockCart {
  item_count: number;
  total_price: number;
  items: MockCartItem[];
}

export interface MockDataset {
  id: DatasetId;
  name: string;
  description: string;
  products: MockProduct[];
  featuredProduct: MockProduct;
  collection: MockCollection;
  collections: Record<string, MockCollection>;
  shop: MockShop;
  routes: MockRoutes;
  cart: MockCart;
}

