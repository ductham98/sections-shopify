// Sample images and realistic Shopify objects for Liquid previews

export const SAMPLE_IMAGES = {
  heroDesktop: {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000&auto=format&fit=crop&q=85",
    alt: "Modern Interior Living Space"
  },
  heroMobile: {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=85",
    alt: "Modern Interior Living Space Mobile"
  },
  products: [
    {
      id: 101,
      title: "Aura Minimal Desk Mat",
      vendor: "Velroxa Studio",
      price: 4800,
      compare_at_price: 6500,
      available: true,
      url: "#",
      has_only_default_variant: true,
      featured_image: {
        src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
        alt: "Vegan Leather Desk Mat"
      },
      featured_media: {
        preview_image: {
          src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
          alt: "Vegan Leather Desk Mat"
        },
        alt: "Vegan Leather Desk Mat"
      },
      selected_or_first_available_variant: {
        id: 1011,
        title: "Default Title",
        price: 4800,
        compare_at_price: 6500,
        available: true
      }
    },
    {
      id: 102,
      title: "Ergonomic Lumbar Cushion",
      vendor: "Velroxa Studio",
      price: 7500,
      compare_at_price: 9000,
      available: true,
      url: "#",
      has_only_default_variant: true,
      featured_image: {
        src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
        alt: "Ergonomic Lumbar Cushion"
      },
      featured_media: {
        preview_image: {
          src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
          alt: "Ergonomic Lumbar Cushion"
        },
        alt: "Ergonomic Lumbar Cushion"
      },
      selected_or_first_available_variant: {
        id: 1021,
        title: "Default Title",
        price: 7500,
        compare_at_price: 9000,
        available: true
      }
    },
    {
      id: 103,
      title: "Titanium Orbit Key Loop",
      vendor: "Velroxa Studio",
      price: 3400,
      compare_at_price: null,
      available: true,
      url: "#",
      has_only_default_variant: true,
      featured_image: {
        src: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80",
        alt: "Titanium Key Loop"
      },
      featured_media: {
        preview_image: {
          src: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80",
          alt: "Titanium Key Loop"
        },
        alt: "Titanium Key Loop"
      },
      selected_or_first_available_variant: {
        id: 1031,
        title: "Default Title",
        price: 3400,
        compare_at_price: null,
        available: true
      }
    },
    {
      id: 104,
      title: "Solid Walnut MagSafe Stand",
      vendor: "Velroxa Studio",
      price: 8900,
      compare_at_price: 11000,
      available: true,
      url: "#",
      has_only_default_variant: true,
      featured_image: {
        src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
        alt: "MagSafe Stand"
      },
      featured_media: {
        preview_image: {
          src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
          alt: "MagSafe Stand"
        },
        alt: "MagSafe Stand"
      },
      selected_or_first_available_variant: {
        id: 1041,
        title: "Default Title",
        price: 8900,
        compare_at_price: 11000,
        available: true
      }
    }
  ],
  categories: [
    {
      src: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&auto=format&fit=crop&q=80",
      alt: "Desk Setup Category"
    },
    {
      src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&auto=format&fit=crop&q=80",
      alt: "Travel & Everyday Carry"
    },
    {
      src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80",
      alt: "Audio & Minimal Tech"
    }
  ],
  avatars: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80",
      alt: "Sarah Jenkins"
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
      alt: "Marcus Sterling"
    },
    {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
      alt: "Elena Rostova"
    }
  ]
};

export interface SchemaSetting {
  id?: string;
  default?: unknown;
}

export interface SchemaBlock {
  id?: string;
  type: string;
  settings?: Record<string, unknown>;
  shopify_attributes?: string;
}

export interface SchemaPreset {
  name?: string;
  blocks?: SchemaBlock[];
  settings?: Record<string, unknown>;
}

export interface SchemaData {
  name?: string;
  settings?: SchemaSetting[];
  blocks?: SchemaBlock[];
  presets?: SchemaPreset[];
}

