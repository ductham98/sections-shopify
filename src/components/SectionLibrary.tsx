"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "./Navbar";
import { HeroHeader } from "./HeroHeader";
import { CategoryFilter } from "./CategoryFilter";
import { SectionCard } from "./SectionCard";
import { SectionModal } from "./SectionModal";
import { InstallGuideModal } from "./InstallGuideModal";
import { Footer } from "./Footer";
import { SectionItem } from "@/lib/sections";
import { CATEGORIES } from "@/data/categories";
import { SlidersHorizontal, SearchX, Sparkles } from "lucide-react";

interface SectionLibraryProps {
  initialSections: SectionItem[];
}

export function SectionLibrary({ initialSections }: SectionLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"default" | "lines" | "name">("default");
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [modalTab, setModalTab] = useState<"preview" | "code" | "guide">("preview");
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: initialSections.length,
    };

    CATEGORIES.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = initialSections.filter((s) => s.category === cat.id).length;
      }
    });

    return counts;
  }, [initialSections]);

  // Filter & Sort
  const filteredSections = useMemo(() => {
    return initialSections
      .filter((item) => {
        // Category filter
        if (activeCategory !== "all" && item.category !== activeCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesTitleVi = item.titleVi.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesDescVi = item.descriptionVi.toLowerCase().includes(q);
          const matchesPreset = item.presetName.toLowerCase().includes(q);
          const matchesFilename = item.filename.toLowerCase().includes(q);
          const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));

          return (
            matchesTitle ||
            matchesTitleVi ||
            matchesDesc ||
            matchesDescVi ||
            matchesPreset ||
            matchesFilename ||
            matchesTags
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "lines") {
          return b.lineCount - a.lineCount;
        }
        if (sortBy === "name") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [initialSections, activeCategory, searchQuery, sortBy]);

  const handleOpenModal = (
    section: SectionItem,
    initialTab: "preview" | "code" | "guide" = "preview"
  ) => {
    setSelectedSection(section);
    setModalTab(initialTab);
  };

  const handleCloseModal = () => {
    setSelectedSection(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Top Navbar */}
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        totalSections={initialSections.length}
      />

      {/* Hero Header with Search */}
      <HeroHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalSections={initialSections.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="mb-6">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Filter bar summary & Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <span>Hiển thị</span>
            <strong className="text-zinc-900 dark:text-white font-bold">
              {filteredSections.length}
            </strong>
            <span>section {activeCategory !== "all" && `trong danh mục này`}</span>
            {searchQuery && (
              <span className="rounded-md bg-zinc-200/70 px-2 py-0.5 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                Từ khóa: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-zinc-500">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="default">Mặc định</option>
              <option value="lines">Nhiều dòng code nhất</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid of Section Cards */}
        {filteredSections.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="mx-auto my-16 max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
              Không tìm thấy section nào
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Không có kết quả khớp với từ khóa "{searchQuery}". Hãy thử tìm kiếm bằng từ khóa khác hoặc xóa bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Xem Tất Cả Sections
            </button>
          </div>
        )}
      </main>

      {/* Section Detail & Code Modal */}
      <SectionModal
        section={selectedSection}
        onClose={handleCloseModal}
        initialTab={modalTab}
      />

      {/* Standalone Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
