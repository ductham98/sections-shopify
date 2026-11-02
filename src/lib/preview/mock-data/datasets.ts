import { MockDataset, MockProduct, MockCollection, MockShop, MockRoutes, MockCart, DatasetId } from "./types";

const SHARED_ROUTES: MockRoutes = {
  root_url: "/",
  cart_url: "/cart",
  cart_add_url: "/cart/add",
  cart_change_url: "/cart/change",
  cart_clear_url: "/cart/clear",
  search_url: "/search",
  collections_url: "/collections",
  all_products_collection_url: "/collections/all",
};

/* ========================================================
 * 1. GENERAL DATASET (Workspace & Living)
 * ======================================================== */
const GENERAL_PRODUCTS: MockProduct[] = [
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
    images: [
      { src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&auto=format&fit=crop&q=85", alt: "Desk Mat" },
    ],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&auto=format&fit=crop&q=85", alt: "Desk Mat" },
        alt: "Desk Mat",
      },
    ],
    variants: [
      { id: 1001, title: "Midnight Black / Standard", price: 4800, compare_at_price: 6500, available: true },
      { id: 1002, title: "Saddle Tan / Extended", price: 5400, compare_at_price: 7000, available: true },
    ],
    selected_or_first_available_variant: { id: 1001, title: "Midnight Black / Standard", price: 4800, compare_at_price: 6500, available: true },
    options: [{ name: "Color", values: ["Midnight Black", "Saddle Tan"] }],
    tags: ["Desk", "Workspace", "Leather"],
    rating: 4.9,
    rating_count: 142,
  },
  {
    id: 102,
    title: "Ergonomic Lumbar Cushion",
    handle: "ergonomic-lumbar-cushion",
    vendor: "Form & Function",
    type: "Comfort",
    description: "High-density charcoal memory foam contours precisely along the lower lumbar spine to eliminate back strain.",
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
    images: [
      { src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=85", alt: "Lumbar Cushion" },
    ],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=85", alt: "Lumbar Cushion" },
        alt: "Lumbar Cushion",
      },
    ],
    variants: [
      { id: 1003, title: "Default Title", price: 7500, compare_at_price: 9000, available: true },
    ],
    selected_or_first_available_variant: { id: 1003, title: "Default Title", price: 7500, compare_at_price: 9000, available: true },
    options: [{ name: "Title", values: ["Default Title"] }],
    tags: ["Ergonomic", "Support", "Chairs"],
    rating: 4.8,
    rating_count: 89,
  },
  {
    id: 103,
    title: "Titanium Orbit Key Loop",
    handle: "titanium-orbit-key-loop",
    vendor: "Kinetik Goods",
    type: "Everyday Carry",
    description: "CNC-milled Grade 5 aerospace titanium key carrier with stainless spring mechanism.",
    price: 3400,
    compare_at_price: null,
    available: true,
    url: "/products/titanium-orbit-key-loop",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85",
      alt: "Titanium Key Carrier",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85",
        alt: "Titanium Key Carrier",
      },
      alt: "Titanium Key Carrier",
    },
    images: [{ src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85", alt: "Titanium EDC" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85", alt: "Titanium EDC" },
        alt: "Titanium EDC",
      },
    ],
    variants: [{ id: 1004, title: "Raw Titanium", price: 3400, available: true }],
    selected_or_first_available_variant: { id: 1004, title: "Raw Titanium", price: 3400, available: true },
    options: [{ name: "Finish", values: ["Raw Titanium"] }],
    tags: ["EDC", "Titanium", "Hardware"],
    rating: 5.0,
    rating_count: 53,
  },
  {
    id: 104,
    title: "Solid Walnut MagSafe Stand",
    handle: "solid-walnut-magsafe-stand",
    vendor: "Nordic Atelier",
    type: "Tech Stand",
    description: "Sustainably harvested American Walnut charging dock with weighted brass base and integrated cable management.",
    price: 8900,
    compare_at_price: 11000,
    available: true,
    url: "/products/solid-walnut-magsafe-stand",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&auto=format&fit=crop&q=85",
      alt: "MagSafe Stand",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&auto=format&fit=crop&q=85",
        alt: "MagSafe Stand",
      },
      alt: "MagSafe Stand",
    },
    images: [{ src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&auto=format&fit=crop&q=85", alt: "MagSafe Stand" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&auto=format&fit=crop&q=85", alt: "MagSafe Stand" },
        alt: "MagSafe Stand",
      },
    ],
    variants: [
      { id: 1005, title: "Natural Walnut", price: 8900, compare_at_price: 11000, available: true },
      { id: 1006, title: "Smoked Oak", price: 9200, compare_at_price: 11500, available: true },
    ],
    selected_or_first_available_variant: { id: 1005, title: "Natural Walnut", price: 8900, compare_at_price: 11000, available: true },
    options: [{ name: "Wood", values: ["Natural Walnut", "Smoked Oak"] }],
    tags: ["Woodwork", "Charging", "Apple"],
    rating: 4.9,
    rating_count: 210,
  },
];

