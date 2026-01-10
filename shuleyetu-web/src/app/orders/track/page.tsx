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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="space-y-2">
        <Link
          href="/"
          className="text-xs font-medium text-sky-400 hover:text-sky-300"
        >
          ← Home
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Track an order</h1>
        <p className="text-sm text-slate-300">
          Paste your shareable order link (recommended) or enter the Order ID and
          access token.
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">
            Shareable order link
          </label>
          <input
            value={shareLink}
            onChange={(e) => {
              setShareLink(e.target.value);
              setError(null);
            }}
            placeholder="https://your-site.com/orders/<orderId>?token=<token>"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
          />
          {parsed && (
            <p className="text-[11px] text-slate-400">
              Detected Order ID and token from the link.
            </p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Order ID
            </label>
            <input
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setError(null);
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Access token
            </label>
            <input
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError(null);
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {!error && !isReady && (
          <p className="text-[11px] text-slate-400">
            Paste the share link or enter both values (UUIDs) to continue.
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-100">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={goToSummary}
            disabled={!isReady}
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-sky-500"
          >
            View order summary
          </button>
          <button
            type="button"
            onClick={goToPay}
            disabled={!isReady}
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-emerald-500"
          >
            Pay with ClickPesa
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          If you don&apos;t have the link/token, please create a new order and keep
          the shareable link shown after checkout.
        </p>
      </section>

      <section className="text-xs text-slate-400">
        <Link href="/orders/new" className="text-sky-400 hover:text-sky-300">
          Create a new order
        </Link>
      </section>
    </main>
  );
}
