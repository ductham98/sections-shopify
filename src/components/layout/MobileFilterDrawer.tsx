"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { SectionSidebar } from "./SectionSidebar";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
  onClearAll: () => void;
  isFilterActive: boolean;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  onClearAll,
  isFilterActive,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        {/* Drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E5E5E5] px-4">
          <span className="font-bold text-sm text-zinc-900">Filters &amp; Categories</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 transition"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer content */}
        <div className="flex-1 overflow-y-auto">
          <SectionSidebar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeCategory={activeCategory}
            onSelectCategory={(id) => {
              onSelectCategory(id);
              onClose();
            }}
            categoryCounts={categoryCounts}
            onClearAll={onClearAll}
            isFilterActive={isFilterActive}
          />
        </div>

        {/* Drawer footer */}
        <div className="border-t border-[#E5E5E5] p-4 bg-zinc-50 flex items-center gap-3">
          {isFilterActive && (
            <button
              onClick={onClearAll}
              className="flex-1 rounded-lg border border-[#E5E5E5] bg-white py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition text-center"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition text-center"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}
