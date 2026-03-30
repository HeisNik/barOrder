"use client";

import { useEffect, useState } from "react";

import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";
import type { OrderStatus } from "@/types";

type PickupCodeViewProps = {
  pickupCode: string;
  initialStatus: OrderStatus;
  orderId?: string | null;
  totalAmountCents?: number | null;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Odottaa maksuvahvistusta",
  paid: "Maksettu",
  preparing: "Valmistuksessa",
  ready: "Valmis noudettavaksi",
  delivered: "Luovutettu",
};

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`;
}

export function PickupCodeView({
  pickupCode,
  initialStatus,
  orderId = null,
  totalAmountCents,
}: PickupCodeViewProps) {
  const [timestamp, setTimestamp] = useState(() => new Date());
  const { status, isRealtimeConnected } = useRealtimeOrders({
    orderId,
    initialStatus,
  });

  useEffect(() => {
    const id = window.setInterval(() => setTimestamp(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Tilausstatus</p>
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700">
          <span
            className={[
              "h-2 w-2 rounded-full",
              isRealtimeConnected ? "animate-pulse bg-emerald-500" : "bg-zinc-400",
            ].join(" ")}
          />
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Noutokoodi</p>
        <p className="mt-2 text-6xl font-bold tracking-wider">{pickupCode}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>{timestamp.toLocaleTimeString("fi-FI")}</span>
        {typeof totalAmountCents === "number" ? <span>Maksettu: {formatPrice(totalAmountCents)}</span> : null}
      </div>
      {!isRealtimeConnected ? (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Reaaliaikainen seuranta ei ole viela yhdistetty.
        </p>
      ) : null}
    </section>
  );
}