/* ========================================================
 * 2. FASHION DATASET (Apparel & Streetwear)
 * ======================================================== */
const FASHION_PRODUCTS: MockProduct[] = [
  {
    id: 201,
    title: "Heavyweight Boxy Oversized Tee",
    handle: "heavyweight-boxy-oversized-tee",
    vendor: "Atelier Mercer",
    type: "Apparel",
    description: "280 GSM combed organic cotton with dropped shoulder seams and reinforced ribbed collar.",
    price: 5200,
    compare_at_price: 6500,
    available: true,
    url: "/products/heavyweight-boxy-oversized-tee",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=85",
      alt: "Heavyweight Boxy Tee",
      width: 900,
      height: 1100,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=85",
        alt: "Heavyweight Boxy Tee",
      },
      alt: "Heavyweight Boxy Tee",
    },
    images: [{ src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=85", alt: "Heavyweight Tee" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=85", alt: "Heavyweight Tee" },
        alt: "Heavyweight Tee",
      },
    ],
    variants: [
      { id: 2001, title: "Vintage Washed Black / S", price: 5200, compare_at_price: 6500, available: true },
      { id: 2002, title: "Vintage Washed Black / M", price: 5200, compare_at_price: 6500, available: true },
      { id: 2003, title: "Vintage Washed Black / L", price: 5200, compare_at_price: 6500, available: true },
    ],
    selected_or_first_available_variant: { id: 2002, title: "Vintage Washed Black / M", price: 5200, compare_at_price: 6500, available: true },
    options: [{ name: "Size", values: ["S", "M", "L"] }],
    tags: ["Cotton", "Tees", "Streetwear"],
    rating: 4.8,
    rating_count: 320,
  },
  {
    id: 202,
    title: "Relaxed Wool Tailored Overcoat",
    handle: "relaxed-wool-tailored-overcoat",
    vendor: "Nordic Atelier",
    type: "Outerwear",
    description: "Double-faced virgin wool blend tailored with wide peak lapels and horn buttons.",
    price: 34000,
    compare_at_price: 42000,
    available: true,
    url: "/products/relaxed-wool-tailored-overcoat",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=85",
      alt: "Relaxed Wool Overcoat",
      width: 900,
      height: 1100,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=85",
        alt: "Relaxed Wool Overcoat",
      },
      alt: "Relaxed Wool Overcoat",
    },
    images: [{ src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=85", alt: "Wool Overcoat" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=85", alt: "Wool Overcoat" },
        alt: "Wool Overcoat",
      },
    ],
    variants: [
      { id: 2004, title: "Camel / 38R", price: 34000, compare_at_price: 42000, available: true },
      { id: 2005, title: "Camel / 40R", price: 34000, compare_at_price: 42000, available: true },
    ],
    selected_or_first_available_variant: { id: 2004, title: "Camel / 38R", price: 34000, compare_at_price: 42000, available: true },
    options: [{ name: "Size", values: ["38R", "40R"] }],
    tags: ["Outerwear", "Wool", "Luxury"],
    rating: 4.9,
    rating_count: 78,
  },
  {
    id: 203,
    title: "Lugged Chelsea Boot in Tuscan Leather",
    handle: "lugged-chelsea-boot",
    vendor: "Monaco Footwear",
    type: "Footwear",
    description: "Hand-burnished Italian calfskin with Goodyear-welted Vibram lug sole.",
    price: 24500,
    compare_at_price: null,
    available: true,
    url: "/products/lugged-chelsea-boot",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&auto=format&fit=crop&q=85",
      alt: "Lugged Chelsea Boot",
      width: 900,
      height: 1100,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&auto=format&fit=crop&q=85",
        alt: "Lugged Chelsea Boot",
      },
      alt: "Lugged Chelsea Boot",
    },
    images: [{ src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&auto=format&fit=crop&q=85", alt: "Chelsea Boot" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&auto=format&fit=crop&q=85", alt: "Chelsea Boot" },
        alt: "Chelsea Boot",
      },
    ],
    variants: [
      { id: 2006, title: "Espresso / 42 EU", price: 24500, available: true },
      { id: 2007, title: "Espresso / 43 EU", price: 24500, available: true },
    ],
    selected_or_first_available_variant: { id: 2006, title: "Espresso / 42 EU", price: 24500, available: true },
    options: [{ name: "Size", values: ["42 EU", "43 EU"] }],
    tags: ["Boots", "Leather", "Footwear"],
    rating: 5.0,
    rating_count: 94,
  },
  {
    id: 204,
    title: "Cashmere Ribbed Knit Beanie",
    handle: "cashmere-ribbed-knit-beanie",
    vendor: "Atelier Mercer",
    type: "Accessories",
    description: "100% Grade-A Mongolian cashmere with seamless circular knitting technique.",
    price: 6800,
    compare_at_price: 8500,
    available: true,
    url: "/products/cashmere-ribbed-knit-beanie",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&auto=format&fit=crop&q=85",
      alt: "Cashmere Beanie",
      width: 900,
      height: 1100,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&auto=format&fit=crop&q=85",
        alt: "Cashmere Beanie",
      },
      alt: "Cashmere Beanie",
    },
    images: [{ src: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&auto=format&fit=crop&q=85", alt: "Cashmere Beanie" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&auto=format&fit=crop&q=85", alt: "Cashmere Beanie" },
        alt: "Cashmere Beanie",
      },
    ],
    variants: [{ id: 2008, title: "Oatmeal", price: 6800, compare_at_price: 8500, available: true }],
    selected_or_first_available_variant: { id: 2008, title: "Oatmeal", price: 6800, compare_at_price: 8500, available: true },
    options: [{ name: "Color", values: ["Oatmeal"] }],
    tags: ["Cashmere", "Accessories", "Winter"],
    rating: 4.9,
    rating_count: 145,
  },
];

