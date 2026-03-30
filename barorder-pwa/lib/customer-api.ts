import { supabase } from "@/lib/supabase";
import { mapBarFromDb, mapMenuItemFromDb, type DbBarRow, type DbMenuItemRow } from "@/lib/mappers";
import type { Bar, MenuItem } from "@/types";

export async function getBarBySlug(slug: string): Promise<Bar | null> {
  const { data, error } = await supabase
    .from("bars")
    .select("id, slug, name, location_lat, location_long, stripe_account_id, is_active, created_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle<DbBarRow>();

  console.log("[getBarBySlug] slug:", slug);
  console.log("[getBarBySlug] data:", data);
  console.log("[getBarBySlug] error:", error);

  if (error) {
    throw new Error(`Failed to fetch bar by slug: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapBarFromDb(data);
}

export async function getAvailableMenuItems(barId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, bar_id, name, description, price, category, is_available")
    .eq("bar_id", barId)
    .eq("is_available", true)
    .order("name", { ascending: true })
    .returns<DbMenuItemRow[]>();

  if (error) {
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }

  return (data ?? []).map(mapMenuItemFromDb);
}
