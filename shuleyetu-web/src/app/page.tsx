import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-3 py-10 md:px-4 md:py-16">
      {/* Hero */}
      <section className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Tanzanian school supply marketplace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Shuleyetu – school supplies for families and schools
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          Shuleyetu connects parents, schools, and stationery vendors to make it
          easy to buy textbooks, uniforms, and school materials across Tanzania.
          Orders are stored in Supabase and payments can be processed via
          ClickPesa.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/vendors"
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
          >
            Browse vendors
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:border-sky-500 hover:text-sky-300"
          >
            Vendor login
          </Link>
          <Link
            href="/why-shuleyetu"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-sky-500 hover:text-sky-300"
          >
            Why Shuleyetu?
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          Powered by Supabase for data and ClickPesa for payments.
        </p>
      </section>

      {/* Who it’s for */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50">
            For parents & guardians
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• Find vetted stationery vendors near your school.</li>
            <li>• See textbooks, uniforms, and stationery in one place.</li>
            <li>• Pay securely with mobile money via ClickPesa.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50">For vendors</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• Manage your inventory in a simple dashboard.</li>
            <li>• Track orders and payment status in real time.</li>
            <li>• Reach parents from different schools and regions.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50">For schools</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• Standardise book lists and required materials.</li>
            <li>• Recommend trusted vendors to parents.</li>
            <li>• Reduce last–minute rush and missing items.</li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-50">How it works</h2>
        <ol className="space-y-2 text-sm text-slate-300 md:text-[0.9rem]">
          <li>
            <span className="font-semibold text-sky-300">1.</span> Choose a
            vendor from the{" "}
            <Link
              href="/vendors"
              className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
            >
              vendors page
            </Link>{" "}
            or start an order directly.
          </li>
          <li>
            <span className="font-semibold text-sky-300">2.</span> Add
            textbooks, uniforms, and stationery to your order and provide
            student &amp; school details.
          </li>
          <li>
            <span className="font-semibold text-sky-300">3.</span> Pay with
            ClickPesa using mobile money and collect items from the vendor or
            arrange delivery.
          </li>
        </ol>

        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center rounded-md bg-slate-50 px-3 py-1.5 font-medium text-slate-950 hover:bg-slate-200"
          >
            Create a test order
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-3 py-1.5 font-medium text-slate-100 hover:border-sky-500 hover:text-sky-300"
          >
            Vendor dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}