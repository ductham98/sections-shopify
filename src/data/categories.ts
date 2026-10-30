export interface Category {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "all",
    name: "All Sections",
    nameVi: "Tất cả Section",
    description: "Browse the full collection of copy-paste Shopify Liquid sections",
    icon: "LayoutGrid",
    color: "indigo"
  },
  {
    id: "hero",
    name: "Hero & Banner",
    nameVi: "Hero & Banner",
    description: "High-impact hero banners with responsive images, buttons & overlays",
    icon: "Sparkles",
    color: "purple"
  },
  {
    id: "features",
    name: "Features & Bento",
    nameVi: "Tính năng & Bento Grid",
    description: "Showcase product capabilities, stats, and benefits with modern layouts",
    icon: "Layers",
    color: "blue"
  },
  {
    id: "social-proof",
    name: "Social Proof & Reviews",
    nameVi: "Đánh giá & Testimonials",
    description: "Build buyer trust with verified reviews, star ratings, and logo marquees",
    icon: "Star",
    color: "amber"
  },
  {
    id: "product",
    name: "Product & Conversion",
    nameVi: "Sản phẩm & Chốt đơn",
    description: "Sticky add-to-cart bars, quick buy triggers, and checkout accelerators",
    icon: "ShoppingBag",
    color: "emerald"
  },
  {
    id: "faq",
    name: "FAQ & Help",
    nameVi: "Hỏi đáp & Hỗ trợ",
    description: "Interactive accordion FAQs with instant live keyword search",
    icon: "HelpCircle",
    color: "cyan"
  },
  {
    id: "header",
    name: "Announcement & Header",
    nameVi: "Thông báo & Header",
    description: "Infinite marquee announcement bars, promo tickers, and top banners",
    icon: "Megaphone",
    color: "rose"
  }
];
