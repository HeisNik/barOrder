import { MenuCatalog } from "@/components/menu/MenuCatalog";
import { getAvailableMenuItems, getBarBySlug } from "@/lib/customer-api";

type CustomerMenuPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CustomerMenuPage({ params }: CustomerMenuPageProps) {
  const { slug } = await params;
  const bar = await getBarBySlug(slug);

  if (!bar) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-3 px-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer app</p>
        <h1 className="text-3xl font-semibold tracking-tight">Baaria ei loytynyt</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Tarkista URL-slug ja yrita uudelleen.
        </p>
      </main>
    );
  }

  const menuItems = await getAvailableMenuItems(bar.id);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-3 px-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer app</p>
      <h1 className="text-3xl font-semibold tracking-tight">Baari: {bar.name}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Slug: {slug}</p>
      {menuItems.length === 0 ? (
        <section className="mt-4 w-full rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="mb-2 text-lg font-medium">Saatavilla olevat tuotteet</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Menussa ei ole tuotteita.</p>
        </section>
      ) : (
        <MenuCatalog items={menuItems} />
      )}
    </main>
  );
}
