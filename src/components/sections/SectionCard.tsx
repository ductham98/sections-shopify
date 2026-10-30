"use client";

import React, { useState } from "react";
import { Eye, Copy, Check } from "lucide-react";
import { SectionItem } from "@/lib/sections";
import { PlanBadge } from "./PlanBadge";

interface SectionCardProps {
  section: SectionItem;
  onPreview: (section: SectionItem) => void;
  onCopySuccess: (title: string) => void;
}

export function SectionCard({
  section,
  onPreview,
  onCopySuccess,
}: SectionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(section.code);
      setCopied(true);
      onCopySuccess(section.title);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="group flex flex-col rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all duration-200">
      {/* Top bar over preview: Plan Badge + Action trigger */}
      <div className="relative border-b border-[#F0F0F0]">
        {/* Plan Badge */}
        <div className="absolute left-3 top-3 z-10">
          <PlanBadge plan={section.plan} />
        </div>

        {/* Live Section Preview Area */}
        <div
          onClick={() => onPreview(section)}
          className="relative h-[220px] w-full overflow-hidden bg-white cursor-pointer select-none"
        >
          {/* Scaled Desktop Preview Iframe: 300% width scaled by 0.3333 fills exactly 100% width */}
          <div
            className="origin-top-left pointer-events-none select-none"
            style={{
              width: "300%",
              height: "300%",
              transform: "scale(0.333333)",
              transformOrigin: "0 0",
            }}
          >
            <iframe
              srcDoc={section.previewHtml}
              title={section.title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts"
              loading="lazy"
            />
          </div>

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/4 transition-colors duration-200" />
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

        {/* EXACTLY TWO Primary Actions: Preview & Copy Code */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Action 1: Preview */}
          <button
            onClick={() => onPreview(section)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white py-2 px-3 text-xs font-semibold text-[#222222] hover:bg-zinc-50 hover:border-zinc-300 transition shadow-2xs active:scale-[0.98]"
          >
            <Eye className="h-3.5 w-3.5 text-zinc-500" />
            <span>Preview</span>
          </button>

          {/* Action 2: Copy Code */}
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition shadow-2xs active:scale-[0.98] ${
              copied
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
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