/* ========================================================
 * 3. BEAUTY DATASET (Cosmetics & Skincare)
 * ======================================================== */
const BEAUTY_PRODUCTS: MockProduct[] = [
  {
    id: 301,
    title: "Botanical Restorative Facial Oil",
    handle: "botanical-restorative-facial-oil",
    vendor: "Lumière Botanics",
    type: "Skincare",
    description: "Cold-pressed rosehip seed, squalane and blue tansy extract to replenish lipid barrier overnight.",
    price: 6400,
    compare_at_price: 7800,
    available: true,
    url: "/products/botanical-restorative-facial-oil",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1608248597359-0099413f4125?w=900&auto=format&fit=crop&q=85",
      alt: "Restorative Facial Oil",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1608248597359-0099413f4125?w=900&auto=format&fit=crop&q=85",
        alt: "Restorative Facial Oil",
      },
      alt: "Restorative Facial Oil",
    },
    images: [{ src: "https://images.unsplash.com/photo-1608248597359-0099413f4125?w=900&auto=format&fit=crop&q=85", alt: "Facial Oil" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1608248597359-0099413f4125?w=900&auto=format&fit=crop&q=85", alt: "Facial Oil" },
        alt: "Facial Oil",
      },
    ],
    variants: [{ id: 3001, title: "30 ml", price: 6400, compare_at_price: 7800, available: true }],
    selected_or_first_available_variant: { id: 3001, title: "30 ml", price: 6400, compare_at_price: 7800, available: true },
    options: [{ name: "Volume", values: ["30 ml"] }],
    tags: ["Serum", "Clean Beauty", "Organic"],
    rating: 4.9,
    rating_count: 240,
  },
  {
    id: 302,
    title: "Mineral Hydrating Peptide Cleanser",
    handle: "mineral-hydrating-peptide-cleanser",
    vendor: "Lumière Botanics",
    type: "Skincare",
    description: "Sulfate-free gel-to-milk emulsion infused with deep-sea red algae and triple copper peptides.",
    price: 3800,
    compare_at_price: null,
    available: true,
    url: "/products/mineral-hydrating-peptide-cleanser",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85",
      alt: "Peptide Cleanser",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85",
        alt: "Peptide Cleanser",
      },
      alt: "Peptide Cleanser",
    },
    images: [{ src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85", alt: "Cleanser" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85", alt: "Cleanser" },
        alt: "Cleanser",
      },
    ],
    variants: [{ id: 3002, title: "150 ml", price: 3800, available: true }],
    selected_or_first_available_variant: { id: 3002, title: "150 ml", price: 3800, available: true },
    options: [{ name: "Volume", values: ["150 ml"] }],
    tags: ["Cleanser", "Hydration", "Gentle"],
    rating: 4.8,
    rating_count: 180,
  },
  {
    id: 303,
    title: "Centella & Niacinamide Barrier Cream",
    handle: "centella-barrier-cream",
    vendor: "K-Pure Lab",
    type: "Moisturizer",
    description: "Soothing ceramide complex designed for sensitive skin recovery after chemical exfoliation.",
    price: 4600,
    compare_at_price: 5500,
    available: true,
    url: "/products/centella-barrier-cream",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&auto=format&fit=crop&q=85",
      alt: "Barrier Cream",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&auto=format&fit=crop&q=85",
        alt: "Barrier Cream",
      },
      alt: "Barrier Cream",
    },
    images: [{ src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&auto=format&fit=crop&q=85", alt: "Barrier Cream" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&auto=format&fit=crop&q=85", alt: "Barrier Cream" },
        alt: "Barrier Cream",
      },
    ],
    variants: [{ id: 3003, title: "50 ml", price: 4600, compare_at_price: 5500, available: true }],
    selected_or_first_available_variant: { id: 3003, title: "50 ml", price: 4600, compare_at_price: 5500, available: true },
    options: [{ name: "Size", values: ["50 ml"] }],
    tags: ["Ceramides", "Moisturizer", "Sensitive"],
    rating: 5.0,
    rating_count: 312,
  },
  {
    id: 304,
    title: "Aromatherapy Cedarwood Hand Balm",
    handle: "cedarwood-hand-balm",
    vendor: "Lumière Botanics",
    type: "Bodycare",
    description: "Ultra-nourishing shea butter and vetiver root ointment for dry hands and cuticles.",
    price: 2800,
    compare_at_price: null,
    available: true,
    url: "/products/cedarwood-hand-balm",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1617897903246-719242758050?w=900&auto=format&fit=crop&q=85",
      alt: "Cedarwood Hand Balm",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1617897903246-719242758050?w=900&auto=format&fit=crop&q=85",
        alt: "Cedarwood Hand Balm",
      },
      alt: "Cedarwood Hand Balm",
    },
    images: [{ src: "https://images.unsplash.com/photo-1617897903246-719242758050?w=900&auto=format&fit=crop&q=85", alt: "Hand Balm" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1617897903246-719242758050?w=900&auto=format&fit=crop&q=85", alt: "Hand Balm" },
        alt: "Hand Balm",
      },
    ],
    variants: [{ id: 3004, title: "75 ml", price: 2800, available: true }],
    selected_or_first_available_variant: { id: 3004, title: "75 ml", price: 2800, available: true },
    options: [{ name: "Size", values: ["75 ml"] }],
    tags: ["Bodycare", "Shea Butter", "Nourishing"],
    rating: 4.8,
    rating_count: 98,
  },
];

