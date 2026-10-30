"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Eye,
  Code2,
  BookOpen,
  Monitor,
  Smartphone,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  CheckCircle2
} from "lucide-react";
import { SectionItem } from "@/lib/sections";

interface SectionModalProps {
  section: SectionItem | null;
  onClose: () => void;
  initialTab?: "preview" | "code" | "guide";
}

export function SectionModal({ section, onClose, initialTab = "preview" }: SectionModalProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "guide">(initialTab);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [codeFilter, setCodeFilter] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!section) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(section.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([section.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = section.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredCodeLines = section.code.split("\n");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {section.title}
                </h2>
                <span className="hidden sm:inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {section.filename}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Preset Name trong Theme Customizer: <strong className="text-zinc-700 dark:text-zinc-200">"{section.presetName}"</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Close Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Đã Copy!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Toàn Bộ Code</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/70 px-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
                activeTab === "preview"
                  ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                  : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Xem Ảnh Preview</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
                activeTab === "code"
                  ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                  : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Mã Nguồn Liquid ({section.lineCount} dòng)</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
                activeTab === "guide"
                  ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                  : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Hướng Dẫn Cài Đặt</span>
            </button>
          </div>

          {/* Desktop/Mobile Switcher when on Preview tab */}
          {activeTab === "preview" && (
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => setViewMode("desktop")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === "desktop"
                    ? "bg-zinc-900 text-white dark:bg-emerald-600"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === "mobile"
                    ? "bg-zinc-900 text-white dark:bg-emerald-600"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Tab Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* TAB 1: PREVIEW */}
          {activeTab === "preview" && (
            <div className="p-4 sm:p-6">
              {/* Preview Canvas Frame */}
              <div className="mx-auto flex justify-center">
                <div
                  className={`transition-all duration-300 ${
                    viewMode === "desktop"
                      ? "w-full"
                      : "w-[390px] rounded-3xl border-8 border-zinc-800 shadow-2xl overflow-hidden"
                  }`}
                >
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 shadow-sm dark:border-zinc-800">
                    {/* Simulated Browser Bar */}
                    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="rounded-md bg-zinc-900 px-3 py-1 font-mono text-[11px] text-zinc-400">
                        store.myshopify.com • {section.title}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">OS 2.0</div>
                    </div>

                    {/* Preview Image */}
                    <div className="relative aspect-[16/9] w-full bg-zinc-950">
                      <img
                        src={section.previewImage}
                        alt={section.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Details Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Đặc Điểm &amp; Tính Năng Nổi Bật
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {section.description}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {section.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Thông Tin File &amp; Schema
                  </h4>
                  <dl className="mt-3 divide-y divide-zinc-200 text-xs dark:divide-zinc-800">
                    <div className="flex justify-between py-1.5">
                      <dt className="text-zinc-500">Tên file section:</dt>
                      <dd className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {section.filename}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <dt className="text-zinc-500">Tên Preset hiển thị:</dt>
                      <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {section.presetName}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <dt className="text-zinc-500">Số dòng code:</dt>
                      <dd className="font-mono text-zinc-700 dark:text-zinc-300">
                        {section.lineCount} lines
                      </dd>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <dt className="text-zinc-500">Dung lượng file:</dt>
                      <dd className="font-mono text-zinc-700 dark:text-zinc-300">
                        {section.fileSizeFormatted}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <dt className="text-zinc-500">Chuẩn hỗ trợ:</dt>
                      <dd className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Shopify Online Store 2.0 (Theme Dawn, Debutify, Ella, Sense, v.v.)
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setActiveTab("code")}
                      className="flex-1 rounded-lg bg-zinc-900 py-2 text-center text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                      Mở Mã Nguồn Liquid →
                    </button>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE */}
          {activeTab === "code" && (
            <div className="flex h-full flex-col">
              {/* Code Toolbar */}
              <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-semibold">{section.filename}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">{section.lineCount} lines ({section.fileSizeFormatted})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-3 py-1.5 font-semibold text-zinc-200 hover:bg-zinc-700 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải .liquid</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Đã Sao Chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Sao Chép Tất Cả</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Display Container */}
              <div className="flex-1 bg-zinc-950 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto p-4 select-text">
                <table className="w-full border-collapse">
                  <tbody>
                    {filteredCodeLines.map((line, index) => (
                      <tr key={index} className="hover:bg-zinc-900/60 transition-colors">
                        <td className="w-12 select-none pr-4 text-right text-xs text-zinc-600 align-top font-mono">
                          {index + 1}
                        </td>
                        <td className="whitespace-pre text-zinc-200">
                          {line}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GUIDE */}
          {activeTab === "guide" && (
            <div className="mx-auto max-w-3xl p-6 sm:p-8">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/20">
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                  Cách thêm section "{section.title}" vào theme Shopify của bạn:
                </h3>
                <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-400">
                  Hoàn toàn không cần cài đặt thêm App trả phí. Hoạt động 100% với Shopify Dawn và mọi theme OS 2.0.
                </p>
              </div>

              {/* Steps List */}
              <ol className="mt-6 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-emerald-600">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Mở trình soạn thảo mã theme Shopify (Edit code)
                    </h4>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Trong trang quản trị <strong>Shopify Admin</strong>, vào mục{" "}
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        Online Store &gt; Themes
                      </code>
                      . Nhấn vào biểu tượng <strong>"..."</strong> bên cạnh theme hiện tại và chọn{" "}
                      <strong>Edit code</strong>.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-emerald-600">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Tạo file section mới
                    </h4>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Ở menu cột bên trái, tìm thư mục <strong>Sections</strong> và nhấn{" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        "Add a new section"
                      </span>
                      .
                    </p>
                    <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                      <span>Đặt tên file chính xác là: </span>
                      <code className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {section.filename}
                      </code>
                    </div>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-emerald-600">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Dán code Liquid và Lưu lại
                    </h4>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Xóa toàn bộ nội dung mặc định trong file mới tạo. Bấm nút bên dưới để copy toàn bộ code của section này và dán vào, sau đó nhấn <strong>Save</strong> ở góc phải.
                    </p>
                    <button
                      onClick={handleCopy}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Đã Sao Chép Code!" : "Copy Code Ngay"}</span>
                    </button>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-emerald-600">
                    4
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Thêm Section vào trang trong Theme Customizer
                    </h4>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Quay lại <strong>Online Store &gt; Themes &gt; Customize</strong>. Tại trang chủ hoặc bất kỳ trang nào bạn muốn, nhấn <strong>"Add section"</strong>, sau đó gõ tìm:
                    </p>
                    <div className="mt-2 inline-block rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-900 dark:bg-zinc-800 dark:text-white">
                      "{section.presetName}"
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      Bạn có thể tùy biến ảnh, text, màu sắc, khoảng cách trực tiếp trên thanh công cụ của Shopify!
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
