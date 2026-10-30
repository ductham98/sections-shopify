import { getAllSections } from "@/lib/sections";
import { SectionLibrary } from "@/components/SectionLibrary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Custom Sections Library | 1-Click Copy & Paste OS 2.0",
  description: "Thư viện các section Shopify tùy biến chuẩn Online Store 2.0: có ảnh preview trực quan, code Liquid hoàn chỉnh, tối ưu Responsive và copy nhanh 1-click.",
  openGraph: {
    title: "Shopify Custom Sections Library | Free Liquid Sections",
    description: "Bộ sưu tập section Shopify tùy biến có ảnh preview và copy nhanh code Liquid.",
    type: "website",
  },
};

export default function Home() {
  const sections = getAllSections();

  return <SectionLibrary initialSections={sections} />;
}
