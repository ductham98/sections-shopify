import { MOCK_PRODUCTS, MockProduct } from "./products";

export interface MockCollection {
  id: number | string;
  handle: string;
  title: string;
  description: string;
  url: string;
  products_count: number;
  products: MockProduct[];
  image?: {
    src: string;
    alt: string;
  };
}

export const MOCK_COLLECTION: MockCollection = {
  id: "col-01",
  handle: "featured-essentials",
  title: "Modern Workspace Essentials",
  description: "Curated ergonomic tools and minimalist desk accessories engineered for productivity.",
  url: "/collections/featured-essentials",
  products_count: MOCK_PRODUCTS.length,
  products: MOCK_PRODUCTS,
  image: {
    src: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&auto=format&fit=crop&q=80",
    alt: "Workspace Essentials Collection",
  },
};

export const MOCK_COLLECTIONS: Record<string, MockCollection> = {
  "featured-essentials": MOCK_COLLECTION,
  all: {
    ...MOCK_COLLECTION,
    handle: "all",
    title: "All Products",
    url: "/collections/all",
  },
};

