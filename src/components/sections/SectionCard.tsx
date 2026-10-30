"use client";

import React, { useState } from "react";
import { Eye, Copy, Check, LayoutGrid, Sparkles, Layers, ShoppingBag, Star, HelpCircle, Megaphone, FolderArchive } from "lucide-react";
import { SectionItem } from "@/lib/sections";
import { fetchSectionCode } from "@/lib/section-client";

interface SectionCardProps {
  section: SectionItem;
  onPreview: (section: SectionItem) => void;
  onCopySuccess: (title: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  hero: Sparkles,
  features: Layers,
  product: ShoppingBag,
  "social-proof": Star,
  faq: HelpCircle,
  header: Megaphone,
  uncategorized: FolderArchive,
};

export function SectionCard({
  section,
  onPreview,
  onCopySuccess,
}: SectionCardProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (copying) return;

    setCopying(true);
    try {
      const code = await fetchSectionCode(section.id);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopySuccess(section.title);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    } finally {
      setCopying(false);
    }
  };

  const CategoryIcon = CATEGORY_ICONS[section.category] || LayoutGrid;

  return (
    <div className="group flex flex-col rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all duration-200">
      <div className="relative border-b border-[#F0F0F0]">
        {/* Thumbnail Preview Area (Lightweight, NO iframe) */}
        <div
          onClick={() => onPreview(section)}
          className="relative h-[220px] w-full overflow-hidden bg-neutral-50/70 cursor-pointer select-none flex items-center justify-center"
        >
          {!imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/previews/${section.id}.svg`}
              alt={section.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            /* Elegant Procedural Card Graphic for new sections without dedicated SVGs */
            <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-b from-neutral-50 via-white to-neutral-100/60 border border-neutral-100">
              <div className="flex items-center justify-between text-neutral-400">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white shadow-2xs border border-neutral-200/80 text-[11px] font-mono text-neutral-600">
                  <CategoryIcon className="w-3 h-3 text-neutral-500" />
                  <span className="capitalize">{section.category}</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">OS 2.0</span>
              </div>

              <div className="my-auto text-center px-4">
                <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-sm mb-2.5">
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-xs text-neutral-800 line-clamp-1">
                  {section.title}
                </h4>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  {section.filename}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400 font-mono">
                <span>{section.settingsCount} settings</span>
                <span>·</span>
                <span>{section.blocksCount} blocks</span>
              </div>
            </div>
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-semibold shadow-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details & Actions */}
      <div className="flex flex-1 flex-col justify-between p-4 gap-3 bg-white">
        {/* Section Title */}
        <div className="flex items-center justify-between gap-2">
          <h3
            onClick={() => onPreview(section)}
            className="font-semibold text-sm text-[#222222] truncate cursor-pointer hover:text-zinc-600 transition"
            title={section.title}
          >
            {section.title}
          </h3>
          <span className="text-[11px] font-mono text-[#777777] shrink-0">
            {section.lineCount} lines
          </span>
        </div>

        {/* Single Primary Action: Copy Code */}
        <div className="pt-1">
          <button
            onClick={handleCopy}
            disabled={copying}
            className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition shadow-2xs active:scale-[0.98] ${copied
                ? "bg-emerald-600 text-white border border-emerald-600"
                : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900"
              }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-300" />
                <span>{copying ? "Loading..." : "Copy Code"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
