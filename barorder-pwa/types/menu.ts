export type MenuCategory = "beer" | "cider" | "wine" | "food" | "other";

export type MenuItem = {
  id: string;
  barId: string;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  isAvailable: boolean;
};
