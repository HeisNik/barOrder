"use client";

import { useEffect, useState } from "react";

import { isOrderStatus } from "@/lib/constants/order-status";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/types";

type UseRealtimeOrdersInput = {
  orderId: string | null;
  initialStatus: OrderStatus;
};

type UseRealtimeOrdersValue = {
  status: OrderStatus;
  isRealtimeConnected: boolean;
};

export function useRealtimeOrders({
  orderId,
  initialStatus,
}: UseRealtimeOrdersInput): UseRealtimeOrdersValue {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (!orderId) {
      setIsRealtimeConnected(false);
      return;
    }

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const nextStatus = payload.new?.status;
          if (isOrderStatus(nextStatus)) {
            setStatus(nextStatus);
          }
        },
      )
      .subscribe((state) => {
        setIsRealtimeConnected(state === "SUBSCRIBED");
      });

    return () => {
      setIsRealtimeConnected(false);
      void supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { status, isRealtimeConnected };
}