/* ========================================================
 * 4. FURNITURE DATASET (Interior & Living)
 * ======================================================== */
const FURNITURE_PRODUCTS: MockProduct[] = [
  {
    id: 401,
    title: "Nordic Bouclé Accent Lounge Chair",
    handle: "nordic-boucle-accent-lounge-chair",
    vendor: "Kobenhavn Design",
    type: "Furniture",
    description: "Solid ash wood frame wrapped in textural Italian wool bouclé with ergonomic recline angle.",
    price: 89000,
    compare_at_price: 115000,
    available: true,
    url: "/products/nordic-boucle-accent-lounge-chair",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=900&auto=format&fit=crop&q=85",
      alt: "Bouclé Lounge Chair",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=900&auto=format&fit=crop&q=85",
        alt: "Bouclé Lounge Chair",
      },
      alt: "Bouclé Lounge Chair",
    },
    images: [{ src: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=900&auto=format&fit=crop&q=85", alt: "Lounge Chair" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=900&auto=format&fit=crop&q=85", alt: "Lounge Chair" },
        alt: "Lounge Chair",
      },
    ],
    variants: [
      { id: 4001, title: "Ivory Bouclé / Natural Ash", price: 89000, compare_at_price: 115000, available: true },
      { id: 4002, title: "Charcoal Bouclé / Smoked Ash", price: 92000, compare_at_price: 120000, available: true },
    ],
    selected_or_first_available_variant: { id: 4001, title: "Ivory Bouclé / Natural Ash", price: 89000, compare_at_price: 115000, available: true },
    options: [{ name: "Upholstery", values: ["Ivory Bouclé", "Charcoal Bouclé"] }],
    tags: ["Seating", "Lounge", "Scandinavian"],
    rating: 4.9,
    rating_count: 56,
  },
  {
    id: 402,
    title: "Travertine Minimalist Coffee Table",
    handle: "travertine-coffee-table",
    vendor: "Kobenhavn Design",
    type: "Tables",
    description: "Honed Roman travertine marble with bullnose edges and monolithic fluted cylindrical pedestals.",
    price: 145000,
    compare_at_price: null,
    available: true,
    url: "/products/travertine-coffee-table",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=900&auto=format&fit=crop&q=85",
      alt: "Travertine Coffee Table",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=900&auto=format&fit=crop&q=85",
        alt: "Travertine Coffee Table",
      },
      alt: "Travertine Coffee Table",
    },
    images: [{ src: "https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=900&auto=format&fit=crop&q=85", alt: "Coffee Table" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=900&auto=format&fit=crop&q=85", alt: "Coffee Table" },
        alt: "Coffee Table",
      },
    ],
    variants: [{ id: 4003, title: "Beige Travertine", price: 145000, available: true }],
    selected_or_first_available_variant: { id: 4003, title: "Beige Travertine", price: 145000, available: true },
    options: [{ name: "Stone", values: ["Beige Travertine"] }],
    tags: ["Marble", "Living Room", "Stone"],
    rating: 5.0,
    rating_count: 24,
  },
  {
    id: 403,
    title: "Cast Brass Pendant Task Lamp",
    handle: "cast-brass-pendant-lamp",
    vendor: "Lumina Studio",
    type: "Lighting",
    description: "Spun brass shade with hand-rubbed antique patina and warm 2700K dimmable LED fixture.",
    price: 32000,
    compare_at_price: 38000,
    available: true,
    url: "/products/cast-brass-pendant-lamp",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85",
      alt: "Brass Pendant Lamp",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85",
        alt: "Brass Pendant Lamp",
      },
      alt: "Brass Pendant Lamp",
    },
    images: [{ src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85", alt: "Brass Lamp" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85", alt: "Brass Lamp" },
        alt: "Brass Lamp",
      },
    ],
    variants: [{ id: 4004, title: "Brushed Brass", price: 32000, compare_at_price: 38000, available: true }],
    selected_or_first_available_variant: { id: 4004, title: "Brushed Brass", price: 32000, compare_at_price: 38000, available: true },
    options: [{ name: "Finish", values: ["Brushed Brass"] }],
    tags: ["Lighting", "Brass", "Pendant"],
    rating: 4.8,
    rating_count: 67,
  },
  {
    id: 404,
    title: "Hand-Knotted Organic Jute Rug",
    handle: "hand-knotted-jute-rug",
    vendor: "Kobenhavn Design",
    type: "Textiles",
    description: "Thick hand-spun unbleached natural jute woven by artisan cooperatives.",
    price: 49000,
    compare_at_price: 58000,
    available: true,
    url: "/products/hand-knotted-jute-rug",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&auto=format&fit=crop&q=85",
      alt: "Jute Area Rug",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&auto=format&fit=crop&q=85",
        alt: "Jute Area Rug",
      },
      alt: "Jute Area Rug",
    },
    images: [{ src: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&auto=format&fit=crop&q=85", alt: "Jute Rug" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&auto=format&fit=crop&q=85", alt: "Jute Rug" },
        alt: "Jute Rug",
      },
    ],
    variants: [
      { id: 4005, title: "6 x 9 ft", price: 49000, compare_at_price: 58000, available: true },
      { id: 4006, title: "8 x 10 ft", price: 68000, compare_at_price: 79000, available: true },
    ],
    selected_or_first_available_variant: { id: 4005, title: "6 x 9 ft", price: 49000, compare_at_price: 58000, available: true },
    options: [{ name: "Dimensions", values: ["6 x 9 ft", "8 x 10 ft"] }],
    tags: ["Rugs", "Natural Fibers", "Textiles"],
    rating: 4.9,
    rating_count: 112,
  },
];

