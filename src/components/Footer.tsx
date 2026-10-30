"use client";

import React, { useState } from "react";
import { Layers, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Footer() {
  const [showDevGuide, setShowDevGuide] = useState(false);

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Expandable Developer Guide: How to add more sections */}
        <div className="mb-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <button
            onClick={() => setShowDevGuide(!showDevGuide)}
            className="flex w-full items-center justify-between text-left text-sm font-bold text-zinc-900 dark:text-zinc-100"
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Làm sao để thêm Section mới vào trang web này?</span>
            </div>
            {showDevGuide ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {showDevGuide && (
            <div className="mt-4 space-y-3 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/80 pt-4 dark:border-zinc-800 animate-in fade-in">
              <p>
                Rất đơn giản, bạn chỉ cần thực hiện 3 bước nhanh:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">1. Lưu file Liquid:</span>
                  <p className="mt-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    sections/ten-section.liquid
                  </p>
                  <p className="mt-1 text-zinc-500">
                    Bỏ trực tiếp file .liquid vào thư mục <code>sections/</code>.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">2. Đăng ký thông tin:</span>
                  <p className="mt-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    src/data/sections-meta.ts
                  </p>
                  <p className="mt-1 text-zinc-500">
                    Khai báo tên, danh mục (hero, faq, v.v.), preset name và tags.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">3. Ảnh preview:</span>
                  <p className="mt-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    public/previews/ten-section.svg
                  </p>
                  <p className="mt-1 text-zinc-500">
                    Thêm ảnh chụp hoặc SVG minh họa cho section.
                  </p>
                </div>
              </div>
              <p className="text-zinc-500 italic mt-2">
                Khi deploy lên Vercel, ứng dụng sẽ tự động đọc toàn bộ mã và cập nhật danh sách ngay lập tức!
              </p>
            </div>
          )}
        </div>

        {/* Footer main row */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Shopify<span className="text-emerald-600">Sections</span>
            </span>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            Thiết kế dành cho Shopify Developers &amp; Merchants. Miễn phí 100% mã nguồn mở.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ductham98/sections-shopify"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
