'use client';

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col">
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
              {t('heroTagline')}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-50 md:text-5xl lg:text-6xl">
              {t('heroTitle')}
              <span className="block text-sky-400">{t('heroTitleHighlight')}</span>
            </h1>
            
            <p className="text-lg text-slate-300 md:text-xl">
              {t('heroDescription')}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 hover:shadow-sky-400/30"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('browseVendors')}
              </Link>
              <Link
                href="/orders/new"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900/50 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:border-sky-500 hover:bg-slate-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t('createOrder')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-5xl px-3 py-8 md:px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-400 md:text-3xl">100+</p>
              <p className="text-xs text-slate-400 md:text-sm">{t('vendorsCount')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-400 md:text-3xl">5000+</p>
              <p className="text-xs text-slate-400 md:text-sm">{t('productsCount')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-400 md:text-3xl">26</p>
              <p className="text-xs text-slate-400 md:text-sm">{t('regionsCount')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-400 md:text-3xl">24/7</p>
              <p className="text-xs text-slate-400 md:text-sm">{t('support')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">{t('builtForEveryone')}</h2>
          <p className="mt-2 text-sm text-slate-400">{t('builtForEveryoneDesc')}</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-sky-500/50 hover:bg-slate-900/60">
            <div className="mb-4 inline-flex rounded-lg bg-sky-500/10 p-3 text-sky-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-50">{t('forParents')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('findTrustedVendors')}
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('comparePrices')}
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Pay securely with mobile money
              </li>
            </ul>
          </div>

          <div className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-sky-500/50 hover:bg-slate-900/60">
            <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-50">For Vendors</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Manage inventory easily
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Track orders in real time
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Reach more customers
              </li>
            </ul>
          </div>

          <div className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-sky-500/50 hover:bg-slate-900/60">
            <div className="mb-4 inline-flex rounded-lg bg-amber-500/10 p-3 text-amber-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-50">For Schools</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Standardise book lists
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Recommend trusted vendors
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Reduce last-minute rush
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-slate-400">Get started in three simple steps</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Find a Vendor</h3>
              <p className="mt-2 text-sm text-slate-400">
                Search vendors by location or browse our list to find one near your school.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Place Your Order</h3>
              <p className="mt-2 text-sm text-slate-400">
                Add textbooks, uniforms, and stationery to your cart with student details.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-slate-950">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-50">Pay & Collect</h3>
              <p className="mt-2 text-sm text-slate-400">
                Pay securely with mobile money via ClickPesa and collect from the vendor.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/vendors"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400"
            >
              Get Started
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl px-3 py-12 md:px-4 md:py-16">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-sky-950/50 to-slate-900/50 p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">
            Ready to simplify school shopping?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300 md:text-base">
            Join thousands of parents and vendors across Tanzania using Shuleyetu 
            to make school supply shopping easier.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/vendors"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-sky-400"
            >
              Browse Vendors
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:border-sky-500"
            >
              Vendor Sign Up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}