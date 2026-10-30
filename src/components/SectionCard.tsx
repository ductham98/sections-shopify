"use client";

import React, { useState } from "react";
import { Copy, Check, Eye, Code, FileCode2 } from "lucide-react";
import { SectionItem } from "@/lib/sections";

interface SectionCardProps {
  section: SectionItem;
  onOpenModal: (section: SectionItem, initialTab?: "preview" | "code" | "guide") => void;
}

export function SectionCard({ section, onOpenModal }: SectionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(section.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div
      onClick={() => onOpenModal(section, "preview")}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-black/30 cursor-pointer"
    >
      {/* Thumbnail Preview Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={section.previewImage}
          alt={section.title}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Category & OS 2.0 Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-md bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {section.category.toUpperCase()}
          </span>
          <span className="rounded-md bg-emerald-600/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            OS 2.0
          </span>
        </div>

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-zinc-950/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-zinc-900 shadow-lg transition hover:bg-zinc-100">
            <Eye className="h-4 w-4 text-emerald-600" />
            Xem Chi Tiết
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(section, "code");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900/90 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-zinc-900"
          >
            <Code className="h-4 w-4 text-emerald-400" />
            Xem Code
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 transition-colors">
              {section.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {section.titleVi}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {section.descriptionVi}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {section.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
          {section.tags.length > 3 && (
            <span className="text-[10px] text-zinc-400 py-0.5">
              +{section.tags.length - 3}
            </span>
          )}
        </div>

        {/* Section Stats (Line count, File size) */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] text-zinc-400 dark:border-zinc-800/80">
          <div className="flex items-center gap-1">
            <FileCode2 className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono">{section.filename}</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>{section.lineCount} dòng</span>
            <span>•</span>
            <span>{section.fileSizeFormatted}</span>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
          {/* View Code / Preview Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(section, "code");
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Code className="h-3.5 w-3.5 text-zinc-500" />
            <span>Xem Code</span>
          </button>

          {/* Quick Copy Button */}
          <button
            onClick={handleCopyCode}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold shadow-xs transition ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Đã Chép!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
