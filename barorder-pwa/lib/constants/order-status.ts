export const ORDER_STATUSES = [
  "pending",
  "paid",
  "preparing",
  "ready",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DEFAULT_ORDER_STATUS: OrderStatus = "paid";

export const ORDER_STATUS_LABELS_FI: Record<OrderStatus, string> = {
  pending: "Odottaa maksuvahvistusta",
  paid: "Maksettu",
  preparing: "Valmistuksessa",
  ready: "Valmis noudettavaksi",
  delivered: "Luovutettu",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    (ORDER_STATUSES as readonly string[]).includes(value)
  );
}
