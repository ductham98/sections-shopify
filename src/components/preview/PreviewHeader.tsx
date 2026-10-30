"use client";

import React from "react";
import { X, FileCode } from "lucide-react";
import { SectionItem } from "@/lib/sections";
import { PreviewStatus, PreviewStatusType } from "./PreviewStatus";

interface PreviewHeaderProps {
  section: SectionItem;
  status: PreviewStatusType;
  onClose: () => void;
}

export function PreviewHeader({ section, status, onClose }: PreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-white rounded-t-2xl shrink-0">
      {/* Left: Section Details */}
      <div className="flex flex-col gap-1 min-w-0 pr-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-base font-semibold text-neutral-900 truncate">
            {section.title}
          </h2>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[11px] border border-neutral-200/80">
            <FileCode className="w-3 h-3 text-neutral-500" />
            <span>{section.filename}</span>
          </div>

          <PreviewStatus status={status} />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
          <span>Preset: <strong className="font-medium text-neutral-700">{section.presetName}</strong></span>
          <span>·</span>
          <span>{section.lineCount.toLocaleString()} lines</span>
          <span>·</span>
          <span>{section.fileSizeFormatted}</span>
        </div>
      </div>

      {/* Right: Close Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onClose}
          aria-label="Close preview modal (Esc)"
          className="group flex items-center gap-1.5 p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition active:scale-95"
        >
          <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400 group-hover:text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
            ESC
          </span>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

