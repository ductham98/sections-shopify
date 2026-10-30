"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

interface SectionSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
  onClearAll?: () => void;
  isFilterActive?: boolean;
}

export function SectionSidebar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  onClearAll,
  isFilterActive,
}: SectionSidebarProps) {
  return (
    <aside className="w-full flex flex-col gap-5 p-4 sm:p-5 text-sm">
      {/* Top row: Title + Clear all */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-wider text-zinc-400">
          Filters
        </span>
        {isFilterActive && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* 1. Search */}
      <div className="flex flex-col gap-2">
        <label htmlFor="sidebar-search" className="font-semibold text-xs text-zinc-700">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            id="sidebar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sections..."
            className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2 pl-8 pr-7 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <hr className="border-[#E5E5E5]" />

      {/* 2. Categories (Radio style) */}
      <div className="flex flex-col gap-2.5">
        <span className="font-semibold text-xs text-zinc-700">Categories</span>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition select-none ${
                  isSelected
                    ? "bg-zinc-100 font-semibold text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-normal"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Radio indicator */}
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900"
                        : "border-zinc-300 group-hover:border-zinc-400"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span>{cat.name}</span>
                </div>

                <span
                  className={`text-[11px] font-mono ${
                    isSelected ? "text-zinc-700 font-bold" : "text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
