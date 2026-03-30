export const ORDER_STATUSES = [
  "pending",
  "paid",
  "preparing",
  "ready",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

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
