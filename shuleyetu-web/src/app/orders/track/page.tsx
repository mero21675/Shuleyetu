"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { isUuid, parseOrderLink } from "@/lib/orderTracking";

export default function TrackOrderPage() {
  const router = useRouter();

  const [shareLink, setShareLink] = useState("");
  const [orderId, setOrderId] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => parseOrderLink(shareLink), [shareLink]);

  const resolved = useMemo(() => {
    const id = (parsed?.orderId ?? orderId).trim();
    const tok = (parsed?.token ?? token).trim();
    return { orderId: id, token: tok };
  }, [orderId, parsed, token]);

  const isReady = useMemo(() => {
    if (!resolved.orderId || !resolved.token) return false;
    return isUuid(resolved.orderId) && isUuid(resolved.token);
  }, [resolved.orderId, resolved.token]);

  const validate = (): boolean => {
    const id = resolved.orderId;
    const tok = resolved.token;

    if (!id || !tok) {
      setError("Please paste the share link or enter both Order ID and Token.");
      return false;
    }

    if (!isUuid(id)) {
      setError("Order ID must be a valid UUID.");
      return false;
    }

    if (!isUuid(tok)) {
      setError("Token must be a valid UUID.");
      return false;
    }

    setError(null);
    return true;
  };

  const goToSummary = () => {
    if (!validate()) return;
    router.push(`/orders/${resolved.orderId}?token=${encodeURIComponent(resolved.token)}`);
  };

  const goToPay = () => {
    if (!validate()) return;
    router.push(
      `/orders/pay/${resolved.orderId}?token=${encodeURIComponent(resolved.token)}`,
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-lg font-bold text-slate-950">
              S
            </div>
            Shuleyetu
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Order Tracking
          </p>
        </div>

        {/* Track Order Card */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 shadow-xl shadow-slate-950/50">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-lg bg-sky-500/10 p-3 text-sky-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-100">
              Track Your Order
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Enter your order details to check status and payment information
            </p>
          </div>

          <div className="space-y-4">
            {/* Share Link Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Shareable order link
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  value={shareLink}
                  onChange={(e) => {
                    setShareLink(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://shuleyetu.co.tz/orders/..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-50 placeholder-slate-500 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                />
              </div>
              {parsed && (
                <p className="flex items-center gap-2 text-xs text-emerald-400">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Order details detected from link
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900/40 px-2 text-slate-500">OR</span>
              </div>
            </div>

            {/* Manual Entry */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Order ID
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <input
                    value={orderId}
                    onChange={(e) => {
                      setOrderId(e.target.value);
                      setError(null);
                    }}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-50 placeholder-slate-500 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Access Token
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setError(null);
                    }}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-50 placeholder-slate-500 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {!error && !isReady && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/30 p-3">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-slate-400">
                  Enter your order details to continue
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/30 p-3">
                <svg className="h-5 w-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={goToSummary}
                disabled={!isReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Order Details
              </button>
              
              <button
                type="button"
                onClick={goToPay}
                disabled={!isReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay with ClickPesa
              </button>
            </div>
          </div>
        </div>

        {/* Help Info */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 text-amber-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300">Need help?</p>
              <p className="mt-1">
                After placing an order, you&apos;ll receive a shareable link with your order details. 
                Keep this link safe to track your order status.
              </p>
              <Link
                href="/orders/new"
                className="mt-2 inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create a new order
              </Link>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
