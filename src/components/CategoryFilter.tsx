"use client";

import React from "react";
import { CATEGORIES } from "@/data/categories";
import {
  LayoutGrid,
  Sparkles,
  Layers,
  Star,
  ShoppingBag,
  HelpCircle,
  Megaphone,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Sparkles,
  Layers,
  Star,
  ShoppingBag,
  HelpCircle,
  Megaphone,
};

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || LayoutGrid;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-950/15 dark:bg-emerald-600 dark:text-white dark:shadow-emerald-900/20"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <IconComponent
                className={`h-4 w-4 ${
                  isActive
                    ? "text-emerald-400 dark:text-white"
                    : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                }`}
              />
              <span>{cat.nameVi}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
