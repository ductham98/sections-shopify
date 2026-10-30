"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { SectionItem } from "@/lib/sections";
import { SectionCard } from "./SectionCard";

interface SectionGridProps {
  sections: SectionItem[];
  totalFilteredCount: number;
  onPreview: (section: SectionItem) => void;
  onCopySuccess: (title: string) => void;
  onClearFilters: () => void;
  isFilterActive: boolean;
}

export function SectionGrid({
  sections,
  totalFilteredCount,
  onPreview,
  onCopySuccess,
  onClearFilters,
  isFilterActive,
}: SectionGridProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Content Header: Clean & focused */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5E5E5] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222]">
            Sections
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Explore and customize Shopify Online Store 2.0 sections.
          </p>
        </div>

        <div className="text-xs text-[#777777] font-medium shrink-0">
          Showing <span className="font-semibold text-[#222222]">{totalFilteredCount}</span>{" "}
          {totalFilteredCount === 1 ? "section" : "sections"}
        </div>
      </div>

      {/* Grid of Sections */}
      {sections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onPreview={onPreview}
              onCopySuccess={onCopySuccess}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D4D4D8] bg-white py-16 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
            <SearchX className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-[#222222]">No sections found</h3>
          <p className="text-xs text-[#777777] max-w-sm mt-1">
            No sections match your current search and filter combination. Try adjusting your query or resetting filters.
          </p>
          {isFilterActive && (
            <button
              onClick={onClearFilters}
              className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

