import { DEFAULT_ORDER_STATUS, isOrderStatus, type OrderStatus } from "@/lib/constants/order-status";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TABLE_PATTERN = /^[a-zA-Z0-9_-]{1,12}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseSlug(value: string): string | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized || !SLUG_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

export function parseTableParam(value?: string): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized || !TABLE_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

export function parseOrderStatusParam(value?: string): OrderStatus {
  if (isOrderStatus(value)) {
    return value;
  }
  return DEFAULT_ORDER_STATUS;
}

export function parsePickupCodeParam(value?: string): string {
  if (value && value.trim().length > 0) {
    const normalized = value.trim();
    return normalized.startsWith("#") ? normalized : `#${normalized}`;
  }

  const fallback = Math.floor(100 + Math.random() * 900);
  return `#${fallback}`;
}

export function parseOrderIdParam(value?: string): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!UUID_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

export function parseAmountCentsParam(value?: string): number | null {
  if (!value) {
    return null;
  }

  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 0) {
    return null;
  }

  return numeric;
}
