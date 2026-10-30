"use client";

import React, { useEffect } from "react";
import { X, BookOpen, ShieldCheck } from "lucide-react";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallGuideModal({ isOpen, onClose }: InstallGuideModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Hướng Dẫn Cài Đặt Section Vào Shopify
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Áp dụng cho mọi Theme chuẩn Online Store 2.0 (Dawn, Sense, Refresh, v.v.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Vào mục Edit code của Theme
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Đăng nhập vào Shopify Admin &gt; Chọn <strong>Online Store</strong> &gt;{" "}
                <strong>Themes</strong>. Bấm nút dấu ba chấm <strong>&ldquo;...&rdquo;</strong> ở theme đang dùng và chọn <strong>Edit code</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Thêm File Section Mới
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Ở thanh thư mục bên trái, tìm thư mục <strong>Sections</strong> &gt; Nhấn{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Add a new section
                </span>
                . Đặt tên file tương ứng (ví dụ: <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">custom-hero.liquid</code>) rồi bấm <strong>Done</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Dán Toàn Bộ Mã Liquid &amp; Bấm Save
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Xóa các dòng mã mẫu mặc định trong file vừa tạo. Bấm nút <strong>Copy Code</strong> trên trang này và dán vào, sau đó nhấn nút <strong>Save</strong> ở góc phải trên.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              4
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Chèn Section Trong Giao Diện Kéo Thả (Customize)
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Quay lại <strong>Online Store &gt; Themes &gt; Customize</strong>. Ở thanh bên trái, chọn <strong>Add section</strong> và tìm tên Preset của section đó để thêm vào trang.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                An toàn tuyệt đối cho Store của bạn:
              </span>{" "}
              Các section này được thiết kế độc lập, không làm chậm site, không chèn mã bên thứ 3 và không ảnh hưởng đến code gốc của theme.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Đã Hiểu, Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
}
