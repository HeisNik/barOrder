import type { CheckoutRequest, CheckoutResponse } from "@/types";

export async function createCheckoutSession(payload: CheckoutRequest): Promise<CheckoutResponse> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Checkout request failed");
  }

  return (await response.json()) as CheckoutResponse;
}
