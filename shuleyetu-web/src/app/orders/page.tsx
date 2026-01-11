import Link from "next/link";

export default async function OrdersPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-3 py-8 md:px-4 md:py-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-500/10 p-2.5 text-sky-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Orders
            </h1>
            <p className="text-sm text-slate-400">
              Create, track, and manage your school supply orders
            </p>
          </div>
        </div>
      </header>

      {/* Action Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {/* Create Order */}
        <Link
          href="/orders/new"
          className="group flex flex-col rounded-xl border border-slate-800 bg-gradient-to-br from-sky-950/50 to-slate-900/50 p-5 transition-all hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/5"
        >
          <div className="mb-4 inline-flex rounded-lg bg-sky-500/10 p-3 text-sky-400 transition-colors group-hover:bg-sky-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
            Create New Order
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Browse vendors and create a new order for school supplies.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-400 group-hover:text-sky-300">
            Start ordering
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        {/* Track Order */}
        <Link
          href="/orders/track"
          className="group flex flex-col rounded-xl border border-slate-800 bg-gradient-to-br from-emerald-950/50 to-slate-900/50 p-5 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
            Track Order
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Check the status and details of your existing order.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:text-emerald-300">
            Track now
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        {/* Vendor Dashboard */}
        <Link
          href="/dashboard/orders"
          className="group flex flex-col rounded-xl border border-slate-800 bg-gradient-to-br from-violet-950/50 to-slate-900/50 p-5 transition-all hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5"
        >
          <div className="mb-4 inline-flex rounded-lg bg-violet-500/10 p-3 text-violet-400 transition-colors group-hover:bg-violet-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">
            Vendor Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage orders for your vendor business (login required).
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-400 group-hover:text-violet-300">
            Go to dashboard
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </section>

      {/* How it works */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">How ordering works</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-slate-950">
              1
            </div>
            <div>
              <p className="font-medium text-slate-200">Choose a vendor</p>
              <p className="text-xs text-slate-400">Browse vendors near you</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-slate-950">
              2
            </div>
            <div>
              <p className="font-medium text-slate-200">Select items</p>
              <p className="text-xs text-slate-400">Add to your order</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-slate-950">
              3
            </div>
            <div>
              <p className="font-medium text-slate-200">Pay with M-Pesa</p>
              <p className="text-xs text-slate-400">Secure mobile payment</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-slate-950">
              4
            </div>
            <div>
              <p className="font-medium text-slate-200">Collect</p>
              <p className="text-xs text-slate-400">Pick up from vendor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/20 p-5">
        <div className="flex gap-4">
          <div className="flex-shrink-0 text-slate-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="text-slate-300">
              <span className="font-medium text-slate-200">Privacy note:</span> For your security, 
              orders are not publicly listed. After placing an order, you&apos;ll receive a unique 
              tracking link to view your order details and payment status.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-4 rounded-xl border border-slate-800 bg-gradient-to-r from-sky-950/30 to-slate-900/30 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-200">Ready to get school supplies?</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Create your first order and get textbooks, uniforms, and stationery from trusted vendors.
        </p>
        <Link
          href="/orders/new"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Order
        </Link>
      </section>
    </main>
  );
}
