import type { Bar, MenuItem, MenuCategory } from "@/types";

type DbBarRow = {
  id: string;
  slug: string;
  name: string;
  location_lat: number | null;
  location_long: number | null;
  stripe_account_id: string | null;
  is_active: boolean;
  created_at: string;
};

type DbMenuItemRow = {
  id: string;
  bar_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  is_available: boolean;
};

const CATEGORY_MAP: Record<string, MenuCategory> = {
  olut: "beer",
  beer: "beer",
  siideri: "cider",
  cider: "cider",
  viini: "wine",
  wine: "wine",
  ruoka: "food",
  food: "food",
};

function toMenuCategory(input: string | null): MenuCategory {
  if (!input) {
    return "other";
  }

  const normalized = input.trim().toLowerCase();
  return CATEGORY_MAP[normalized] ?? "other";
}

export function mapBarFromDb(row: DbBarRow): Bar {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    locationLat: row.location_lat,
    locationLong: row.location_long,
    stripeAccountId: row.stripe_account_id,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function mapMenuItemFromDb(row: DbMenuItemRow): MenuItem {
  return {
    id: row.id,
    barId: row.bar_id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: toMenuCategory(row.category),
    isAvailable: row.is_available,
  };
}

export type { DbBarRow, DbMenuItemRow };