export function getMockShopifyContext(filename: string, schema: SchemaData): Record<string, unknown> {
  const sectionId = "preview-" + filename.replace(/[^a-zA-Z0-9]/g, "-");

  // Extract settings from schema defaults
  const settings: Record<string, unknown> = {};
  if (Array.isArray(schema.settings)) {
    for (const s of schema.settings) {
      if (s && s.id) {
        settings[s.id] = s.default !== undefined ? s.default : "";
      }
    }
  }

  // Extract blocks from schema presets or schema blocks
  let blocks: SchemaBlock[] = [];
  const primaryPreset = schema.presets && schema.presets[0];
  if (primaryPreset && Array.isArray(primaryPreset.blocks)) {
    blocks = primaryPreset.blocks.map((b, idx: number) => ({
      id: `block-${idx}`,
      type: b.type,
      settings: { ...b.settings },
      shopify_attributes: ""
    }));
  }

  // Section-specific enhancements for realistic visual appeal
  if (filename === "custom-hero.liquid") {
    settings.image = SAMPLE_IMAGES.heroDesktop;
    settings.mobile_image = SAMPLE_IMAGES.heroMobile;
    settings.eyebrow = settings.eyebrow || "VELROXA ESSENTIALS";
    settings.heading = settings.heading || "Designed for Modern Living";
    settings.text = settings.text || "Thoughtful ergonomics, tactile materials, and timeless form for your everyday space.";
    settings.button_label = settings.button_label || "Shop Collection";
    settings.button_link = "#";
    settings.secondary_button_label = settings.secondary_button_label || "Discover Details";
    settings.secondary_button_link = "#";
    settings.desktop_height = 540;
    settings.mobile_height = 420;
    settings.content_position = "middle-left";
    settings.text_alignment = "left";
  }

  if (filename === "custom-featured-products.liquid") {
    settings.collection = {
      title: "Curated Collection",
      products_count: SAMPLE_IMAGES.products.length,
      products: SAMPLE_IMAGES.products
    };
    settings.products_to_show = 4;
    settings.columns_desktop = "4";
    settings.show_header = true;
    settings.heading = settings.heading || "Curated Essentials";
    settings.eyebrow = settings.eyebrow || "NEW ARRIVALS";
    settings.description = settings.description || "Designed with obsessive attention to craft, longevity, and tactile pleasure.";
    settings.show_quick_add = true;
    settings.quick_add_label = "Add to Cart";
    settings.show_sale_badge = true;
    settings.show_price = true;
    settings.show_compare_price = true;
  }

  if (filename === "feature-categories.liquid") {
    settings.heading = settings.heading || "Featured Categories";
    settings.description = settings.description || "Thoughtfully designed collections for every corner of your daily life.";
    if (blocks.length >= 3) {
      if (blocks[0].settings) blocks[0].settings.image = SAMPLE_IMAGES.categories[0];
      if (blocks[1].settings) blocks[1].settings.image = SAMPLE_IMAGES.categories[1];
      if (blocks[2].settings) blocks[2].settings.image = SAMPLE_IMAGES.categories[2];
    }
  }

  if (filename === "testimonials-carousel.liquid") {
    if (blocks.length >= 3) {
      if (blocks[0].settings) blocks[0].settings.avatar = SAMPLE_IMAGES.avatars[0];
      if (blocks[1].settings) blocks[1].settings.avatar = SAMPLE_IMAGES.avatars[1];
      if (blocks[2].settings) blocks[2].settings.avatar = SAMPLE_IMAGES.avatars[2];
    }
  }

  const defaultProduct = {
    id: 999,
    title: "Aura Pro Wireless ANC Earbuds",
    vendor: "Velroxa Studio",
    price: 14900,
    compare_at_price: 19900,
    available: true,
    url: "#",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      alt: "Aura Pro Wireless Earbuds"
    },
    selected_or_first_available_variant: {
      id: 9991,
      title: "Matte Black",
      price: 14900,
      compare_at_price: 19900,
      available: true
    },
    variants: [
      { id: "v1", title: "Matte Black", price: 14900, available: true },
      { id: "v2", title: "Silver White", price: 14900, available: true }
    ]
  };

  return {
    section: {
      id: sectionId,
      settings,
      blocks
    },
    product: defaultProduct,
    collection: {
      title: "Featured Collection",
      products_count: SAMPLE_IMAGES.products.length,
      products: SAMPLE_IMAGES.products
    },
    shop: {
      name: "Velroxa Living",
      currency: "USD",
      money_format: "${{amount}}"
    },
    cart: {
      item_count: 2,
      total_price: 19700
    },
    form: {
      posted_successfully: false,
      errors: []
    }
  };
}
