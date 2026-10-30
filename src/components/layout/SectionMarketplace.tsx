"use client";

import React, { useState, useMemo } from "react";
import { SectionItem } from "@/lib/sections";
import { CATEGORIES } from "@/data/categories";
import { AppHeader } from "./AppHeader";
import { SectionSidebar } from "./SectionSidebar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { SectionGrid } from "../sections/SectionGrid";
import { SectionPreviewModal } from "../sections/SectionPreviewModal";
import { Toast } from "../ui/Toast";

interface SectionMarketplaceProps {
  initialSections: SectionItem[];
}

export function SectionMarketplace({ initialSections }: SectionMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewestSorted, setIsNewestSorted] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<string[]>(["free"]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewSection, setPreviewSection] = useState<SectionItem | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute dynamic category counts from actual metadata
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

  const handleTogglePlan = (plan: string) => {
    setSelectedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setIsNewestSorted(false);
    setSelectedPlans(["free"]);
    setActiveCategory("all");
  };

  const isFilterActive =
    searchQuery.trim() !== "" ||
    isNewestSorted ||
    activeCategory !== "all" ||
    !selectedPlans.includes("free") ||
    selectedPlans.includes("gold");

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (isNewestSorted ? 1 : 0) +
    (activeCategory !== "all" ? 1 : 0) +
    (selectedPlans.length !== 1 || !selectedPlans.includes("free") ? 1 : 0);

  // Filter and sort sections
  const filteredSections = useMemo(() => {
    return initialSections
      .filter((item) => {
        // 1. Category filter
        if (activeCategory !== "all" && item.category !== activeCategory) {
          return false;
        }

        // 2. Plan filter
        if (selectedPlans.length > 0 && !selectedPlans.includes(item.plan)) {
          return false;
        }
        if (selectedPlans.length === 0) {
          return false;
        }

        // 3. Search query filter
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
        if (isNewestSorted) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return 0;
      });
  }, [initialSections, activeCategory, selectedPlans, searchQuery, isNewestSorted]);

  const handleCopySuccess = (sectionTitle: string) => {
    setToastMessage(`Liquid code copied! (${sectionTitle})`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#222222] flex flex-col font-sans">
      {/* Top Application Header */}
      <AppHeader
        totalCount={initialSections.length}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Left Sticky Sidebar (Desktop) */}
        <div className="w-[280px] xl:w-[300px] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto bg-white border-r border-[#E5E5E5] hidden lg:block">
          <SectionSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isNewestSorted={isNewestSorted}
            onToggleNewest={setIsNewestSorted}
            selectedPlans={selectedPlans}
            onTogglePlan={handleTogglePlan}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categoryCounts={categoryCounts}
            onClearAll={handleClearAll}
            isFilterActive={isFilterActive}
          />
        </div>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <SectionGrid
            sections={filteredSections}
            totalFilteredCount={filteredSections.length}
            onPreview={setPreviewSection}
            onCopySuccess={handleCopySuccess}
            onClearFilters={handleClearAll}
            isFilterActive={isFilterActive}
          />
        </main>
      </div>

      {/* Mobile / Tablet Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isNewestSorted={isNewestSorted}
        onToggleNewest={setIsNewestSorted}
        selectedPlans={selectedPlans}
        onTogglePlan={handleTogglePlan}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryCounts={categoryCounts}
        onClearAll={handleClearAll}
        isFilterActive={isFilterActive}
      />

      {/* Large Live Section Preview Modal */}
      <SectionPreviewModal
        section={previewSection}
        onClose={() => setPreviewSection(null)}
        onCopySuccess={handleCopySuccess}
      />

      {/* Copy Code Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
