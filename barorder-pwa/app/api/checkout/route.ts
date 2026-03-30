import { NextResponse } from "next/server";

import { DEFAULT_ORDER_STATUS } from "@/lib/constants/order-status";
import { supabase } from "@/lib/supabase";
import { isValidCheckoutRequest } from "@/lib/validators/checkout";

type MenuPriceRow = {
  id: string;
  price: number;
  is_available: boolean;
  name: string;
};

type InsertedOrderRow = {
  id: string;
};

function generatePickupCode(): string {
  const code = Math.floor(100 + Math.random() * 900);
  return `#${code}`;
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
    .select("id, name, price, is_available")
    .eq("bar_id", payload.barId)
    .in("id", menuItemIds)
    .returns<MenuPriceRow[]>();

  if (menuError) {
    return NextResponse.json({ error: menuError.message }, { status: 500 });
  }

  const priceByItemId = new Map((menuRows ?? []).map((row) => [row.id, row]));
  let totalAmount = 0;
  const orderItemsPayload: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
  }> = [];

  for (const item of payload.items) {
    const menuRow = priceByItemId.get(item.menuItemId);
    if (!menuRow || !menuRow.is_available) {
      return NextResponse.json(
        { error: `Menu item unavailable: ${item.menuItemId}` },
        { status: 400 },
      );
    }

    totalAmount += menuRow.price * item.quantity;
    orderItemsPayload.push({
      id: menuRow.id,
      name: menuRow.name,
      price: menuRow.price,
      qty: item.quantity,
    });
  }

  const pickupCode = generatePickupCode();
  const { data: insertedOrder, error: insertError } = await supabase
    .from("orders")
    .insert({
      bar_id: payload.barId,
      items: orderItemsPayload,
      total_amount: totalAmount,
      status: DEFAULT_ORDER_STATUS,
      pickup_code: pickupCode,
    })
    .select("id")
    .single<InsertedOrderRow>();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const checkoutUrl = `/success?checkout=mock&order=${insertedOrder.id}&pickup=${encodeURIComponent(
    pickupCode,
  )}&status=${DEFAULT_ORDER_STATUS}&amount=${totalAmount}`;

  return NextResponse.json({ checkoutUrl });
}
