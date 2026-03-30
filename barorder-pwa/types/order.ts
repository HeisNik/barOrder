import type { OrderStatus } from "@/lib/constants/order-status";

export type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  barId: string;
  tableNumber: string | null;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  pickupCode: string | null;
  createdAt: string;
};
