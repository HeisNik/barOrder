import type { MenuItem } from "@/types/menu";

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  subtotal: number;
};
