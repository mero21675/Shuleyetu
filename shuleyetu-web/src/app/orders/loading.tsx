export default function OrdersLoading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <div className="h-6 w-40 rounded bg-slate-800 animate-pulse" />
        <div className="h-4 w-64 rounded bg-slate-900 animate-pulse" />
      </header>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="grid gap-3 text-sm md:grid-cols-[minmax(0,2fr)_auto]">
          <div className="h-8 rounded-md bg-slate-900/80 animate-pulse" />
          <div className="h-8 rounded-md bg-slate-900/80 animate-pulse" />
        </div>
        <div className="h-3 w-40 rounded bg-slate-900 animate-pulse" />
      </section>

      <section className="space-y-3 text-sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse"
          />
        ))}
      </section>
    </main>
  );
}
