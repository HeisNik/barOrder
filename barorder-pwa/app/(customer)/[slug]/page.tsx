type CustomerMenuPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CustomerMenuPage({ params }: CustomerMenuPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-3 px-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer app</p>
      <h1 className="text-3xl font-semibold tracking-tight">Baari: {slug}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Osa 0 valmis: dynaaminen customer-route toimii.
      </p>
    </main>
  );
}
