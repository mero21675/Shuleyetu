"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { StatCard, BarChart, LineChart, PieChart } from "@/components/ui/Chart";

type VendorMapping = {
  vendor_id: string;
  vendors?: {
    name: string | null;
  }[] | null;
};

type RecentOrder = {
  id: string;
  created_at: string;
  total_amount_tzs: number;
  status: string;
  payment_status: string;
  customer_name: string | null;
};

type Analytics = {
  totalSales: number;
  paidOrders: number;
  pendingOrders: number;
  completedOrders: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendor, setVendor] = useState<VendorMapping | null>(null);
  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSales: 0,
    paidOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

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

      const [
        { count: invCount },
        { count: ordCount },
        { data: orders },
        { data: recentOrd },
      ] = await Promise.all([
        supabaseClient
          .from('inventory')
          .select('id', { count: 'exact', head: true })
          .eq('vendor_id', vendorId),
        supabaseClient
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('vendor_id', vendorId),
        supabaseClient
          .from('orders')
          .select('total_amount_tzs, status, payment_status')
          .eq('vendor_id', vendorId),
        supabaseClient
          .from('orders')
          .select('id, created_at, total_amount_tzs, status, payment_status, customer_name')
          .eq('vendor_id', vendorId)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setInventoryCount(invCount ?? 0);
      setOrdersCount(ordCount ?? 0);
      setRecentOrders((recentOrd as RecentOrder[]) ?? []);

      // Calculate analytics
      if (orders) {
        const totalSales = orders
          .filter((o) => o.payment_status === 'paid')
          .reduce((sum, o) => sum + (o.total_amount_tzs || 0), 0);
        const paidOrders = orders.filter((o) => o.payment_status === 'paid').length;
        const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'awaiting_payment').length;
        const completedOrders = orders.filter((o) => o.status === 'completed').length;

        setAnalytics({ totalSales, paidOrders, pendingOrders, completedOrders });
      }

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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-TZ') + ' TZS';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-TZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'paid': return 'text-emerald-400';
      case 'processing': return 'text-sky-400';
      case 'shipped': return 'text-sky-400';
      case 'pending': return 'text-amber-400';
      case 'awaiting_payment': return 'text-amber-400';
      case 'cancelled': return 'text-red-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-3 py-8 md:px-4 md:py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Vendor Dashboard
        </h1>
        <p className="text-sm text-slate-300">Welcome back, {vendorName}</p>
      </header>

      {/* Analytics Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={formatCurrency(analytics.totalSales)}
          change={12.5}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Paid Orders"
          value={analytics.paidOrders}
          change={8.2}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Pending Orders"
          value={analytics.pendingOrders}
          change={-3.1}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Completed Orders"
          value={analytics.completedOrders}
          change={15.3}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          }
        />
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/dashboard/inventory"
          className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-sky-500/50 hover:bg-slate-900/60"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Inventory</p>
            <svg className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-50">
            {inventoryCount ?? '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">Active items in your store</p>
        </Link>

        <Link
          href="/dashboard/orders"
          className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-sky-500/50 hover:bg-slate-900/60"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Orders</p>
            <svg className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-50">
            {ordersCount ?? '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">All-time orders received</p>
        </Link>

        <Link
          href="/dashboard/inventory/new"
          className="group rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-5 transition-all hover:border-sky-500/50 hover:bg-slate-900/40"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Quick Action</p>
            <svg className="h-4 w-4 text-slate-500 transition-transform group-hover:rotate-90 group-hover:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-200">Add New Item</p>
          <p className="mt-1 text-xs text-slate-400">Add products to your inventory</p>
        </Link>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Sales Overview</h3>
          <div className="flex justify-center">
            <LineChart 
              data={[
                { label: 'Jan', value: 45000 },
                { label: 'Feb', value: 52000 },
                { label: 'Mar', value: 48000 },
                { label: 'Apr', value: 61000 },
                { label: 'May', value: 58000 },
                { label: 'Jun', value: 67000 },
              ]}
              width={350}
              height={200}
            />
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Order Status</h3>
          <div className="flex justify-center">
            <PieChart 
              data={[
                { label: 'Paid', value: analytics.paidOrders },
                { label: 'Pending', value: analytics.pendingOrders },
                { label: 'Completed', value: analytics.completedOrders },
              ]}
              width={200}
              height={200}
            />
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-50">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No orders yet. Share your vendor page to start receiving orders!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-400">
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Payment</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30">
                    <td className="py-3 text-slate-200">{order.customer_name || 'Anonymous'}</td>
                    <td className="py-3 font-medium text-slate-100">{formatCurrency(order.total_amount_tzs)}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium capitalize ${getStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href={`/vendors/${vendor?.vendor_id}`}
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-sm transition-colors hover:border-sky-500/50 hover:bg-slate-900/60"
        >
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-slate-300">View Public Page</span>
        </Link>

        <Link
          href="/orders/track"
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-sm transition-colors hover:border-sky-500/50 hover:bg-slate-900/60"
        >
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-slate-300">Track Order</span>
        </Link>

        <Link
          href="/dashboard/inventory"
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-sm transition-colors hover:border-sky-500/50 hover:bg-slate-900/60"
        >
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-slate-300">Manage Inventory</span>
        </Link>

        <Link
          href="/dashboard/orders"
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-sm transition-colors hover:border-sky-500/50 hover:bg-slate-900/60"
        >
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-slate-300">View All Orders</span>
        </Link>
      </section>
    </main>
  );
}
