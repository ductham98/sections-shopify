import { getAllSections } from "@/lib/sections";
import { SectionMarketplace } from "@/components/layout/SectionMarketplace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Sections Library | Clean Copy-Paste OS 2.0",
  description: "Explore and customize Shopify Online Store 2.0 sections. Preview live rendered Liquid sections and copy complete code in 1-click.",
  openGraph: {
    title: "Shopify Sections Library | Clean Copy-Paste OS 2.0",
    description: "Explore and customize Shopify Online Store 2.0 sections. Live previews and 1-click code copying.",
    type: "website",
  },
};

export default async function Home() {
  const sections = await getAllSections();

  return <SectionMarketplace initialSections={sections} />;
}
