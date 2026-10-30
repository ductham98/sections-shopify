export interface SectionMeta {
  id: string;
  filename: string;
  title: string;
  titleVi: string;
  category: "hero" | "features" | "social-proof" | "product" | "faq" | "header";
  plan: "free" | "gold";
  description: string;
  descriptionVi: string;
  previewImage: string;
  presetName: string;
  tags: string[];
  features: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  shopifyVersion: "Online Store 2.0";
  demoUrl?: string;
  updatedAt: string;
}

export const SECTIONS_METADATA: SectionMeta[] = [
  {
    id: "custom-hero",
    filename: "custom-hero.liquid",
    title: "Velroxa Responsive Hero",
    titleVi: "Velroxa Hero Banner Tùy Biến Đa Kích Thước",
    category: "hero",
    plan: "free",
    description: "High-impact hero banner with separate desktop and mobile image support, customizable content alignments, overlays, fluid typography, and CTA buttons.",
    descriptionVi: "Banner Hero cao cấp hỗ trợ ảnh riêng cho Desktop & Mobile, chỉnh sửa màu sắc, padding, nút CTA và hiệu ứng overlay hoàn toàn qua Theme Editor.",
    previewImage: "/previews/custom-hero.svg",
    presetName: "Custom Hero",
    tags: ["Responsive", "Mobile Switcher", "Full Width", "High Impact"],
    features: [
      "Separate images for Desktop & Mobile viewports",
      "Customizable content alignment (Left, Center, Right)",
      "Dynamic background, text & button color pickers",
      "Custom overlay opacity slider",
      "Slide indicator dots option"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-30"
  },
  {
    id: "custom-featured-products",
    filename: "custom-featured-products.liquid",
    title: "Velroxa Featured Products",
    titleVi: "Lưới Sản Phẩm Nổi Bật Tùy Biến (Featured Products)",
    category: "product",
    plan: "free",
    description: "Dynamic product showcase grid with sale badges, customizable column counts, responsive spacing, and direct add to cart integration.",
    descriptionVi: "Hiển thị sản phẩm nổi bật từ bộ sưu tập với nhãn Sale, giá so sánh, số cột tùy biến và nút thêm giỏ hàng tiện lợi.",
    previewImage: "/previews/custom-featured-products.svg",
    presetName: "Custom Featured Products",
    tags: ["Product Grid", "Collection", "Sale Badge", "Responsive"],
    features: [
      "Flexible columns control for desktop (2, 3, 4, 5 columns)",
      "Automated sale badge calculation & discount tags",
      "Image hover zoom & aspect ratio settings",
      "Custom button labels, colors, and border radius"
    ],
    difficulty: "Intermediate",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-29"
  },
  {
    id: "feature-categories",
    filename: "feature-categories.liquid",
    title: "Velroxa Category Cards",
    titleVi: "Thẻ Danh Mục Sản Phẩm Hình Ảnh (Category Cards)",
    category: "features",
    plan: "free",
    description: "Visual category collection showcase with image cards, eyebrow badges, hover zoom animations, and customizable overlay contrasts.",
    descriptionVi: "Khung trưng bày danh mục sản phẩm trực quan dạng thẻ ảnh kèm text mô tả, hiệu ứng hover mượt mà và nút điều hướng chuyên nghiệp.",
    previewImage: "/previews/feature-categories.svg",
    presetName: "Custom Categories",
    tags: ["Categories", "Collection Cards", "Visual Navigation", "Hover Zoom"],
    features: [
      "Individual category card blocks with image & link",
      "Eyebrow subheadings and action buttons",
      "Adjustable image aspect ratio (Square, Portrait, Landscape)",
      "Overlay opacity and contrast controls"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-28"
  },
  {
    id: "trust-bar",
    filename: "trust-bar.liquid",
    title: "Velroxa Trust Bar",
    titleVi: "Thanh Cam Kết Uy Tín & Quyền Lợi Khách Hàng",
    category: "social-proof",
    plan: "free",
    description: "Clean horizontal credibility bar highlighting shipping promises, warranties, 30-day money-back guarantees, and 24/7 support with custom icons.",
    descriptionVi: "Thanh cam kết chất lượng dịch vụ với icon giao hàng miễn phí, bảo hành chính hãng, hoàn tiền 30 ngày và hỗ trợ khách hàng.",
    previewImage: "/previews/trust-bar.svg",
    presetName: "Custom Trust Bar",
    tags: ["Trust Bar", "Guarantees", "Shipping Badges", "Conversion Booster"],
    features: [
      "Supports up to 3 customizable trust blocks with icons",
      "Configurable divider lines and section borders",
      "Responsive stack on mobile viewports",
      "Custom typography and icon color pickers"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-27"
  },
  {
    id: "interactive-faq-accordion",
    filename: "interactive-faq-accordion.liquid",
    title: "Instant Search FAQ",
    titleVi: "Hỏi Đáp FAQ Tích Hợp Tìm Kiếm Trực Tiếp",
    category: "faq",
    plan: "free",
    description: "Clean animated FAQ accordion featuring an instant client-side keyword search bar, custom border-radius, and smooth SVG chevron animations.",
    descriptionVi: "Khung câu hỏi thường gặp dạng đóng mở mượt mà, có thanh tìm kiếm trực tiếp tức thì không cần reload trang.",
    previewImage: "/previews/interactive-faq-accordion.svg",
    presetName: "FAQ Accordion with Search",
    tags: ["Instant Search", "Smooth Animation", "SEO Friendly", "Lightweight"],
    features: [
      "Real-time live search filter as user types",
      "Option to open first question by default",
      "Fully responsive and keyboard accessible (native <details>)",
      "Zero external dependencies (pure JS & CSS)"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-26"
  },
  {
    id: "faq-contact",
    filename: "faq-contact.liquid",
    title: "Dual FAQ & Contact Form",
    titleVi: "Bộ Đôi Hỏi Đáp FAQ Kết Hợp Form Liên Hệ",
    category: "faq",
    plan: "free",
    description: "High-converting 2-column layout combining expandable FAQ questions on the left with a direct Shopify contact submission form on the right.",
    descriptionVi: "Giao diện chia đôi màn hình: bên trái là danh sách câu hỏi thường gặp, bên phải là form gửi yêu cầu hỗ trợ trực tiếp vào Shopify Admin.",
    previewImage: "/previews/faq-contact.svg",
    presetName: "Custom FAQ",
    tags: ["Split Layout", "Contact Form", "FAQ Accordion", "Customer Support"],
    features: [
      "2-column responsive layout (stacks gracefully on mobile)",
      "Integrated Shopify native customer contact form",
      "Success and error state handling",
      "Customizable padding, max width, and color palette"
    ],
    difficulty: "Intermediate",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-25"
  },
  {
    id: "testimonials-carousel",
    filename: "testimonials-carousel.liquid",
    title: "Verified Customer Reviews",
    titleVi: "Lưới Đánh Giá & Review Khách Hàng Xác Thực",
    category: "social-proof",
    plan: "free",
    description: "Modern social proof section with star ratings, customer avatars, verified buyer badge, and overall store rating summary.",
    descriptionVi: "Hiển thị đánh giá khách hàng với xếp hạng 5 sao, avatar, huy hiệu Đã Mua Hàng xác thực và điểm tổng kết uy tín.",
    previewImage: "/previews/testimonials-carousel.svg",
    presetName: "Testimonials Grid",
    tags: ["Social Proof", "Star Rating", "Verified Badge", "High Trust"],
    features: [
      "Customizable star count per review (1-5 stars)",
      "Verified buyer badge with green checkmark",
      "Fallback avatar with initial if no image provided",
      "Clean hover card micro-animations"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-24"
  },
  {
    id: "product-features-grid",
    filename: "product-features-grid.liquid",
    title: "Features Bento Grid",
    titleVi: "Bento Grid Giới Thiệu Tính Năng Đột Phá",
    category: "features",
    plan: "free",
    description: "Apple-style Bento grid highlighting product features, tech specs, key metrics (10x, 99.8%), and badge tags.",
    descriptionVi: "Giao diện Bento Grid phong cách Apple giới thiệu các ưu điểm vượt trội, thông số kỹ thuật và số liệu ấn tượng.",
    previewImage: "/previews/product-features-grid.svg",
    presetName: "Features Bento Grid",
    tags: ["Bento Grid", "Apple Style", "Stat Counters", "Conversion"],
    features: [
      "Flexible column span options (Small 1/3, Medium 1/2, Large 2/3)",
      "Key stat callouts with prominent numbers & labels",
      "Icon picker with lightning, shield, leaf, sparkle presets",
      "Tag badges for highlight features (NEW, PATENTED)"
    ],
    difficulty: "Intermediate",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-23"
  },
  {
    id: "announcement-bar-ticker",
    filename: "announcement-bar-ticker.liquid",
    title: "Marquee Announcement Bar",
    titleVi: "Thanh Thông Báo Chạy Chữ Marquee Vô Tận",
    category: "header",
    plan: "free",
    description: "Continuous smooth scrolling announcement ribbon with discount tags, free shipping notices, and pause-on-hover interaction.",
    descriptionVi: "Thanh thông báo chạy ngang mượt mà, hỗ trợ nhiều icon thông báo, link khuyến mãi và tự động dừng khi rê chuột.",
    previewImage: "/previews/announcement-bar-ticker.svg",
    presetName: "Announcement Ticker",
    tags: ["Infinite Marquee", "Pause on Hover", "Promo Banner", "Urgency"],
    features: [
      "Silky-smooth pure CSS marquee loop",
      "Pauses automatically on cursor hover",
      "Configurable scroll speed and padding",
      "Icon selector (Shipping truck, Fire deal, Shield, Discount tag)"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-22"
  },
  {
    id: "sticky-add-to-cart",
    filename: "sticky-add-to-cart.liquid",
    title: "Sticky Add to Cart Bar",
    titleVi: "Thanh Mua Nhanh Nổi Cố Định (Sticky Add-To-Cart)",
    category: "product",
    plan: "free",
    description: "Conversion-boosting sticky product bar that smoothly slides in on scroll, with variant dropdown selector and 1-click cart action.",
    descriptionVi: "Thanh mua hàng nổi ở cạnh dưới khi người dùng cuộn trang, cho phép chọn biến thể và bấm Thêm Vào Giỏ Hàng ngay lập tức.",
    previewImage: "/previews/sticky-add-to-cart.svg",
    presetName: "Sticky Add to Cart Bar",
    tags: ["Sticky ATC", "Conversion Booster", "Mobile Optimized", "Auto Scroll"],
    features: [
      "Automatically triggers when scrolled past 400px",
      "Dynamic variant dropdown selector with prices",
      "Out of stock detection and disabled state",
      "Fixed smooth elevation with drop shadow"
    ],
    difficulty: "Intermediate",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-21"
  },
  {
    id: "logo-cloud-marquee",
    filename: "logo-cloud-marquee.liquid",
    title: "Logo Cloud Marquee",
    titleVi: "Dải Logo Báo Chí & Đối Tác Chạy Vô Tận",
    category: "social-proof",
    plan: "free",
    description: "Sleek infinite scrolling logo cloud with gradient edge fade, grayscale filter, and full Shopify block customization.",
    descriptionVi: "Dải logo các thương hiệu đối tác, báo chí uy tín với hiệu ứng làm mờ 2 bên mép và hiệu ứng hover đổi màu sắc nét.",
    previewImage: "/previews/logo-cloud-marquee.svg",
    presetName: "Logo Cloud Marquee",
    tags: ["Logo Marquee", "Trust Badges", "Press Cloud", "Infinite Roll"],
    features: [
      "Edge gradient fade masks on both left and right sides",
      "Pure CSS continuous animation with speed control",
      "Automatic grayscale with color pop on hover",
      "Text fallback if no brand image logo is uploaded"
    ],
    difficulty: "Beginner",
    shopifyVersion: "Online Store 2.0",
    updatedAt: "2026-10-20"
  }
];