/* ========================================================
 * 5. ELECTRONICS DATASET (Audio & Tech Hardware)
 * ======================================================== */
const ELECTRONICS_PRODUCTS: MockProduct[] = [
  {
    id: 501,
    title: "Acoustic Hifi Studio Headphones",
    handle: "acoustic-hifi-studio-headphones",
    vendor: "Sonomaster Audio",
    type: "Audio",
    description: "Open-back planar magnetic drivers with memory foam lambskin earpads and balanced silver-plated cable.",
    price: 39900,
    compare_at_price: 49900,
    available: true,
    url: "/products/acoustic-hifi-studio-headphones",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85",
      alt: "Studio Headphones",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85",
        alt: "Studio Headphones",
      },
      alt: "Studio Headphones",
    },
    images: [{ src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85", alt: "Headphones" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85", alt: "Headphones" },
        alt: "Headphones",
      },
    ],
    variants: [
      { id: 5001, title: "Matte Black", price: 39900, compare_at_price: 49900, available: true },
      { id: 5002, title: "Silver Anodized", price: 42900, compare_at_price: 52900, available: true },
    ],
    selected_or_first_available_variant: { id: 5001, title: "Matte Black", price: 39900, compare_at_price: 49900, available: true },
    options: [{ name: "Color", values: ["Matte Black", "Silver Anodized"] }],
    tags: ["Audiophile", "Headphones", "Planar"],
    rating: 4.9,
    rating_count: 188,
  },
  {
    id: 502,
    title: "Wireless Mechanical 75% Keyboard",
    handle: "wireless-mechanical-keyboard",
    vendor: "Keyworks Forge",
    type: "Peripherals",
    description: "CNC aluminum case, hot-swappable tactile switches, gasket mounted plate, and RGB per-key backlighting.",
    price: 18500,
    compare_at_price: 22000,
    available: true,
    url: "/products/wireless-mechanical-keyboard",
    has_only_default_variant: false,
    featured_image: {
      src: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=85",
      alt: "Mechanical Keyboard",
      width: 900,
      height: 600,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=85",
        alt: "Mechanical Keyboard",
      },
      alt: "Mechanical Keyboard",
    },
    images: [{ src: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=85", alt: "Keyboard" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=85", alt: "Keyboard" },
        alt: "Keyboard",
      },
    ],
    variants: [
      { id: 5003, title: "Retro Grey / Tactile", price: 18500, compare_at_price: 22000, available: true },
      { id: 5004, title: "Cyber Teal / Linear", price: 18500, compare_at_price: 22000, available: true },
    ],
    selected_or_first_available_variant: { id: 5003, title: "Retro Grey / Tactile", price: 18500, compare_at_price: 22000, available: true },
    options: [{ name: "Switch & Color", values: ["Retro Grey / Tactile", "Cyber Teal / Linear"] }],
    tags: ["Keyboard", "Custom", "Peripherals"],
    rating: 4.8,
    rating_count: 310,
  },
  {
    id: 503,
    title: "Precision Smart Ambient Dial",
    handle: "precision-smart-ambient-dial",
    vendor: "Sonomaster Audio",
    type: "Controllers",
    description: "Tactile haptic rotary controller for smart home volume, lighting gradients, and media playback.",
    price: 9800,
    compare_at_price: null,
    available: true,
    url: "/products/precision-smart-ambient-dial",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85",
      alt: "Smart Ambient Dial",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85",
        alt: "Smart Ambient Dial",
      },
      alt: "Smart Ambient Dial",
    },
    images: [{ src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85", alt: "Smart Dial" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85", alt: "Smart Dial" },
        alt: "Smart Dial",
      },
    ],
    variants: [{ id: 5005, title: "Space Grey", price: 9800, available: true }],
    selected_or_first_available_variant: { id: 5005, title: "Space Grey", price: 9800, available: true },
    options: [{ name: "Color", values: ["Space Grey"] }],
    tags: ["Smart Home", "Hardware", "Audio"],
    rating: 4.7,
    rating_count: 65,
  },
  {
    id: 504,
    title: "Dual 100W GaN Desktop Power Base",
    handle: "dual-gan-power-base",
    vendor: "VoltForge Engineering",
    type: "Charging",
    description: "Compact Gallium Nitride multi-port power adapter with dual USB-C PD 3.1 and smart power distribution.",
    price: 8400,
    compare_at_price: 10500,
    available: true,
    url: "/products/dual-gan-power-base",
    has_only_default_variant: true,
    featured_image: {
      src: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=85",
      alt: "GaN Desktop Charger",
      width: 900,
      height: 900,
    },
    featured_media: {
      media_type: "image",
      preview_image: {
        src: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=85",
        alt: "GaN Desktop Charger",
      },
      alt: "GaN Desktop Charger",
    },
    images: [{ src: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=85", alt: "GaN Charger" }],
    media: [
      {
        media_type: "image",
        preview_image: { src: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=85", alt: "GaN Charger" },
        alt: "GaN Charger",
      },
    ],
    variants: [{ id: 5006, title: "Standard White", price: 8400, compare_at_price: 10500, available: true }],
    selected_or_first_available_variant: { id: 5006, title: "Standard White", price: 8400, compare_at_price: 10500, available: true },
    options: [{ name: "Color", values: ["Standard White"] }],
    tags: ["Power", "GaN", "Accessories"],
    rating: 4.9,
    rating_count: 178,
  },
];

/* ========================================================
 * Helper to build dataset bundle
 * ======================================================== */
function createDatasetBundle(
  id: DatasetId,
  name: string,
  desc: string,
  products: MockProduct[],
  shopName: string,
  collectionTitle: string,
  collectionImage: string
): MockDataset {
  const collection: MockCollection = {
    id: `col-${id}`,
    handle: `${id}-featured`,
    title: collectionTitle,
    description: desc,
    url: `/collections/${id}-featured`,
    products_count: products.length,
    all_products_count: products.length,
    products,
    image: {
      src: collectionImage,
      alt: collectionTitle,
    },
  };

  const collections: Record<string, MockCollection> = {
    [`${id}-featured`]: collection,
    all: {
      ...collection,
      handle: "all",
      title: "All Products",
      url: "/collections/all",
    },
  };

  const shop: MockShop = {
    name: shopName,
    email: `support@${id}-concept.store`,
    domain: `${id}-concept.store`,
    permanent_domain: `${id}-concept.myshopify.com`,
    currency: "USD",
    money_format: "${{amount}}",
    money_with_currency_format: "${{amount}} USD",
    url: `https://${id}-concept.store`,
    secure_url: `https://${id}-concept.store`,
    phone: "+1 (800) 555-0199",
    locale: "en",
  };

  const cart: MockCart = {
    item_count: 2,
    total_price: products[0].price + (products[1]?.price || 0),
    items: [
      {
        id: 1,
        title: products[0].title,
        quantity: 1,
        price: products[0].price,
        line_price: products[0].price,
        product: products[0],
        variant: products[0].selected_or_first_available_variant,
      },
    ],
  };

  return {
    id,
    name,
    description: desc,
    products,
    featuredProduct: products[0],
    collection,
    collections,
    shop,
    routes: SHARED_ROUTES,
    cart,
  };
}

export const MOCK_DATASETS: Record<DatasetId, MockDataset> = {
  general: createDatasetBundle(
    "general",
    "General & Workspace",
    "Curated ergonomic tools and minimalist desk accessories engineered for productivity.",
    GENERAL_PRODUCTS,
    "Aura Concept Store",
    "Modern Essentials",
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&auto=format&fit=crop&q=80"
  ),
  fashion: createDatasetBundle(
    "fashion",
    "Fashion & Apparel",
    "Contemporary streetwear, tailored virgin wool outerwear, and Italian leather footwear.",
    FASHION_PRODUCTS,
    "Mercer & Co. Studio",
    "Autumn/Winter Edit",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
  ),
  beauty: createDatasetBundle(
    "beauty",
    "Beauty & Skincare",
    "Botanical facial oils, peptide cleansers, and biocompatible barrier recovery formulations.",
    BEAUTY_PRODUCTS,
    "Lumière Botanics",
    "Clinical Radiance Rituals",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80"
  ),
  furniture: createDatasetBundle(
    "furniture",
    "Furniture & Living",
    "Hand-crafted solid wood seating, travertine tables, and artisanal lighting fixtures.",
    FURNITURE_PRODUCTS,
    "København Living",
    "Nordic Living Anthology",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80"
  ),
  electronics: createDatasetBundle(
    "electronics",
    "Electronics & Audio",
    "Precision-engineered audiophile headphones, custom mechanical keyboards, and GaN chargers.",
    ELECTRONICS_PRODUCTS,
    "Volt & Sonic Labs",
    "Precision Hardware Edition",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80"
  ),
};

export function getMockDataset(id: DatasetId = "general"): MockDataset {
  return MOCK_DATASETS[id] || MOCK_DATASETS.general;
}

