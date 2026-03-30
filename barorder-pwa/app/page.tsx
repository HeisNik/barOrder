import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">BarOrder PWA</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Scaffold valmis. Testaa customer-reitti: <code>/demo</code>
      </p>
      <Link
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        href="/demo"
      >
        Avaa demobaari
      </Link>
    </main>
  );
}
