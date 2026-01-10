import Link from "next/link";

export default async function OrdersPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Orders
        </h1>
        <p className="text-sm text-slate-300">
          For privacy, Shuleyetu does not list all orders publicly.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
        <p className="text-slate-200">
          To view or pay for an order, use the shareable order link shown after
          checkout.
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 font-medium text-slate-950 hover:bg-sky-400"
          >
            Create a new order
          </Link>
          <Link
            href="/orders/track"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-3 py-1.5 font-medium text-slate-100 hover:border-sky-500 hover:text-sky-300"
          >
            Track an order
          </Link>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-3 py-1.5 font-medium text-slate-100 hover:border-sky-500 hover:text-sky-300"
          >
            Vendor orders dashboard
          </Link>
        </div>

        <p className="text-[11px] text-slate-400">
          Have an order link? Use <span className="text-slate-200">Track an order</span>.
          Selling on Shuleyetu? Use <span className="text-slate-200">Vendor orders dashboard</span>{" "}
          (sign-in required).
        </p>
      </section>
    </main>
  );
}
