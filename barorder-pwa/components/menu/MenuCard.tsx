import type { MenuItem } from "@/types";

type MenuCardProps = {
  item: MenuItem;
};

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">{item.name}</h3>
          {item.description ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
          ) : null}
        </div>
        <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price)}</p>
      </div>
      <button
        type="button"
        className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Lisaa koriin
      </button>
    </article>
  );
}
