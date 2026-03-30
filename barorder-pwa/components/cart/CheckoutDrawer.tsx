"use client";

import type { CartItem } from "@/types";

type CheckoutDrawerProps = {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  isCheckingOut: boolean;
  checkoutError: string | null;
  onClose: () => void;
  onIncrement: (menuItemId: string) => void;
  onDecrement: (menuItemId: string) => void;
  onRemove: (menuItemId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
};

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`;
}

export function CheckoutDrawer({
  isOpen,
  items,
  subtotal,
  isCheckingOut,
  checkoutError,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCheckout,
}: CheckoutDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/45">
      <button type="button" aria-label="Sulje kori" className="absolute inset-0" onClick={onClose} />
      <section className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tarkista tilaus</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
            >
              Sulje
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Kori on tyhja.</p>
          ) : (
            <div className="space-y-3">
              {items.map((cartItem) => (
                <article
                  key={cartItem.item.id}
                  className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{cartItem.item.name}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {formatPrice(cartItem.item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(cartItem.item.price * cartItem.quantity)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDecrement(cartItem.item.id)}
                        className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">{cartItem.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncrement(cartItem.item.id)}
                        className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(cartItem.item.id)}
                      className="text-sm text-zinc-600 underline underline-offset-2 dark:text-zinc-400"
                    >
                      Poista
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>Valisumma</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {checkoutError ? (
              <p className="mb-3 text-sm text-red-600 dark:text-red-400">{checkoutError}</p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClear}
                disabled={isCheckingOut}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700"
              >
                Tyhjenna kori
              </button>
              <button
                type="button"
                onClick={onCheckout}
                disabled={items.length === 0 || isCheckingOut}
                className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {isCheckingOut ? "Siirretaan maksuun..." : "Maksa"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
