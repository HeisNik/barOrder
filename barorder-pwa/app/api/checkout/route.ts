import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import type { CheckoutLineItemInput, CheckoutRequest } from "@/types";

type MenuPriceRow = {
  id: string;
  price: number;
  is_available: boolean;
};

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

function isValidCheckoutRequest(input: unknown): input is CheckoutRequest {
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

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidCheckoutRequest(payload)) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const menuItemIds = payload.items.map((item) => item.menuItemId);
  const { data: menuRows, error: menuError } = await supabase
    .from("menu_items")
    .select("id, price, is_available")
    .eq("bar_id", payload.barId)
    .in("id", menuItemIds)
    .returns<MenuPriceRow[]>();

  if (menuError) {
    return NextResponse.json({ error: menuError.message }, { status: 500 });
  }

  const priceByItemId = new Map((menuRows ?? []).map((row) => [row.id, row]));
  let totalAmount = 0;

  for (const item of payload.items) {
    const menuRow = priceByItemId.get(item.menuItemId);
    if (!menuRow || !menuRow.is_available) {
      return NextResponse.json(
        { error: `Menu item unavailable: ${item.menuItemId}` },
        { status: 400 },
      );
    }

    totalAmount += menuRow.price * item.quantity;
  }

  // Placeholder for Stripe redirect in part 7.
  const checkoutUrl = `/success?checkout=mock&amount=${totalAmount}`;

  return NextResponse.json({ checkoutUrl });
}
