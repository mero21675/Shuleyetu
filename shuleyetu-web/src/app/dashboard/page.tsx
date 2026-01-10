"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

type VendorMapping = {
  vendor_id: string;
  vendors?: {
    name: string | null;
  }[] | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendor, setVendor] = useState<VendorMapping | null>(null);
  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError) {
        console.error('Error getting user', userError);
        setError('Failed to load user.');
        setLoading(false);
        return;
      }

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: mapping, error: mapError } = await supabaseClient
        .from('vendor_users')
        .select('vendor_id, vendors(name)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (mapError) {
        console.error('Error loading vendor mapping', mapError);
        setError('Failed to load vendor mapping.');
        setLoading(false);
        return;
      }

      if (!mapping) {
        setError(
          'No vendor is linked to this user. An admin must add a row in vendor_users for you.',
        );
        setLoading(false);
        return;
      }

      setVendor(mapping as unknown as VendorMapping);

      const vendorId = mapping.vendor_id;

      const [{ count: invCount }, { count: ordCount }] = await Promise.all([
        supabaseClient
          .from('inventory')
          .select('id', { count: 'exact', head: true })
          .eq('vendor_id', vendorId),
        supabaseClient
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('vendor_id', vendorId),
      ]);

      setInventoryCount(invCount ?? 0);
      setOrdersCount(ordCount ?? 0);

      setLoading(false);
    };

    void load();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-3 py-8 md:px-4 md:py-12">
        <header className="space-y-2">
          <div className="h-6 w-40 rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-64 rounded bg-slate-900 animate-pulse" />
        </header>
        <section className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse"
            />
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-3 py-8 md:px-4 md:py-12">
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
          {error}
        </p>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          Go to vendor login
        </Link>
      </main>
    );
  }

  const vendorName = vendor?.vendors?.[0]?.name ?? 'Your vendor';

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Vendor dashboard
        </h1>
        <p className="text-sm text-slate-300">Overview for {vendorName}.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/dashboard/inventory"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-sky-500/70 hover:bg-slate-900"
        >
          <p className="text-xs uppercase tracking-wide text-slate-400">Inventory</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {inventoryCount ?? '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">Active items for this vendor</p>
        </Link>
        <Link
          href="/dashboard/orders"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-sky-500/70 hover:bg-slate-900"
        >
          <p className="text-xs uppercase tracking-wide text-slate-400">Orders</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {ordersCount ?? '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total orders for this vendor</p>
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Shortcuts</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li>
              <Link
                href="/vendors"
                className="text-sky-400 hover:text-sky-300"
              >
                View public vendor page
              </Link>
            </li>
            <li>
              <Link
                href="/orders/track"
                className="text-sky-400 hover:text-sky-300"
              >
                Track an order
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
