export interface MockVariant {
  id: number | string;
  title: string;
  price: number;
  compare_at_price?: number | null;
  available: boolean;
  sku?: string;
}

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
  media: MockMedia[];
  variants: MockVariant[];
  selected_or_first_available_variant: MockVariant;
  tags: string[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 101,
    title: "Aura Minimal Desk Mat",
    handle: "aura-minimal-desk-mat",
    vendor: "Example Studio",
    type: "Workspace",
    description: "Crafted from double-sided waterproof vegan leather with stitched anti-fray borders for smooth mouse glide.",
    price: 4800,
    compare_at_price: 6500,
    available: true,
    url: "/products/aura-minimal-desk-mat",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&auto=format&fit=crop&q=85",
      alt: "Vegan Leather Desk Mat",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&auto=format&fit=crop&q=85",
        alt: "Vegan Leather Desk Mat",
      },
      alt: "Vegan Leather Desk Mat",
    },
    media: [
      {
        media_type: "image",
        preview_image: {
          src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&auto=format&fit=crop&q=85",
          alt: "Primary Desk Mat",
        },
        alt: "Primary Desk Mat",
      },
      {
        media_type: "image",
        preview_image: {
          src: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&auto=format&fit=crop&q=85",
          alt: "Secondary Desk Mat View",
        },
        alt: "Secondary Desk Mat View",
      },
    ],
    variants: [
      { id: "v101-1", title: "Charcoal Black", price: 4800, compare_at_price: 6500, available: true },
      { id: "v101-2", title: "Cognac Tan", price: 4800, compare_at_price: 6500, available: true },
    ],
    selected_or_first_available_variant: {
      id: "v101-1",
      title: "Charcoal Black",
      price: 4800,
      compare_at_price: 6500,
      available: true,
    },
    tags: ["Best Seller", "New", "Workspace"],
  },
  {
    id: 102,
    title: "Ergonomic Lumbar Cushion",
    handle: "ergonomic-lumbar-cushion",
    vendor: "Example Studio",
    type: "Comfort",
    description: "Multi-density memory foam contoured to support natural spinal alignment during long hours at your desk.",
    price: 7500,
    compare_at_price: 9000,
    available: true,
    url: "/products/ergonomic-lumbar-cushion",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=85",
      alt: "Ergonomic Lumbar Cushion",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=85",
        alt: "Ergonomic Lumbar Cushion",
      },
      alt: "Ergonomic Lumbar Cushion",
    },
    media: [
      {
        media_type: "image",
        preview_image: {
          src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=85",
          alt: "Cushion Front",
        },
        alt: "Cushion Front",
      },
    ],
    variants: [
      { id: "v102-1", title: "Oatmeal Grey", price: 7500, compare_at_price: 9000, available: true },
    ],
    selected_or_first_available_variant: {
      id: "v102-1",
      title: "Oatmeal Grey",
      price: 7500,
      compare_at_price: 9000,
      available: true,
    },
    tags: ["Comfort", "Sale"],
  },
  {
    id: 103,
    title: "Titanium Orbit Key Loop",
    handle: "titanium-orbit-key-loop",
    vendor: "Example Studio",
    type: "Everyday Carry",
    description: "Grade 5 aerospace titanium quick-release key management system that never weakens with repeated opening.",
    price: 3400,
    compare_at_price: null,
    available: true,
    url: "/products/titanium-orbit-key-loop",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=900&auto=format&fit=crop&q=85",
      alt: "Titanium Key Loop",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=900&auto=format&fit=crop&q=85",
        alt: "Titanium Key Loop",
      },
      alt: "Titanium Key Loop",
    },
    media: [
      {
        media_type: "image",
        preview_image: {
          src: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=900&auto=format&fit=crop&q=85",
          alt: "Key Loop View",
        },
        alt: "Key Loop View",
      },
    ],
    variants: [
      { id: "v103-1", title: "Matte Stonewash", price: 3400, compare_at_price: null, available: true },
    ],
    selected_or_first_available_variant: {
      id: "v103-1",
      title: "Matte Stonewash",
      price: 3400,
      compare_at_price: null,
      available: true,
    },
    tags: ["EDC", "Titanium"],
  },
  {
    id: 104,
    title: "Solid Walnut MagSafe Stand",
    handle: "solid-walnut-magsafe-stand",
    vendor: "Example Studio",
    type: "Charging",
    description: "Weighted American walnut stand with integrated cable routing for convenient one-handed phone docking.",
    price: 8900,
    compare_at_price: 11000,
    available: true,
    url: "/products/solid-walnut-magsafe-stand",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85",
      alt: "MagSafe Stand",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85",
        alt: "MagSafe Stand",
      },
      alt: "MagSafe Stand",
    },
    media: [
      {
        media_type: "image",
        preview_image: {
          src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85",
          alt: "MagSafe Stand Standalone",
        },
        alt: "MagSafe Stand Standalone",
      },
    ],
    variants: [
      { id: "v104-1", title: "Natural Walnut", price: 8900, compare_at_price: 11000, available: true },
      { id: "v104-2", title: "Smoked Ash", price: 9500, compare_at_price: 12000, available: true },
    ],
    selected_or_first_available_variant: {
      id: "v104-1",
      title: "Natural Walnut",
      price: 8900,
      compare_at_price: 11000,
      available: true,
    },
    tags: ["MagSafe", "Handcrafted"],
  },
];

// Product specifically styled for sticky add to cart
export const MOCK_STICKY_PRODUCT: MockProduct = {
  id: 999,
  title: "Aura Pro Wireless ANC Earbuds",
  handle: "aura-pro-wireless-anc-earbuds",
  vendor: "Example Studio",
  type: "Audio",
  description: "High-resolution 40mm beryllium drivers with adaptive hybrid noise cancellation and 36-hour battery life.",
  price: 14900,
  compare_at_price: 19900,
  available: true,
  url: "/products/aura-pro-wireless-anc-earbuds",
  has_only_default_variant: false,
  featured_image: {
    src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    alt: "Aura Pro Wireless Earbuds",
    width: 600,
    height: 600,
  },
  featured_media: {
    media_type: "image",
    preview_image: {
      src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      alt: "Aura Pro Wireless Earbuds",
    },
    alt: "Aura Pro Wireless Earbuds",
  },
  media: [],
  variants: [
    { id: "v999-1", title: "Matte Black", price: 14900, compare_at_price: 19900, available: true },
    { id: "v999-2", title: "Silver White", price: 14900, compare_at_price: 19900, available: true },
    { id: "v999-3", title: "Midnight Navy", price: 14900, compare_at_price: 19900, available: false },
  ],
  selected_or_first_available_variant: {
    id: "v999-1",
    title: "Matte Black",
    price: 14900,
    compare_at_price: 19900,
    available: true,
  },
  tags: ["Featured", "Audio", "Best Seller"],
};
