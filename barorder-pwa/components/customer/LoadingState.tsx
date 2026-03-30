type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  title = "Ladataan...",
  description = "Hetki, haetaan baarin tiedot.",
}: LoadingStateProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-3 px-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer app</p>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </main>
  );
}
