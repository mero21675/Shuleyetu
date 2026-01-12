"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/Toast";
import { TableRowSkeleton } from "@/components/ui/SkeletonLoader";
import { EmptyOrders } from "@/components/ui/EmptyState";

type VendorMapping = {
  vendor_id: string;
  vendors?: {
    name: string | null;
  }[] | null;
};

type OrderRow = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount_tzs: number;
  status: string;
  payment_status: string;
  created_at: string;
};

function orderStatusClass(status: string): string {
  const value = status.toLowerCase();
  if (value === 'paid' || value === 'completed') {
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  }
  if (value === 'failed' || value === 'cancelled') {
    return 'bg-red-500/20 text-red-300 border-red-500/40';
  }
  if (
    value === 'awaiting_payment' ||
    value === 'processing' ||
    value === 'pending'
  ) {
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }
  return 'bg-slate-800 text-slate-200 border-slate-600';
}

function paymentStatusClass(status: string): string {
  const value = status.toLowerCase();
  if (value === 'paid') {
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  }
  if (value === 'failed') {
    return 'bg-red-500/20 text-red-300 border-red-500/40';
  }
  if (value === 'pending' || value === 'unpaid') {
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }
  return 'bg-slate-800 text-slate-200 border-slate-600';
}

export default function DashboardOrdersPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendor, setVendor] = useState<VendorMapping | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const loadOrders = async (
    vendorId: string,
    filters?: { status?: string; fromDate?: string; toDate?: string },
  ) => {
    setLoading(true);
    setError(null);

    let query = supabaseClient
      .from('orders')
      .select(
        'id, customer_name, customer_phone, total_amount_tzs, status, payment_status, created_at',
      )
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.fromDate) {
      query = query.gte('created_at', `${filters.fromDate}T00:00:00Z`);
    }

    if (filters?.toDate) {
      query = query.lte('created_at', `${filters.toDate}T23:59:59Z`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading orders', error);
      setError('Failed to load orders.');
      setLoading(false);
      return;
    }

    setOrders((data as OrderRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
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

      await loadOrders(mapping.vendor_id, {});
    };

    void init();
  }, [router]);

  const handleFilterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!vendor) return;

    await loadOrders(vendor.vendor_id, {
      status: statusFilter || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!vendor) return;

    setUpdatingId(orderId);
    setUpdateError(null);

    const { error: updateErr } = await supabaseClient
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Error updating order status', updateErr);
      setUpdateError('Failed to update order status.');
      addToast({
        type: 'error',
        title: 'Order status not updated',
        message: 'Something went wrong. Please try again.',
      });
      setUpdatingId(null);
      return;
    }

    await loadOrders(vendor.vendor_id, {
      status: statusFilter || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

    addToast({
      type: 'success',
      title: 'Order status updated',
      message: `New status: ${newStatus}`,
    });

    setUpdatingId(null);
  };

  if (loading && !vendor) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-3 py-8 md:px-4 md:py-12">
        <header className="space-y-2">
          <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
          <div className="h-7 w-40 rounded bg-slate-800 animate-pulse" />
        </header>
        <section className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRowSkeleton key={index} />
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
          Orders
        </h1>
        <p className="text-sm text-slate-300">Orders for {vendorName}.</p>
      </header>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_auto]"
        >
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-50 outline-none focus:border-sky-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="awaiting_payment">Awaiting payment</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              From date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-50 outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              To date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-50 outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400"
            >
              Apply
            </button>
          </div>
        </form>
        <p className="text-[11px] text-slate-500">
          Showing {orders.length} order{orders.length === 1 ? '' : 's'} for this
          vendor.
        </p>
      </section>

      <section className="space-y-3 text-sm">
        {updateError && (
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-100">
            {updateError}
          </p>
        )}
        {loading && orders.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const created = new Date(order.created_at).toLocaleString('en-TZ', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <article
                  key={order.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {created}
                    </p>
                    <p className="text-sm font-medium text-slate-100">
                      {order.customer_name || 'No name'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {order.customer_phone || 'No phone'}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <p className="text-sm font-semibold text-sky-300">
                      {order.total_amount_tzs.toLocaleString('en-TZ')} TZS
                    </p>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span
                        className={`rounded-full border px-2 py-0.5 ${orderStatusClass(order.status)}`}
                      >
                        Status: {order.status}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 ${paymentStatusClass(order.payment_status)}`}
                      >
                        Payment: {order.payment_status}
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-1 md:items-end">
                      <label className="text-[10px] text-slate-400">
                        Update status
                      </label>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(order.id, event.target.value)
                        }
                        disabled={updatingId === order.id}
                        className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-sky-500 md:w-auto"
                      >
                        <option value="pending">Pending</option>
                        <option value="awaiting_payment">Awaiting payment</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="failed">Failed</option>
                      </select>
                      {updatingId === order.id && (
                        <span className="text-[10px] text-slate-400">
                          Updating…
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-[11px] font-medium text-sky-400 hover:text-sky-300"
                    >
                      View order
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
