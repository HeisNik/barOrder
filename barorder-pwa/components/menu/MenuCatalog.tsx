"use client";

import { useMemo, useState } from "react";

import { MenuCard } from "@/components/menu/MenuCard";
import { MenuCategory } from "@/components/menu/MenuCategory";
import type { MenuCategory as MenuCategoryType, MenuItem } from "@/types";

type MenuCatalogProps = {
  items: MenuItem[];
};

export function MenuCatalog({ items }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryType | "all">("all");

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <section className="mt-4 w-full space-y-4">
      <MenuCategory
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      {filteredItems.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Tassa kategoriassa ei ole tuotteita.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
