# 📚 TÀI LIỆU KỸ THUẬT DỰ ÁN (PROJECT DOCUMENTATION)
## SHOPIFY CUSTOM SECTIONS LIBRARY (ONLINE STORE 2.0)

> **Phiên bản:** 2.0.0 (Marketplace Redesign)  
> **Framework:** Next.js 16 (App Router) • React 19 • Tailwind CSS v4 • TypeScript  
> **Rendering Engine:** LiquidJS (Liquid Server-Side Sandbox Pre-renderer)  
> **Nền tảng mục tiêu:** Shopify Online Store 2.0 • Vercel Edge Network  

---

## MỤC LỤC
1. [Giới Thiệu Tổng Quan & Triết Lý Thiết Kế](#1-giới-thiệu-tổng-quan--triết-lý-thiết-kế)
2. [Kiến Trúc Kỹ Thuật (Architecture)](#2-kiến-trúc-kỹ-thuật-architecture)
3. [Kiến Trúc Live Section Preview (Liquid Rendering Engine)](#3-kiến-trúc-live-section-preview-liquid-rendering-engine)
4. [Cấu Trúc Thư Mục Component Mới](#4-cấu-trúc-thư-mục-component-mới)
5. [Hệ Thống Lọc & Điều Hướng (Filters & Sidebar)](#5-hệ-thống-lọc--điều-hướng-filters--sidebar)
6. [Hành Động Trên Card (Card Actions: Preview & Copy Code)](#6-hành-động-trên-card-card-actions-preview--copy-code)
7. [Modal Xem Trước Đa Viewport (Desktop & Mobile Simulation)](#7-modal-xem-trước-đa-viewport-desktop--mobile-simulation)
8. [Danh Mục & Danh Sách 11 Section Hiện Có](#8-danh-mục--danh-sách-11-section-hiện-có)
9. [Các Bộ Lọc (Filters) & Thẻ (Tags) Shopify Được Hỗ Trợ](#9-các-bộ-lọc-filters--thẻ-tags-shopify-được-hỗ-trợ)
10. [Giới Hạn & Phạm Vi Hoạt Động (Limitations)](#10-giới-hạn--phạm-vi-hoạt-động-limitations)
11. [Hướng Dẫn Cài Đặt & Phát Triển Local](#11-hướng-dẫn-cài-đặt--phát-triển-local)
12. [Quy Trình Thêm Section Mới](#12-quy-trình-thêm-section-mới)
13. [Hướng Dẫn Triển Khai (Deploy) Lên Vercel](#13-hướng-dẫn-triển-khai-deploy-lên-vercel)

---

## 1. GIỚI THIỆU TỔNG QUAN & TRIẾT LÝ THIẾT KẾ

**Shopify Custom Sections Library** đã được tái thiết kế hoàn toàn theo phong cách **Shopify Section Marketplace**:
- **Trực quan & Tinh gọn:** Nền xám nhạt (`#F5F5F5`), thẻ card trắng viền mỏng (`#E5E5E5`), bo góc 12px, không dùng banner khổng lồ hay gradient rườm rà.
- **Trọng tâm sản phẩm:** Toàn bộ sự chú ý hướng về 3 thao tác cốt lõi: **Duyệt (Browse) → Xem trước sống động (Preview) → Sao chép mã (Copy Code)**.
- **Hai cột cân đối:**
  - Cột trái: Sidebar điều hướng cố định (Sticky) 280–300px chứa Tìm kiếm tức thì, Sắp xếp Newest, Bộ lọc Plan (Free/Gold) và Danh mục radio button kèm đếm số lượng động.
  - Cột phải: Lưới hiển thị section (3 cột trên desktop 1440px, 2 cột trên tablet, 1 cột trên mobile).

---

## 2. KIẾN TRÚC KỸ THUẬT (ARCHITECTURE)

```
┌────────────────────────────────────────────────────────┐
│                   SECTIONS REPOSITORY                  │
│  sections/*.liquid (11 file Liquid OS 2.0 thực tế)     │
└──────────────────────────┬─────────────────────────────┘
                           │ Đọc file & Parse Schema tại Build Time
                           ▼
┌────────────────────────────────────────────────────────┐
│             LIQUID PREVIEW INGESTION PIPELINE          │
│  src/lib/liquid-preview.ts & src/lib/preview-context.ts│
│  • LiquidJS engine biên dịch mã Liquid thành HTML thực │
│  • Bơm dữ liệu mẫu Shopify: section, product, form...  │
│  • Tách riêng {% schema %} ra khỏi nội dung trang      │
│  • Đóng gói thành Standalone HTML Document             │
└──────────────────────────┬─────────────────────────────┘
                           │ Build tĩnh Next.js 16 (0.4s)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 CLIENT MARKETPLACE UI                  │
│  • SectionSidebar: Search, Sort, Plan, Category Radios │
│  • SectionGrid: Lưới 3 cột với thẻ SectionCard         │
│  • Isolated Iframe Preview (Không xung đột CSS)        │
│  • Exactly 2 Actions: Preview Modal & 1-Click Copy Code│
│  • Toast Notification: "Liquid code copied!"           │
└────────────────────────────────────────────────────────┘
```

---

## 3. KIẾN TRÚC LIVE SECTION PREVIEW (LIQUID RENDERING ENGINE)

Thay vì dùng ảnh tĩnh hay placeholder SVG, ứng dụng sử dụng cơ chế **Live Section Preview** biên dịch từ chính mã nguồn Liquid của từng file:

1. **Phân tách Schema:** Engine tự động bóc tách khối `{% schema %}...{% endschema %}`, phân tích cú pháp JSON để lấy danh sách block mặc định từ `presets` và các giá trị cài đặt mặc định trong `settings`.
2. **Khởi tạo Ngữ cảnh Giả lập (Mock Shopify Context):** Cung cấp các đối tượng Shopify tiêu chuẩn:
   - `section.id`: ID duy nhất cho scope CSS.
   - `section.settings`: Các biến màu sắc, padding, typography, tỷ lệ ảnh.
   - `section.blocks`: Mảng block theo cấu trúc preset của schema.
   - `product` & `collection`: Dữ liệu mẫu sản phẩm thực tế (ảnh Unsplash chất lượng cao, giá tiền, biến thể, tình trạng còn hàng).
   - `cart`, `shop`, `form`: Đối tượng môi trường Shopify.
3. **Cách ly Iframe (Sandboxing):**
   - Kết quả biên dịch được bọc trong một tài liệu HTML hoàn chỉnh và hiển thị qua thẻ `<iframe>` với `srcDoc`.
   - **Lợi ích:** Cách ly 100% CSS và JavaScript của section, không bao giờ gây ảnh hưởng hay xung đột với giao diện Tailwind CSS của ứng dụng.
   - **Tỉ lệ xem trên Card:** Preview được co tỉ lệ chuẩn xác `300% width * scale(0.3333)` để hiển thị trọn vẹn bố cục desktop trong khung xem trước mà không bị méo hình hay hở viền.

---

## 4. CẤU TRÚC THƯ MỤC COMPONENT MỚI

```text
src/
├── app/
│   ├── globals.css                       # Tailwind CSS v4 styling
│   ├── layout.tsx                        # Layout gốc, nền #F5F5F5, font chữ
│   └── page.tsx                          # Async Server Component gọi getAllSections()
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx                 # Header gọn gàng: logo, số section, link GitHub
│   │   ├── SectionSidebar.tsx            # Sidebar bộ lọc (Search, Newest, Plan, Categories)
│   │   ├── MobileFilterDrawer.tsx        # Drawer trượt cho thiết bị di động/tablet
│   │   └── SectionMarketplace.tsx        # Container chính quản lý tương tác và state
│   ├── sections/
│   │   ├── PlanBadge.tsx                 # Huy hiệu Plan (Free: xanh da trời / Gold: vàng)
│   │   ├── SectionCard.tsx               # Card hiển thị: Badge, Live Preview, Title, 2 nút
│   │   ├── SectionGrid.tsx               # Header danh sách và Grid 3 cột
│   │   └── SectionPreviewModal.tsx       # Modal xem trước lớn (Chuyển Desktop / Mobile 375px)
│   └── ui/
│       └── Toast.tsx                     # Thông báo nhẹ nhàng "Liquid code copied!"
├── data/
│   ├── categories.ts                     # Danh sách 7 danh mục
│   └── sections-meta.ts                  # Metadata 11 sections (plan: "free", tags, preset)
└── lib/
    ├── liquid-preview.ts                 # Bộ máy render LiquidJS và bộ lọc Shopify
    ├── preview-context.ts                # Dữ liệu ngữ cảnh mẫu Shopify
    └── sections.ts                       # Pipeline đọc file tĩnh tại Build time
```

---

## 5. HỆ THỐNG LỌC & ĐIỀU HƯỚNG (FILTERS & SIDEBAR)

Sidebar bên trái có chiều rộng 280–300px, cố định trên desktop:

1. **Ô Tìm kiếm (Search):**
   - Tìm kiếm tức thì theo: Tiêu đề section, Tiêu đề tiếng Việt, Tên file `.liquid`, Tên Preset, Mô tả và Thẻ Tag.
   - Có nút xóa tìm kiếm (X) khi có nội dung.
2. **Sắp xếp (Sorting):**
   - Checkbox **Newest**: Sắp xếp các section theo ngày cập nhật mới nhất (`updatedAt` giảm dần).
3. **Gói dịch vụ (Plan):**
   - Checkbox **Free** (11) và **Gold** (0).
   - Tôn trọng dữ liệu thực tế: toàn bộ 11 section hiện tại đều miễn phí 100% (`plan: "free"`).
4. **Danh mục (Categories):**
   - Chọn kiểu Radio (mỗi thời điểm chỉ chọn 1 danh mục).
   - Hiển thị số lượng động tính từ dữ liệu thực tế:
     - All Sections (11)
     - Hero & Banner (1)
     - Features & Bento Grid (2)
     - Product & Conversion (2)
     - Social Proof & Reviews (3)
     - FAQ & Support (2)
     - Announcement & Header (1)
5. **Giao diện Di động (Mobile Drawer):**
   - Khi ở màn hình nhỏ, xuất hiện nút **Filters** kèm huy hiệu số bộ lọc đang chọn.
   - Bấm vào sẽ mở thanh Drawer trượt từ bên trái với đầy đủ chức năng và nút **Clear All**.

---

## 6. HÀNH ĐỘNG TRÊN CARD (CARD ACTIONS)

Mỗi thẻ section card chỉ có duy nhất **2 hành động chính**:

1. **`Preview` (Xem trước):**
   - Mở cửa sổ Modal xem trước kích thước lớn.
2. **`Copy Code` (Sao chép mã):**
   - Sao chép toàn bộ mã nguồn Liquid nguyên bản vào Clipboard.
   - Hiển thị thông báo Toast góc dưới: *"Liquid code copied!"*.

*(Các nút dư thừa như View Details, View Code, Download đã được loại bỏ hoàn toàn theo đúng yêu cầu thiết kế).*

---

## 7. SHOPIFY THEME PREVIEW WORKSPACE & LIQUID PREVIEW ENGINE

Hệ thống xem trước giao diện section được xây dựng theo kiến trúc Theme Preview Workspace chuyên nghiệp, độc lập và có thể tái sử dụng:

### 1. Cấu trúc Mô-đun Preview Engine (`src/lib/preview/` & `src/data/preview/`)
- **`liquid-engine.ts`**: Khởi tạo instance LiquidJS với các cấu hình an toàn (`strictFilters: false`, `strictVariables: false`, `lenientIf: true`).
- **`liquid-filters.ts`**: Đăng ký đầy đủ các filter đặc thù của Shopify (`image_url`, `image_tag`, `placeholder_svg_tag`, `money`, `money_with_currency`, `t`, `default_errors`).
- **`liquid-tags.ts`**: Tùy biến tag `{% form 'type' %}` của Shopify hỗ trợ cả form liên hệ (contact) và form thêm nhanh vào giỏ hàng (quick add).
- **`liquid-schema.ts`**: Bóc tách tự động JSON Schema từ tag `{% schema %}`, trích xuất giá trị cài đặt mặc định (settings) và danh sách block mặc định từ các Presets.
- **`shopify-context.ts`**: Cung cấp Mock Context chuẩn Shopify Storefront (`section`, `block`, `product`, `products`, `collection`, `shop`, `routes`, `cart`, `form`, `request`).
- **`preview-compiler.ts`**: Trình biên dịch hoàn chỉnh chuyển mã Liquid nguyên bản thành tài liệu HTML sandbox độc lập, tự động báo cáo chiều cao qua `postMessage` và chặn các sự kiện click ngoài ý muốn.

### 2. Thiết kế Preview Workspace (`src/components/preview/`)
- **Kích thước Modal:** 
  - Desktop: Chiều rộng 92vw (tối đa 1500px), chiều cao 90vh (tối đa 1000px), bo góc tròn 16px.
  - Mobile: Toàn màn hình thuận tiện thao tác.
  - Nền mờ `rgba(0, 0, 0, 0.55)` với hiệu ứng backdrop blur.
- **Thanh tiêu đề (Header):**
  - Tên Section & Huy hiệu file `.liquid` dạng code tag.
  - Tên Preset, tổng số dòng và dung lượng file thực tế.
  - Huy hiệu trạng thái kết xuất thời gian thực (`Live Preview`, `Compiling`, `Rendering Error`).
  - Nút đóng với phím tắt `ESC`.
- **Thanh công cụ (Preview Toolbar):**
  - Chuyển đổi chế độ **Desktop** và **Mobile**.
  - Các preset kích thước chuẩn: Desktop (`Fit`, `1200px`, `1440px`) & Mobile (`375px SE`, `390px Pro`, `430px Max`).
  - Huy hiệu phần trăm tỷ lệ hiển thị (% Zoom/Fit).
  - Nút **Refresh Preview** (biên dịch lại tức thì) & nút **Copy Code** tiện lợi.
- **Khu vực Preview Canvas:**
  - Nền workspace chuyên nghiệp `#F1F2F4` sạch sẽ.
  - Loại bỏ hoàn toàn thanh trình duyệt giả (không còn 3 chấm màu hay URL giả mạo).
  - Desktop hiển thị trực tiếp storefront căn giữa tự nhiên.
  - Mobile hiển thị trong khung thiết bị tinh tế (Device Frame) với dynamic island và chiều rộng CSS thực tế để kích hoạt chuẩn xác các media queries `@media (max-width: 749px)`.
  - Tự động khóa cuộn trang nền (`scroll lock`) khi mở workspace.

---

## 8. DANH MỤC & DANH SÁCH 11 SECTION HIỆN CÓ

| # | Tên Section | File name | Danh mục | Plan | Preset Name | Dòng |
|---|---|---|---|---|---|---|
| 1 | **Example Responsive Hero** | `custom-hero.liquid` | Hero & Banner | Free | `Custom Hero` | 1,130 |
| 2 | **Example Featured Products** | `custom-featured-products.liquid` | Product & Conversion | Free | `Custom Featured Products` | 1,826 |
| 3 | **Example Category Cards** | `feature-categories.liquid` | Features & Bento Grid | Free | `Custom Categories` | 1,350 |
| 4 | **Example Trust Bar** | `trust-bar.liquid` | Social Proof & Reviews | Free | `Custom Trust Bar` | 484 |
| 5 | **Instant Search FAQ** | `interactive-faq-accordion.liquid` | FAQ & Support | Free | `FAQ Accordion with Search` | 346 |
| 6 | **Dual FAQ & Contact Form** | `faq-contact.liquid` | FAQ & Support | Free | `Custom FAQ` | 628 |
| 7 | **Verified Customer Reviews** | `testimonials-carousel.liquid` | Social Proof & Reviews | Free | `Testimonials Grid` | 316 |
| 8 | **Features Bento Grid** | `product-features-grid.liquid` | Features & Bento Grid | Free | `Features Bento Grid` | 329 |
| 9 | **Marquee Announcement Bar** | `announcement-bar-ticker.liquid` | Announcement & Header | Free | `Announcement Ticker` | 185 |
| 10 | **Sticky Add to Cart Bar** | `sticky-add-to-cart.liquid` | Product & Conversion | Free | `Sticky Add to Cart Bar` | 184 |
| 11 | **Logo Cloud Marquee** | `logo-cloud-marquee.liquid` | Social Proof & Reviews | Free | `Logo Cloud Marquee` | 190 |

---

## 9. CÁC BỘ LỌC (FILTERS) & THẺ (TAGS) SHOPIFY ĐƯỢC HỖ TRỢ

Bộ máy LiquidJS được tích hợp các adapter dành riêng cho Shopify:

- **Bộ lọc hình ảnh:**
  - `image_url`: Chuyển đổi đối tượng ảnh hoặc URL, hỗ trợ kích thước `width`, `height`.
  - `image_tag`: Tạo thẻ `<img>` tối ưu với `alt`, `class`, `loading="lazy"`.
  - `placeholder_svg_tag`: Tạo khung placeholder đồ họa chuẩn Shopify.
- **Bộ lọc tiền tệ:**
  - `money`: Định dạng giá trị cent hoặc dollar thành `$149.00`.
- **Bộ lọc văn bản & toán học:**
  - `default`, `escape`, `newline_to_br`, `slice`, `append`, `t` (translation).
  - `minus`, `times`, `divided_by`, `round`.
- **Thẻ cấu trúc (Tags):**
  - `{% liquid ... %}`: Cú pháp viết nhiều lệnh trong 1 block.
  - `{% form 'contact', ... %} ... {% endform %}`: Thẻ form liên hệ của Shopify.
  - `if`, `else`, `elsif`, `unless`, `case/when`, `for` loop, `assign`, `comment`.

---

## 10. GIỚI HẠN & PHẠM VI HOẠT ĐỘNG (LIMITATIONS)

1. **Môi trường Client không kết nối Shopify Admin trực tiếp:**
   - Các hành động như bấm "Submit Contact Form" hay "Add to Cart" trong phần preview được cấu hình `event.preventDefault()` để tránh submit trang ngoài ý muốn trong môi trường xem trước.
2. **Shopify App Extensions:**
   - Các section không yêu cầu App bên thứ 3 nào. Toàn bộ tính năng (Live search FAQ, Marquee ticker, Bento grid, Sticky buy bar) đều chạy bằng **Vanilla JavaScript và Scoped CSS** độc lập.

---

## 11. HƯỚNG DẪN CÀI ĐẶT & PHÁT TRIỂN LOCAL

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Kiểm tra chuẩn code (ESLint 0 errors)
npm run lint

# 4. Kiểm tra đóng gói (Static Build)
npm run build
npm run start
```

---

## 12. QUY TRÌNH THÊM SECTION MỚI

Chỉ cần 3 bước đơn giản:

1. Thả file `.liquid` vào thư mục [`sections/`](file:///Users/nguyenductham/Working/sections-shopify/sections/).
2. Khai báo thông tin vào [`src/data/sections-meta.ts`](file:///Users/nguyenductham/Working/sections-shopify/src/data/sections-meta.ts) với `plan: "free"`.
3. Chạy `npm run build` hoặc push lên GitHub. Bộ máy LiquidJS sẽ tự động biên dịch live preview HTML và đưa section lên website ngay lập tức!

---

## 13. HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL

Dự án được tối ưu 100% cho Vercel:
```bash
git add .
git commit -m "feat: complete modern Shopify sections marketplace redesign"
git push origin main
```
Vercel sẽ tự động kích hoạt pipeline build tĩnh (`next build`), tạo bản phân phối toàn cầu qua Edge CDN chỉ trong ~30 giây.
