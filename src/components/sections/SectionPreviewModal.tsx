"use client";

import React, { useState, useEffect } from "react";
import { X, Monitor, Smartphone, Copy, Check } from "lucide-react";
import { SectionItem } from "@/lib/sections";

interface SectionPreviewModalProps {
  section: SectionItem | null;
  onClose: () => void;
  onCopySuccess: (title: string) => void;
}

export function SectionPreviewModal({
  section,
  onClose,
  onCopySuccess,
}: SectionPreviewModalProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (section) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [section, onClose]);

  if (!section) return null;

  const handleCopy = async () => {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E5E5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-3.5 bg-white">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#222222]">
                  {section.title}
                </h2>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono text-zinc-600">
                  {section.filename}
                </span>
              </div>
              <p className="text-xs text-[#777777]">
                Preset: <strong className="text-zinc-800">{section.presetName}</strong> • {section.lineCount} lines ({section.fileSizeFormatted})
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar: Desktop / Mobile toggle + Copy Code action */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-2.5 bg-[#FAFAFA]">
          {/* Viewport switchers */}
          <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white p-1 shadow-2xs">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                viewport === "desktop"
                  ? "bg-zinc-900 text-white font-semibold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                viewport === "mobile"
                  ? "bg-zinc-900 text-white font-semibold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>

          {/* Secondary Copy Code shortcut */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition shadow-2xs ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
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

        {/* Main: Large isolated preview area */}
        <div className="flex-1 overflow-auto bg-[#F5F5F5] p-4 sm:p-6 flex items-start justify-center">
          <div
            className={`transition-all duration-300 ${
              viewport === "desktop"
                ? "w-full max-w-5xl rounded-xl border border-[#E5E5E5] bg-white shadow-sm overflow-hidden"
                : "w-[375px] min-h-[667px] rounded-3xl border-8 border-zinc-800 bg-white shadow-2xl overflow-hidden shrink-0"
            }`}
          >
            {/* Viewport header simulation bar */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2 text-[11px] text-zinc-400 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[10px] text-zinc-400">
                store.myshopify.com • {viewport === "desktop" ? "1200px" : "375px"}
              </span>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                OS 2.0
              </span>
            </div>

            {/* Iframe displaying the rendered Liquid section */}
            <iframe
              srcDoc={section.previewHtml}
              title={`${section.title} - Full Preview`}
              className={`w-full border-0 bg-white transition-all ${
                viewport === "desktop" ? "min-h-[600px] h-auto" : "h-[700px]"
              }`}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
