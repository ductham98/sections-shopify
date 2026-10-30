# 📚 TÀI LIỆU KỸ THUẬT DỰ ÁN (PROJECT DOCUMENTATION)
## SHOPIFY CUSTOM SECTIONS LIBRARY (ONLINE STORE 2.0)

> **Phiên bản:** 1.0.0  
> **Cập nhật lần cuối:** 30/10/2026  
> **Framework:** Next.js 16 (App Router) • React 19 • Tailwind CSS v4 • TypeScript  
> **Hỗ trợ nền tảng:** Shopify Online Store 2.0 • Vercel Edge Network  

---

## MỤC LỤC
1. [Giới Thiệu Tổng Quan](#1-giới-thiệu-tổng-quan)
2. [Kiến Trúc Kỹ Thuật (Architecture)](#2-kiến-trúc-kỹ-thuật-architecture)
3. [Cấu Trúc Thư Mục Chi Tiết](#3-cấu-trúc-thư-mục-chi-tiết)
4. [Danh Mục & Danh Sách Section Hiện Có](#4-danh-mục--danh-sách-section-hiện-có)
5. [Cơ Chế Đọc Mã Tĩnh (Static Ingestion Pipeline)](#5-cơ-chế-đọc-mã-tĩnh-static-ingestion-pipeline)
6. [Hướng Dẫn Cài Đặt & Phát Triển Local](#6-hướng-dẫn-cài-đặt--phát-triển-local)
7. [Quy Trình Thêm Section Mới](#7-quy-trình-thêm-section-mới)
8. [Hướng Dẫn Triển Khai (Deploy) Lên Vercel](#8-hướng-dẫn-triển-khai-deploy-lên-vercel)
9. [Hướng Dẫn Cài Đặt Section Vào Theme Shopify](#9-hướng-dẫn-cài-đặt-section-vào-theme-shopify)
10. [Tiêu Chuẩn Lập Trình Shopify Section (Best Practices)](#10-tiêu-chuẩn-lập-trình-shopify-section-best-practices)

---

## 1. GIỚI THIỆU TỔNG QUAN

**Shopify Custom Sections Library** là một nền tảng Web App hiện đại cho phép các lập trình viên và nhà bán hàng (Merchants) trên Shopify:
- **Khám phá và xem trước (Preview)** các Section Shopify tùy biến được thiết kế chuyên nghiệp.
- **Xem giả lập đa thiết bị (Desktop & Mobile)** trước khi cài đặt vào store thực tế.
- **Sao chép mã nguồn nhanh (1-Click Copy Code)** hoặc tải trực tiếp file `.liquid` để dán vào Theme Shopify chuẩn Online Store 2.0.
- **Tra cứu và tìm kiếm thông minh** theo danh mục, tính năng, preset name, từ khóa tag.

Dự án được tối ưu để lưu trữ mã nguồn mở, cho phép cộng đồng dễ dàng mở rộng và triển khai miễn phí trên nền tảng **Vercel**.

---

## 2. KIẾN TRÚC KỸ THUẬT (ARCHITECTURE)

```
┌────────────────────────────────────────────────────────┐
│                   SECTIONS REPOSITORY                  │
│  sections/*.liquid (Mã nguồn Liquid thực tế)           │
└──────────────────────────┬─────────────────────────────┘
                           │ Đọc tại Build Time (Node.js FS)
                           ▼
┌────────────────────────────────────────────────────────┐
│              NEXT.JS 16 APPSERVER BUILD (SSG)          │
│  • src/data/sections-meta.ts (Metadata & Tags)         │
│  • src/lib/sections.ts (Bundler & Line Calculator)     │
│  • Static Prerendering (HTML + JSON CDN Cache)         │
└──────────────────────────┬─────────────────────────────┘
                           │ Bundle thành trang tĩnh tối ưu
                           ▼
┌────────────────────────────────────────────────────────┐
│                 CLIENT INTERACTION LAYER               │
│  • Category Filter Pills (Lọc danh mục đa năng)        │
│  • Instant Keyword Search (Tìm kiếm tức thì)           │
│  • SectionCard (Card xem trước + nút Copy nhanh)       │
│  • SectionModal (Preview Desktop/Mobile + Full Code)   │
│  • InstallGuideModal (Hướng dẫn thao tác trong Admin)  │
└────────────────────────────────────────────────────────┘
```

### Công nghệ sử dụng:
- **Core Framework:** Next.js 16.4.3 (App Router).
- **Ngôn ngữ:** TypeScript 5.x.
- **Thư viện UI:** React 19.3.0.
- **Styling:** Tailwind CSS v4 (cấu hình qua `@import "tailwindcss";`).
- **Icons:** `lucide-react` (kèm SVG custom inline cho brand).
- **Static Generation:** Toàn bộ dữ liệu `.liquid` được đóng gói tĩnh tại build time (0ms cold start, 100% SEO friendly).

---

## 3. CẤU TRÚC THƯ MỤC CHI TIẾT

```text
sections-shopify/
├── sections/                         # [QUAN TRỌNG] Thư mục chứa các file mã nguồn .liquid gốc
│   ├── custom-hero.liquid            # Velroxa Hero Banner (Dual image desktop/mobile)
│   ├── custom-featured-products.liquid# Lưới sản phẩm nổi bật
│   ├── feature-categories.liquid     # Thẻ danh mục sản phẩm hình ảnh
│   ├── trust-bar.liquid              # Thanh cam kết chất lượng & dịch vụ
│   ├── interactive-faq-accordion.liquid # FAQ Accordion có ô tìm kiếm trực tiếp
│   ├── faq-contact.liquid            # Cặp đôi FAQ + Form gửi yêu cầu liên hệ
│   ├── testimonials-carousel.liquid  # Lưới review đánh giá khách hàng xác thực
│   ├── product-features-grid.liquid  # Bento Grid giới thiệu tính năng
│   ├── announcement-bar-ticker.liquid# Thanh thông báo chạy chữ Marquee vô tận
│   ├── sticky-add-to-cart.liquid     # Thanh mua nhanh nổi cố định
│   └── logo-cloud-marquee.liquid     # Dải logo đối tác & báo chí chạy liên tục
├── public/
│   └── previews/                     # Thư mục chứa ảnh preview SVG độ phân giải cao
│       ├── custom-hero.svg
│       ├── custom-featured-products.svg
│       ├── feature-categories.svg
│       ├── trust-bar.svg
│       ├── interactive-faq-accordion.svg
│       ├── faq-contact.svg
│       ├── testimonials-carousel.svg
│       ├── product-features-grid.svg
│       ├── announcement-bar-ticker.svg
│       ├── sticky-add-to-cart.svg
│       └── logo-cloud-marquee.svg
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css               # Import Tailwind CSS v4 & custom root styling
│   │   ├── layout.tsx                # Root layout, fonts Geist, thẻ Meta SEO
│   │   └── page.tsx                  # Server Component đọc sections & render view chính
│   ├── components/                   # Các component giao diện React
│   │   ├── Navbar.tsx                # Header điều hướng, badge đếm section, link GitHub
│   │   ├── HeroHeader.tsx            # Tiêu đề giới thiệu & ô tìm kiếm live search
│   │   ├── CategoryFilter.tsx        # Thanh tab lọc theo từng danh mục
│   │   ├── SectionCard.tsx           # Card hiển thị section, ảnh preview & nút Copy
│   │   ├── SectionModal.tsx          # Modal đa năng (Xem preview, Full Code, Hướng dẫn)
│   │   ├── InstallGuideModal.tsx     # Popup hướng dẫn thao tác trong Shopify Admin
│   │   └── Footer.tsx                # Footer website & hướng dẫn đóng góp section
│   ├── data/
│   │   ├── categories.ts             # Định nghĩa danh sách các danh mục, màu sắc, icon
│   │   └── sections-meta.ts          # Metadata chi tiết từng section (Preset, Tag, Mô tả)
│   └── lib/
│       └── sections.ts               # Bộ đọc file fs.readFileSync & tính dung lượng file
├── package.json                      # Danh sách dependencies & scripts
├── tsconfig.json                     # Cấu hình TypeScript
├── eslint.config.mjs                 # Cấu hình kiểm tra chuẩn code ESLint
└── README.md                         # Hướng dẫn nhanh cho repository
```

---

## 4. DANH MỤC & DANH SÁCH SECTION HIỆN CÓ

Hệ thống được chia thành 6 nhóm danh mục chuẩn E-commerce:

| ID Danh mục | Tên tiếng Việt | Màu sắc | Mục đích sử dụng |
|---|---|---|---|
| `all` | **Tất cả Section** | Indigo | Xem toàn bộ thư viện |
| `hero` | **Hero & Banner** | Purple | Thu hút sự chú ý tại đầu trang, truyền tải thông điệp chính |
| `features` | **Tính năng & Bento Grid** | Blue | Giới thiệu công nghệ, chất liệu, ưu điểm vượt trội |
| `product` | **Sản phẩm & Chốt đơn** | Emerald | Thúc đẩy thêm hàng vào giỏ, tăng tỷ lệ chuyển đổi |
| `social-proof` | **Đánh giá & Testimonials** | Amber | Tạo dựng niềm tin từ đánh giá người dùng thực tế & báo chí |
| `faq` | **Hỏi đáp & Hỗ trợ** | Cyan | Giải đáp khúc mắc khách hàng, giảm áp lực cho bộ phận CSKH |
| `header` | **Thông báo & Header** | Rose | Nhấn mạnh khuyến mãi, miễn phí vận chuyển, flash sale |

### Bảng thống kê 11 Sections tích hợp sẵn:

| Tên Section | File name | Danh mục | Preset Name | Đặc điểm chính |
|---|---|---|---|---|
| **Velroxa Responsive Hero** | `custom-hero.liquid` | `hero` | `Custom Hero` | Hỗ trợ ảnh riêng cho Desktop & Mobile, chỉnh overlay, font size, button |
| **Velroxa Featured Products** | `custom-featured-products.liquid` | `product` | `Custom Featured Products` | Lưới sản phẩm từ Collection, nhãn Sale, số cột tùy biến |
| **Velroxa Category Cards** | `feature-categories.liquid` | `features` | `Custom Categories` | Thẻ ảnh danh mục sản phẩm, hiệu ứng hover zoom, tỷ lệ ảnh linh hoạt |
| **Velroxa Trust Bar** | `trust-bar.liquid` | `social-proof` | `Custom Trust Bar` | Thanh cam kết dịch vụ (Giao hàng, Hoàn tiền, Bảo hành, CSKH) |
| **Instant Search FAQ** | `interactive-faq-accordion.liquid` | `faq` | `FAQ Accordion with Search` | Accordion mượt mà, tích hợp ô tìm kiếm lọc câu hỏi theo thời gian thực |
| **Dual FAQ + Contact Form** | `faq-contact.liquid` | `faq` | `Custom FAQ` | Chia 2 cột: bên trái là câu hỏi thường gặp, bên phải là form liên hệ |
| **Verified Reviews Grid** | `testimonials-carousel.liquid` | `social-proof` | `Testimonials Grid` | Đánh giá 5 sao, avatar, huy hiệu Đã mua hàng xác thực (Verified Buyer) |
| **Features Bento Grid** | `product-features-grid.liquid` | `features` | `Features Bento Grid` | Phong cách Apple Bento Grid, số liệu thống kê (10x, 99%), huy hiệu NEW |
| **Marquee Announcement** | `announcement-bar-ticker.liquid` | `header` | `Announcement Ticker` | Chạy chữ ngang vô tận, tự dừng khi hover chuột, icon khuyến mãi |
| **Sticky Add To Cart** | `sticky-add-to-cart.liquid` | `product` | `Sticky Add to Cart Bar` | Thanh mua nhanh nổi ở đáy trang khi cuộn quá 400px, chọn biến thể |
| **Logo Cloud Marquee** | `logo-cloud-marquee.liquid` | `social-proof` | `Logo Cloud Marquee` | Dải logo đối tác/báo chí trượt liên tục, mờ 2 bên mép chuyên nghiệp |

---

## 5. CƠ CHẾ ĐỌC MÃ TĨNH (STATIC INGESTION PIPELINE)

Để đảm bảo hiệu năng tối đa và **không phát sinh lỗi đọc file khi chạy trên môi trường Serverless của Vercel**, dự án sử dụng kiến trúc Static Prerendering:

1. **Nguồn dữ liệu:** Các file Liquid được lưu trực tiếp dưới dạng `.liquid` nguyên bản tại thư mục `sections/`. Bạn không cần phải escape string thủ công thành JSON.
2. **Hàm xử lý ([`src/lib/sections.ts`](file:///Users/nguyenductham/Working/sections-shopify/src/lib/sections.ts)):**
   ```typescript
   export function getAllSections(): SectionItem[] {
     const sectionsDir = path.join(process.cwd(), "sections");
     return SECTIONS_METADATA.map((meta) => {
       const filePath = path.join(sectionsDir, meta.filename);
       const code = fs.readFileSync(filePath, "utf-8");
       const lineCount = code.split("\n").length;
       const fileSizeBytes = Buffer.byteLength(code, "utf-8");
       // Trả về đối tượng hoàn chỉnh
     });
   }
   ```
3. **Build time:** Khi chạy lệnh `npm run build`, Next.js Server Component gọi `getAllSections()` và nướng (bake) toàn bộ nội dung code Liquid vào file HTML tĩnh.
4. **Kết quả:** Khi người dùng truy cập, website tải gần như ngay lập tức (dưới 100ms) qua CDN, chức năng 1-Click Copy hoạt động offline ngay trong trình duyệt.

---

## 6. HƯỚNG DẪN CÀI ĐẶT & PHÁT TRIỂN LOCAL

### 1. Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 18.17.0` (Khuyên dùng `20.x` hoặc `24.x`).
- **Trình quản lý gói:** `npm`, `pnpm` hoặc `yarn`.

### 2. Các bước cài đặt
Clone repository và cài đặt thư viện:
```bash
git clone https://github.com/ductham98/sections-shopify.git
cd sections-shopify
npm install
```

### 3. Khởi chạy máy chủ phát triển (Development Server)
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 4. Kiểm tra chuẩn code (Linting)
```bash
npm run lint
```
*Lưu ý: Dự án tuân thủ nghiêm ngặt quy chuẩn ESLint của Next.js (không có warning hoặc error).*

### 5. Kiểm tra đóng gói (Production Build)
```bash
npm run build
npm run start
```

---

## 7. QUY TRÌNH THÊM SECTION MỚI

Khi bạn có một file Liquid mới muốn đưa lên trang web, thực hiện đúng 3 bước sau:

### Bước 1: Lưu file code vào thư mục `sections/`
Copy file `.liquid` của bạn vào thư mục `sections/`:
```text
sections/my-new-section.liquid
```

### Bước 2: Khai báo thông tin vào `src/data/sections-meta.ts`
Mở file [`src/data/sections-meta.ts`](file:///Users/nguyenductham/Working/sections-shopify/src/data/sections-meta.ts) và thêm vào mảng `SECTIONS_METADATA`:
```typescript
{
  id: "my-new-section",
  filename: "my-new-section.liquid",
  title: "Tiêu đề tiếng Anh của Section",
  titleVi: "Tiêu đề tiếng Việt hiển thị",
  category: "hero", // Một trong các mục: hero, features, product, social-proof, faq, header
  description: "Mô tả ngắn tiếng Anh về tính năng",
  descriptionVi: "Mô tả chi tiết bằng tiếng Việt",
  previewImage: "/previews/my-new-section.svg", // Đường dẫn ảnh preview
  presetName: "Tên Preset trong schema của file Liquid",
  tags: ["Responsive", "Conversion", "Minimal"],
  features: [
    "Tính năng nổi bật 1",
    "Tính năng nổi bật 2",
    "Tính năng nổi bật 3"
  ],
  difficulty: "Beginner",
  shopifyVersion: "Online Store 2.0",
  updatedAt: "2026-10-30"
}
```

### Bước 3: Tạo ảnh Preview
Tạo 1 file ảnh minh họa (khuyên dùng định dạng `.svg` để nhẹ và sắc nét trên mọi màn hình, hoặc `.png`, `.webp`) và lưu vào:
```text
public/previews/my-new-section.svg
```

Sau khi hoàn tất, hệ thống sẽ tự động cập nhật đếm số lượng, render thẻ card, hỗ trợ tìm kiếm và tính năng copy code tự động!

---

## 8. HƯỚNG DẪN TRIỂN KHAI (DEPLOY) LÊN VERCEL

### Cách 1: Tự động qua GitHub (Khuyên dùng)
1. Đẩy mã nguồn lên repository GitHub của bạn:
   ```bash
   git add .
   git commit -m "feat: add new section"
   git push origin main
   ```
2. Mở trình duyệt vào [Vercel Dashboard](https://vercel.com).
3. Nhấn nút **Add New...** > Chọn **Project**.
4. Chọn repository `sections-shopify`.
5. Giữ nguyên các thiết lập mặc định (Framework Preset: **Next.js**).
6. Nhấn nút **Deploy**.
   - Vercel sẽ tự động build trang tĩnh và phát hành URL có định dạng `https://sections-shopify.vercel.app`.
   - Mỗi lần bạn `git push` một section mới, Vercel sẽ tự động build lại trong ~30 giây.

### Cách 2: Deploy qua dòng lệnh Vercel CLI
```bash
# Cài đặt Vercel CLI nếu chưa có
npm install -g vercel

# Đăng nhập và deploy
vercel --prod
```

---

## 9. HƯỚNG DẪN CÀI ĐẶT SECTION VÀO THEME SHOPIFY

Dành cho Merchant hoặc lập trình viên khi sử dụng section từ thư viện này:

### Bước 1: Mở trình soạn thảo Theme
1. Truy cập trang quản trị **Shopify Admin** (`your-store.myshopify.com/admin`).
2. Vào mục **Online Store** > **Themes**.
3. Tại theme đang hoạt động (ví dụ: Dawn), bấm vào nút dấu ba chấm **"..."** > Chọn **Edit code**.

### Bước 2: Tạo Section mới
1. Ở danh mục cây thư mục bên trái, cuộn xuống tìm thư mục **Sections**.
2. Nhấn vào liên kết **Add a new section**.
3. Đặt tên file chính xác theo tên hiển thị trên web (ví dụ: `custom-hero.liquid`).
4. Bấm **Done** để tạo file.

### Bước 3: Dán mã nguồn Liquid
1. Mở trang web thư viện, tìm đến section cần dùng và bấm **Copy Code** (hoặc mở modal chọn **Sao Chép Tất Cả**).
2. Xóa toàn bộ đoạn code mẫu có sẵn trong file mới tạo ở Shopify.
3. Dán toàn bộ mã nguồn vừa copy vào.
4. Bấm nút **Save** ở góc trên bên phải.

### Bước 4: Thêm vào trang qua Theme Customizer
1. Quay lại trang **Online Store** > **Themes** > Bấm nút **Customize** (Tùy biến).
2. Tại trang chủ hoặc trang sản phẩm bất kỳ, ở cột bên trái nhấn **Add section** (Thêm phần).
3. Gõ tìm tên **Preset Name** của section (được ghi rõ trong phần chi tiết trên trang web, ví dụ: *"Custom Hero"*).
4. Section sẽ xuất hiện tức thì trên giao diện kéo thả, cho phép bạn thay đổi hình ảnh, văn bản, màu sắc tùy ý.

---

## 10. TIÊU CHUẨN LẬP TRÌNH SHOPIFY SECTION (BEST PRACTICES)

Tất cả các section trong thư viện đều tuân thủ các quy tắc chuẩn của Shopify Online Store 2.0:

1. **Cách ly vùng ảnh hưởng CSS (Scoped CSS):**
   - Luôn sử dụng tiền tố hoặc ID động gắn liền với `{{ section.id }}`:
     ```html
     <section id="custom-hero-{{ section.id }}" class="custom-hero"> ... </section>
     <style>
       #custom-hero-{{ section.id }} {
         --hero-bg: {{ section.settings.background_color }};
       }
     </style>
     ```
2. **Khai báo biến CSS (CSS Variables) từ Setting:**
   - Truyền trực tiếp màu sắc, kích thước, padding qua CSS custom properties trên thẻ section gốc để code CSS gọn gàng và dễ bảo trì.
3. **Tối ưu hình ảnh (Performance & Core Web Vitals):**
   - Sử dụng filter `image_url` kết hợp thẻ `image_tag` với các tham số `widths`, `sizes`, `loading: 'lazy'` (hoặc `loading: 'eager'` nếu là Banner Hero đầu trang).
   - Sử dụng thẻ `<picture>` có `<source media="(max-width: 749px)">` khi hỗ trợ ảnh riêng cho Mobile.
4. **Không phụ thuộc thư viện nặng ngoài (Zero External Dependencies):**
   - Hạn chế sử dụng jQuery hay các plugin slider nặng. Ưu tiên sử dụng Pure CSS (`animation`, `scroll-snap`) hoặc Vanilla JavaScript nhẹ nhàng tự hủy theo vòng đời block.
5. **Đầy đủ Schema & Presets:**
   - Mỗi file đều phải có thẻ `{% schema %}` hoàn chỉnh với ít nhất 1 mục trong `"presets"` để hiển thị trong bảng tìm kiếm của Theme Customizer.

---

*Tài liệu này được biên soạn độc quyền cho dự án **sections-shopify**.*

