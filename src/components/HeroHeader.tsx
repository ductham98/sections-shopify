"use client";

import React from "react";
import { Search, Sparkles, CheckCircle2, Zap, Shield, Smartphone } from "lucide-react";

interface HeroHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalSections: number;
}

export function HeroHeader({ searchQuery, onSearchChange, totalSections }: HeroHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-zinc-50 via-white to-zinc-50/50 py-12 sm:py-16 dark:border-zinc-800/80 dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950">
      {/* Decorative gradient blur background */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="h-64 w-[600px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-indigo-500/10 blur-3xl dark:from-emerald-600/10 dark:via-cyan-600/10 dark:to-indigo-600/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/70 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-sm dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Shopify Online Store 2.0 Custom Sections</span>
          <span className="rounded-full bg-emerald-200/60 px-1.5 py-0.2 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
            100% Free
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
          Kho Section Shopify Tùy Biến
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400">
            Xem Ảnh Preview &amp; Copy Code Tức Thì
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Tập hợp các section Liquid chuẩn OS 2.0 chuyên nghiệp: có ảnh preview trực quan,
          hỗ trợ Responsive Mobile/Desktop, tùy biến 100% qua Theme Customizer.
          Chỉ cần click để copy và paste vào theme của bạn.
        </p>

        {/* Key value propositions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 rounded-md bg-white/70 px-2.5 py-1 shadow-xs dark:bg-zinc-900/70">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{totalSections} Section Có Sẵn</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-white/70 px-2.5 py-1 shadow-xs dark:bg-zinc-900/70">
            <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
            <span>Tối ưu Mobile &amp; Desktop</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-white/70 px-2.5 py-1 shadow-xs dark:bg-zinc-900/70">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            <span>Không Cần Cài App Nặng Site</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-white/70 px-2.5 py-1 shadow-xs dark:bg-zinc-900/70">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span>Tương Thích Mọi Theme OS 2.0 (Dawn, v.v.)</span>
          </div>
        </div>

        {/* Big Search Bar */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm section (vd: hero, faq, review, sticky cart, ticker...)"
              className="w-full rounded-2xl border border-zinc-200/90 bg-white py-3.5 pl-12 pr-12 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/10"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Xóa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
