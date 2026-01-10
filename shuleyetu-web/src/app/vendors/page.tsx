'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

type Vendor = {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  district: string | null;
  ward: string | null;
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseClient
        .from('vendors')
        .select('id, name, description, region, district, ward')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading vendors', error);
        setError('Failed to load vendors.');
        setLoading(false);
        return;
      }

      setVendors((data as Vendor[]) ?? []);
      setLoading(false);
    };

    void load();
  }, []);

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const v of vendors) {
      if (v.region && v.region.trim().length > 0) {
        set.add(v.region.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return vendors.filter((v) => {
      if (regionFilter && v.region?.trim() !== regionFilter) return false;

      if (!term) return true;

      const haystack = [
        v.name,
        v.description ?? '',
        v.region ?? '',
        v.district ?? '',
        v.ward ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [vendors, search, regionFilter]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Vendors
        </h1>
        <p className="text-sm text-slate-300">
          Stationery shops and school supply vendors available on Shuleyetu.
        </p>
      </header>

      {/* Filters */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="grid gap-3 text-sm md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Search
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by vendor name, region, or ward…"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Region
            </label>
            <select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-50 outline-none focus:border-sky-500"
            >
              <option value="">All regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Showing {filteredVendors.length} of {vendors.length} vendor
          {vendors.length === 1 ? '' : 's'}.
        </p>
      </section>

      {/* Vendors list */}
      {loading ? (
        <section className="grid gap-3 text-sm sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse sm:h-28"
            />
          ))}
        </section>
      ) : error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : filteredVendors.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
          No vendors match your filters. Try clearing the search or region.
        </p>
      ) : (
        <section className="grid gap-3 text-sm sm:grid-cols-2">
          {filteredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm transition hover:border-sky-500/70 hover:bg-slate-900 sm:p-5"
            >
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-50 group-hover:text-sky-400 md:text-base">
                  {vendor.name}
                </h2>
                {vendor.description && (
                  <p className="line-clamp-2 text-xs text-slate-300">
                    {vendor.description}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  {[vendor.region, vendor.district, vendor.ward]
                    .filter(Boolean)
                    .join(' · ') || 'Location not set'}
                </p>
              </div>
              <p className="mt-3 text-xs font-medium text-sky-400 group-hover:text-sky-300">
                View inventory →
              </p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}