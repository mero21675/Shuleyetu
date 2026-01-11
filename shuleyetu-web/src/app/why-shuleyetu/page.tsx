import Link from "next/link";

export default function WhyShuleyetuPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-3 py-16 md:px-4 md:py-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
              </span>
              Why Shuleyetu
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-50 md:text-5xl lg:text-6xl">
              School supplies
              <span className="block text-sky-400">made simple</span>
            </h1>
            
            <p className="text-lg text-slate-300 md:text-xl">
              Connecting Tanzanian parents, schools, and vendors for a better school year experience.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/orders/new"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 hover:shadow-sky-400/30"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Try it now
              </Link>
              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900/50 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:border-sky-500 hover:bg-slate-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse vendors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">
            The school supply challenge in Tanzania
          </h2>
          <p className="mt-3 text-sm text-slate-400 md:text-base">
            Every year, parents face the same struggle: finding the right books, uniforms, and stationery 
            at reasonable prices from trusted vendors.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-100">Before Shuleyetu</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300">Last-minute rush at stationery shops</p>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300">Wrong books or sizes purchased</p>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300">No price comparison between vendors</p>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300">Cash payments only, no receipts</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-100">With Shuleyetu</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-emerald-400">✓</span>
                <p className="text-slate-300">Plan ahead with vendor catalogs</p>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400">✓</span>
                <p className="text-slate-300">Verified school lists and requirements</p>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400">✓</span>
                <p className="text-slate-300">Compare prices across multiple vendors</p>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400">✓</span>
                <p className="text-slate-300">Secure mobile money payments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">
            Built for everyone in the education ecosystem
          </h2>
          <p className="mt-3 text-sm text-slate-400 md:text-base">
            Whether you&apos;re a parent, vendor, or school administrator
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-xl border border-slate-800 bg-gradient-to-br from-sky-950/50 to-slate-900/50 p-6 transition-all hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/5">
            <div className="mb-4 inline-flex rounded-lg bg-sky-500/10 p-3 text-sky-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">For Parents</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Find all required items in one place
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Compare prices from multiple vendors
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Pay securely with mobile money
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Track orders from phone to delivery
              </li>
            </ul>
          </div>

          <div className="group rounded-xl border border-slate-800 bg-gradient-to-br from-emerald-950/50 to-slate-900/50 p-6 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5">
            <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">For Vendors</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Simple inventory management
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Reach more parents online
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Mobile money payments integrated
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Works with existing staff skills
              </li>
            </ul>
          </div>

          <div className="group rounded-xl border border-slate-800 bg-gradient-to-br from-violet-950/50 to-slate-900/50 p-6 transition-all hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5">
            <div className="mb-4 inline-flex rounded-lg bg-violet-500/10 p-3 text-violet-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">For Schools</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Share standardized book lists
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Recommend trusted vendors
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Reduce wrong purchases
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Better preparation for students
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">How Shuleyetu works</h2>
            <p className="mt-3 text-sm text-slate-400 md:text-base">
              Simple steps to get school supplies organized
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Browse vendors</h3>
              <p className="mt-2 text-sm text-slate-400">
                Find stationery shops near your school with the items you need
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Create order</h3>
              <p className="mt-2 text-sm text-slate-400">
                Select items, add student details, and submit your order
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Pay online</h3>
              <p className="mt-2 text-sm text-slate-400">
                Use mobile money through ClickPesa for secure payments
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                4
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Collect items</h3>
              <p className="mt-2 text-sm text-slate-400">
                Pick up your order from the vendor location
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-sky-950/50 to-slate-900/50 p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">
            Ready to make school shopping easier?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300 md:text-base">
            Join thousands of Tanzanian parents and vendors using Shuleyetu 
            to organize school supplies efficiently.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/orders/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Order
            </Link>
            <Link
              href="/vendors"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-sky-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6">
        <div className="mx-auto max-w-5xl px-3 md:px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Shuleyetu. School supplies made easy.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
              <Link href="/vendors" className="hover:text-sky-400 transition-colors">Vendors</Link>
              <Link href="/orders" className="hover:text-sky-400 transition-colors">Orders</Link>
              <Link href="/auth/login" className="hover:text-sky-400 transition-colors">Vendor Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
