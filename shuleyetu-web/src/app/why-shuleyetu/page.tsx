import Link from "next/link";

export default function WhyShuleyetuPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-3 py-10 md:px-4 md:py-16">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Why Shuleyetu
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          A simple marketplace for real school needs in Tanzania
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          Shuleyetu helps parents, schools, and stationery vendors coordinate around
          real book lists and uniforms. It is intentionally small, focused, and
          built for Tanzanian school years and daily realities.
        </p>
        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 font-medium text-slate-950 hover:bg-sky-400"
          >
            Create a test order
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-4 py-2 font-medium text-slate-100 hover:border-sky-500 hover:text-sky-300"
          >
            Become a vendor
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50">
            Designed for parents
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• See required books and items in one place.</li>
            <li>• Avoid last–minute rush at the stationery shop.</li>
            <li>• Keep a history of what you bought, for which child.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50">
            Built with vendors
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• Simple inventory and order list – no complex ERP.</li>
            <li>• Works with existing phones and staff.</li>
            <li>• ClickPesa payments for mobile money.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50">
            Helpful for schools
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• Share standardised lists with families.</li>
            <li>• Recommend trusted local vendors.</li>
            <li>• Reduce parents buying the wrong materials.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-50">Screenshots (preview)</h2>
        <p className="text-xs text-slate-400">
          Simple UI, focused on doing just a few things well. These are example
          layouts for how Shuleyetu looks today.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3">
            <div className="h-20 rounded-md bg-slate-900/80" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-50">
                Vendor dashboard
              </p>
              <p className="text-[11px] text-slate-400">
                Inventory and orders for one stationery shop.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3">
            <div className="h-20 rounded-md bg-slate-900/80" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-50">Parent order flow</p>
              <p className="text-[11px] text-slate-400">
                Pick a vendor, choose items, and add student details.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3">
            <div className="h-20 rounded-md bg-slate-900/80" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-50">
                ClickPesa payment
              </p>
              <p className="text-[11px] text-slate-400">
                USSD push payment page with status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-800 pt-6 text-xs text-slate-400">
        <p>
          Shuleyetu is still an experiment. Feedback from Tanzanian parents,
          teachers, and vendors is what will make it truly useful.
        </p>
        <p>
          To share comments or ideas, start a test order or log in as a vendor and
          try the dashboard, then adjust the product together.
        </p>
      </section>
    </main>
  );
}
