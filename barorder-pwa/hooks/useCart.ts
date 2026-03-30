"use client";

import { useEffect, useMemo, useState } from "react";

import type { CartItem, MenuItem } from "@/types";

const STORAGE_KEY = "barorder:cart:v1";

type UseCartValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string) => number;
};

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry) =>
        typeof entry?.item?.id === "string" &&
        typeof entry?.item?.price === "number" &&
        typeof entry?.quantity === "number" &&
        entry.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function useCart(): UseCartValue {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedItems = readStoredItems();
    const frameId = window.requestAnimationFrame(() => {
      setItems(storedItems);
      setIsHydrated(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const subtotal = useMemo(
    () => items.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((acc, cartItem) => acc + cartItem.quantity, 0),
    [items],
  );

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.item.id === item.id);
      if (existingIndex === -1) {
        return [...prev, { item, quantity: 1 }];
      }

      const next = [...prev];
      next[existingIndex] = {
        ...next[existingIndex],
        quantity: next[existingIndex].quantity + 1,
      };
      return next;
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => prev.filter((entry) => entry.item.id !== menuItemId));
  };

  const incrementItem = (menuItemId: string) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.item.id === menuItemId ? { ...entry, quantity: entry.quantity + 1 } : entry,
      ),
    );
  };

  const decrementItem = (menuItemId: string) => {
    setItems((prev) =>
      prev.flatMap((entry) => {
        if (entry.item.id !== menuItemId) {
          return [entry];
        }

        if (entry.quantity <= 1) {
          return [];
        }

        return [{ ...entry, quantity: entry.quantity - 1 }];
      }),
    );
  };

  const clearCart = () => setItems([]);

  const getItemQuantity = (menuItemId: string) =>
    items.find((entry) => entry.item.id === menuItemId)?.quantity ?? 0;

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
    getItemQuantity,
  };
}
