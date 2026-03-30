"use client";

type CartStickyBarProps = {
  itemCount: number;
  subtotal: number;
  onOpen: () => void;
};

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`;
}

export function CartStickyBar({ itemCount, subtotal, onOpen }: CartStickyBarProps) {
  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{itemCount} tuotetta korissa</p>
          <p className="text-base font-semibold">{formatPrice(subtotal)}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Avaa kori
        </button>
      </div>
    </div>
  );
}
