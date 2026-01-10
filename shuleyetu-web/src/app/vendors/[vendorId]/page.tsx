import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

type Vendor = {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  district: string | null;
  ward: string | null;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  price_tzs: number;
  stock_quantity: number;
};

interface PageProps {
  params: {
    vendorId: string;
  };
}

export default async function VendorDetailPage({ params }: PageProps) {
  const vendorId = params.vendorId;

  const [{ data: vendor, error: vendorError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabaseClient
        .from("vendors")
        .select("id, name, description, region, district, ward")
        .eq("id", vendorId)
        .maybeSingle(),
      supabaseClient
        .from("inventory")
        .select("id, name, category, price_tzs, stock_quantity")
        .eq("vendor_id", vendorId)
        .order("name", { ascending: true }),
    ]);

  if (vendorError) {
    console.error("Error loading vendor", vendorError);
  }

  if (itemsError) {
    console.error("Error loading inventory", itemsError);
  }

  if (!vendor) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-3 py-8 md:px-4 md:py-12">
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
          Vendor not found.
        </p>
        <Link
          href="/vendors"
          className="text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          ← Back to vendors
        </Link>
      </main>
    );
  }

  const inventory: InventoryItem[] = items ?? [];
  const itemCount = inventory.length;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <Link
          href="/vendors"
          className="text-xs font-medium text-sky-400 hover:text-sky-300"
        >
          ← All vendors
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {vendor.name}
        </h1>
        {vendor.description && (
          <p className="text-sm text-slate-300">{vendor.description}</p>
        )}
        <p className="text-xs text-slate-400">
          {[vendor.region, vendor.district, vendor.ward]
            .filter(Boolean)
            .join(" · ") || "Location not set"}
        </p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Inventory</h2>
          <span className="text-xs text-slate-400">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
        </div>

        {inventory.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
            No items for this vendor yet. Add rows in the
            <code className="mx-1 rounded bg-slate-800 px-1 py-0.5 text-xs">
              inventory
            </code>
            table in Supabase (with
            <code className="mx-1 rounded bg-slate-800 px-1 py-0.5 text-xs">
              vendor_id = {vendor.id}
            </code>
            ) to see them here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {inventory.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              >
                <h3 className="text-base font-medium">{item.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                  {item.category}
                </p>
                <p className="mt-2 text-sm font-semibold text-sky-300">
                  {item.price_tzs.toLocaleString("en-TZ")} TZS
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Stock: {item.stock_quantity}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}