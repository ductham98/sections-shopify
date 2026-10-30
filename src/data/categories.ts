export interface Category {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "all",
    name: "All Sections",
    nameVi: "All Sections",
    description: "Browse the full collection of copy-paste Shopify Liquid sections",
    icon: "LayoutGrid"
  },
  {
    id: "hero",
    name: "Hero & Banner",
    nameVi: "Hero & Banner",
    description: "High-impact hero banners with responsive images, buttons & overlays",
    icon: "Sparkles"
  },
  {
    id: "features",
    name: "Features & Bento Grid",
    nameVi: "Features & Bento Grid",
    description: "Showcase product capabilities, stats, and benefits with modern layouts",
    icon: "Layers"
  },
  {
    id: "product",
    name: "Product & Conversion",
    nameVi: "Product & Conversion",
    description: "Sticky add-to-cart bars, quick buy triggers, and checkout accelerators",
    icon: "ShoppingBag"
  },
  {
    id: "social-proof",
    name: "Social Proof & Reviews",
    nameVi: "Social Proof & Reviews",
    description: "Build buyer trust with verified reviews, star ratings, and logo marquees",
    icon: "Star"
  },
  {
    id: "faq",
    name: "FAQ & Support",
    nameVi: "FAQ & Support",
    description: "Interactive accordion FAQs with instant live keyword search",
    icon: "HelpCircle"
  },
  {
    id: "header",
    name: "Announcement & Header",
    nameVi: "Announcement & Header",
    description: "Infinite marquee announcement bars, promo tickers, and top banners",
    icon: "Megaphone"
  }
];
