import type { CheckoutLineItemInput, CheckoutRequest } from "@/types";

function isValidLineItem(input: unknown): input is CheckoutLineItemInput {
  if (!input || typeof input !== "object") {
    return false;
  }

  const maybeLineItem = input as CheckoutLineItemInput;
  return (
    typeof maybeLineItem.menuItemId === "string" &&
    maybeLineItem.menuItemId.length > 0 &&
    Number.isInteger(maybeLineItem.quantity) &&
    maybeLineItem.quantity > 0
  );
}

export function isValidCheckoutRequest(input: unknown): input is CheckoutRequest {
  if (!input || typeof input !== "object") {
    return false;
  }

  const maybeRequest = input as CheckoutRequest;
  return (
    typeof maybeRequest.barId === "string" &&
    maybeRequest.barId.length > 0 &&
    Array.isArray(maybeRequest.items) &&
    maybeRequest.items.length > 0 &&
    maybeRequest.items.every(isValidLineItem)
  );
}
