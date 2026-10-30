# 🛍️ Shopify Custom Sections Library (Online Store 2.0)

> Thư viện lưu trữ và hiển thị các Shopify Section tùy biến chuyên nghiệp, có **ảnh preview trực quan**, chia theo **danh mục**, và nút **1-Click Copy Code** nhanh chóng để dán vào theme Shopify. Sẵn sàng deploy 100% lên **Vercel** với giao diện **Tailwind CSS**.

---

## ✨ Tính Năng Nổi Bật

- 🖼️ **Ảnh Preview Trực Quan**: Mỗi section đều có ảnh preview sắc nét, hỗ trợ xem chế độ Desktop / Mobile.
- ⚡ **1-Click Quick Copy**: Nút copy code tức thì với hiệu ứng thông báo `Đã sao chép!`, kèm nút tải file `.liquid` trực tiếp.
- 📂 **Phân Chia Theo Danh Mục (Category Tabs)**:
  - **Hero & Banner**: Banner chính, dual image desktop/mobile, overlay, CTA.
  - **Features & Bento**: Bento grid phong cách Apple, tính năng sản phẩm, số liệu thống kê.
  - **Product & Conversion**: Lưới sản phẩm nổi bật, thanh mua hàng nổi (Sticky Add To Cart).
  - **Social Proof & Reviews**: Lưới đánh giá 5 sao kèm avatar khách hàng, dải logo báo chí/đối tác chạy vô tận.
  - **FAQ & Support**: Hỏi đáp FAQ dạng Accordion có thanh tìm kiếm trực tiếp và form liên hệ.
  - **Announcement & Header**: Thanh thông báo chạy chữ (Marquee Ticker) vô tận mượt mà.
- 🔍 **Live Search Tức Thì**: Tìm kiếm section theo tên, preset, từ khóa, tag hoặc tính năng.
- 📱 **Responsive 100%**: Tối ưu hiển thị hoàn hảo trên Mobile, Tablet và Desktop.
- 🚀 **Deploy Vercel Cực Nhanh**: Dự án được xây dựng bằng **Next.js 16 + Tailwind CSS**, build tĩnh (Static Pre-rendering) tải trang 0ms.
- 🛡️ **Chuẩn Shopify Online Store 2.0**: Toàn bộ code Liquid đều có đầy đủ `schema`, `presets`, `settings` tương thích với theme Dawn, Debutify, Sense, Refresh,...

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### 1. Yêu cầu môi trường
- Node.js >= 18.x (hoặc v20+)
- npm hoặc yarn / pnpm

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Build sản phẩm (Production Test)
```bash
npm run build
npm run start
```

---

## 🌐 Hướng Dẫn Deploy Lên Vercel

### Cách 1: Deploy qua Vercel Dashboard (Khuyên dùng)
1. Push code lên GitHub:
   ```bash
   git add .
   git commit -m "feat: shopify custom sections library with preview and quick copy"
   git push origin main
   ```
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. Chọn **Add New...** > **Project**.
4. Chọn repository `sections-shopify`.
5. Nhấn **Deploy**. Vercel sẽ tự động phát hiện Next.js và hoàn tất deploy trong ~30 giây!

### Cách 2: Deploy qua Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## ➕ Cách Thêm Section Mới Vào Thư Viện

Khi bạn viết thêm một section Shopify mới, chỉ cần 3 bước đơn giản:

1. **Bỏ file `.liquid` vào thư mục `sections/`**:
   - Ví dụ: `sections/my-new-section.liquid`
2. **Khai báo metadata vào `src/data/sections-meta.ts`**:
   - Thêm tiêu đề, danh mục (`hero`, `features`, `product`, `social-proof`, `faq`, `header`), tên preset và tags.
3. **Thêm ảnh preview vào `public/previews/`**:
   - Ví dụ: `public/previews/my-new-section.svg` (hoặc `.png`, `.webp`).
4. Build hoặc push lên GitHub, Vercel sẽ tự động cập nhật section mới lên website!

---

## 🛠️ Cách Thêm Section Vào Store Shopify

1. Trong **Shopify Admin**, vào **Online Store** > **Themes**.
2. Nhấn vào biểu tượng **"..."** bên cạnh theme đang dùng > Chọn **Edit code**.
3. Tại cột trái, tìm thư mục **Sections** > Bấm **Add a new section**.
4. Đặt tên file tương ứng (ví dụ: `custom-hero.liquid`).
5. Xóa toàn bộ code mặc định trong file, bấm nút **Copy Code** trên trang web này và dán vào, sau đó nhấn **Save**.
6. Quay lại **Online Store** > **Themes** > **Customize**. Nhấn **Add section** và tìm tên Preset của section đó để kéo thả và tùy biến!
