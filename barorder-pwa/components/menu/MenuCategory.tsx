"use client";

import type { MenuCategory as MenuCategoryType } from "@/types";

type MenuCategoryProps = {
  categories: MenuCategoryType[];
  activeCategory: MenuCategoryType | "all";
  onCategoryChange: (category: MenuCategoryType | "all") => void;
};

const CATEGORY_LABELS: Record<MenuCategoryType | "all", string> = {
  all: "Kaikki",
  beer: "Oluet",
  cider: "Siiderit",
  wine: "Viinit",
  food: "Ruoka",
  other: "Muut",
};

export function MenuCategory({
  categories,
  activeCategory,
  onCategoryChange,
}: MenuCategoryProps) {
  const visibleCategories: Array<MenuCategoryType | "all"> = ["all", ...categories];

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2">
        {visibleCategories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500",
              ].join(" ")}
            >
              {CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
