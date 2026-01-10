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

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  price_tzs: number;
  stock_quantity: number;
};

export default function DashboardInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendor, setVendor] = useState<VendorMapping | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);

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

      const { data: inventory, error: invError } = await supabaseClient
        .from('inventory')
        .select('id, name, category, price_tzs, stock_quantity')
        .eq('vendor_id', vendorId)
        .order('name', { ascending: true });

      if (invError) {
        console.error('Error loading inventory', invError);
        setError('Failed to load inventory.');
        setLoading(false);
        return;
      }

      setItems((inventory as InventoryItem[]) ?? []);
      setLoading(false);
    };

    void load();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-3 py-8 md:px-4 md:py-12">
        <header className="space-y-2">
          <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
          <div className="h-7 w-40 rounded bg-slate-800 animate-pulse" />
        </header>
        <section className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 animate-pulse"
            >
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-slate-800" />
                <div className="h-2 w-24 rounded bg-slate-900" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-3 w-20 rounded bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-800" />
              </div>
            </div>
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
          href="/dashboard"
          className="text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  const vendorName = vendor?.vendors?.[0]?.name ?? 'Your vendor';

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <Link
          href="/dashboard"
          className="text-xs font-medium text-sky-400 hover:text-sky-300"
        >
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Inventory
        </h1>
        <p className="text-sm text-slate-300">Items for {vendorName}.</p>
      </header>

      {items.length === 0 ? (
        <section className="space-y-3 text-sm">
          <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
            No items yet. Use the button below to add your first item for this
            vendor.
          </p>
          <Link
            href="/dashboard/inventory/new"
            className="inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 md:w-auto"
          >
            Add item
          </Link>
        </section>
      ) : (
        <section className="space-y-3 text-sm">
          <div className="flex flex-col items-start gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>{items.length} item(s)</span>
            <Link
              href="/dashboard/inventory/new"
              className="inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 hover:bg-sky-400 md:w-auto"
            >
              Add item
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[11px] text-slate-300">
                  <span>{item.price_tzs.toLocaleString('en-TZ')} TZS</span>
                  <span>Stock: {item.stock_quantity}</span>
                  <Link
                    href={`/dashboard/inventory/${item.id}/edit`}
                    className="text-[11px] font-medium text-sky-400 hover:text-sky-300"
                  >
                    Edit
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
