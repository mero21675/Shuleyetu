'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/Toast';

type Vendor = {
  id: string;
  name: string;
};

type InventoryItem = {
  id: string;
  name: string;
  price_tzs: number | string;
  stock_quantity: number | null;
};

export default function NewOrderPage() {
  const { addToast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  useEffect(() => {
    const loadVendors = async () => {
      setLoadingVendors(true);
      setError(null);
      const { data, error } = await supabaseClient
        .from('vendors')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading vendors', error);
        addToast({
          type: 'error',
          title: 'Failed to load vendors',
          message: 'Please try again later'
        });
      } else {
        setVendors(data ?? []);
        if (data && data.length > 0) {
          addToast({
            type: 'success',
            title: 'Vendors loaded',
            message: `Found ${data.length} vendors`
          });
        }
      }
      setLoadingVendors(false);
    };

    loadVendors();
  }, [addToast]);

  useEffect(() => {
    const loadItems = async () => {
      if (!selectedVendorId) {
        setItems([]);
        setQuantities({});
        return;
      }

      setLoadingItems(true);
      setError(null);

      const { data, error } = await supabaseClient
        .from('inventory')
        .select('id, name, price_tzs, stock_quantity')
        .eq('vendor_id', selectedVendorId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading inventory', error);
        addToast({
          type: 'error',
          title: 'Failed to load inventory',
          message: 'Please try selecting a different vendor'
        });
      } else {
        setItems(data ?? []);
        setQuantities({});
        if (data && data.length > 0) {
          addToast({
            type: 'success',
            title: 'Inventory loaded',
            message: `Found ${data.length} items`
          });
        }
      }

      setLoadingItems(false);
    };

    void loadItems();
  }, [selectedVendorId, addToast]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const quantity = quantities[item.id] ?? 0;
      if (quantity <= 0) return sum;

      const priceNumber =
        typeof item.price_tzs === 'string'
          ? Number.parseFloat(item.price_tzs)
          : item.price_tzs;
      if (Number.isNaN(priceNumber)) return sum;

      return sum + priceNumber * quantity;
    }, 0);
  }, [items, quantities]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setCreatedOrderId(null);
    setCreatedToken(null);

    if (!selectedVendorId) {
      addToast({
        type: 'error',
        title: 'No vendor selected',
        message: 'Please select a vendor to continue'
      });
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      addToast({
        type: 'error',
        title: 'Missing customer information',
        message: 'Please provide both customer name and phone number'
      });
      return;
    }

    const selectedItems = items.filter((item) => (quantities[item.id] ?? 0) > 0);
    if (selectedItems.length === 0) {
      addToast({
        type: 'error',
        title: 'No items selected',
        message: 'Please choose at least one item to order'
      });
      return;
    }

    if (totalAmount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid order total',
        message: 'Please select at least one item with quantity greater than zero'
      });
      return;
    }

    setSubmitting(true);

    try {
      const publicAccessToken = (() => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }

        // UUID v4 fallback
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.floor(Math.random() * 16);
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      })();

      const { data: orderData, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          vendor_id: selectedVendorId,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          student_name: studentName.trim() || null,
          school_name: schoolName.trim() || null,
          total_amount_tzs: totalAmount,
          public_access_token: publicAccessToken,
        })
        .select('id')
        .single();

      if (orderError || !orderData) {
        console.error('Error creating order', orderError);
        const message =
          orderError?.message?.includes('public_access_token')
            ? 'Failed to create order. The database is missing public access tokens. Apply the latest Supabase migration and try again.'
            : 'Failed to create order.';
        addToast({
          type: 'error',
          title: 'Order creation failed',
          message: message
        });
        setSubmitting(false);
        return;
      }

      const orderId = orderData.id as string;

      const itemsPayload = selectedItems.map((item) => {
        const quantity = quantities[item.id] ?? 0;
        const priceNumber =
          typeof item.price_tzs === 'string'
            ? Number.parseFloat(item.price_tzs)
            : item.price_tzs;

        return {
          order_id: orderId,
          inventory_id: item.id,
          quantity,
          unit_price_tzs: priceNumber,
        };
      });

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(itemsPayload);

      if (itemsError) {
        console.error('Error creating order items', itemsError);
        addToast({
          type: 'warning',
          title: 'Order partially created',
          message: 'Order was created but adding items failed. Please contact support.'
        });
        setSubmitting(false);
        return;
      }

      addToast({
        type: 'success',
        title: 'Order created successfully!',
        message: `Order #${orderId.slice(0, 8)} has been created`
      });
      setCreatedOrderId(orderId);
      setCreatedToken(publicAccessToken);
      setQuantities({});
      setCustomerName('');
      setCustomerPhone('');
      setStudentName('');
      setSchoolName('');
    } catch (err) {
      console.error('Unexpected error when creating order', err);
      addToast({
        type: 'error',
        title: 'Unexpected error',
        message: 'Something went wrong while creating your order. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12">
      <header className="space-y-2">
        <Link
          href="/vendors"
          className="text-xs font-medium text-sky-400 hover:text-sky-300"
        >
          ← View vendors
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">New order</h1>
        <p className="text-sm text-slate-300">
          Create a new order for textbooks, uniforms, and stationery from a
          selected vendor.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-6"
      >
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Order details</h2>

          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-slate-300">
              Vendor
            </label>
            <select
              value={selectedVendorId}
              onChange={(event) => setSelectedVendorId(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none focus:border-sky-500"
            >
              <option value="">
                {loadingVendors ? 'Loading vendors…' : 'Select a vendor'}
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-slate-300">
              Customer name
            </label>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="Parent / guardian"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-slate-300">
              Customer phone
            </label>
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="e.g. 0712 123 456"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-slate-300">
              Student name (optional)
            </label>
            <input
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-slate-300">
              School name (optional)
            </label>
            <input
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Summary
            </p>
            <p className="text-sm text-slate-200">
              Total: <span className="font-semibold">{totalAmount.toLocaleString('en-TZ')}</span>{' '}
              TZS
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-xs text-emerald-400">{success}</p>
          )}

          {createdOrderId && createdToken && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200">
              <p className="font-medium text-slate-50">Shareable order link</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Anyone with this link can view and pay for this order.
              </p>
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  className="text-sky-400 hover:text-sky-300"
                  href={`/orders/${createdOrderId}?token=${encodeURIComponent(createdToken)}`}
                >
                  View order summary
                </Link>
                <Link
                  className="text-emerald-400 hover:text-emerald-300"
                  href={`/orders/pay/${createdOrderId}?token=${encodeURIComponent(createdToken)}`}
                >
                  Pay with ClickPesa
                </Link>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loadingItems || loadingVendors}
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {submitting ? 'Creating order…' : 'Create order'}
          </button>
        </section>

        <section className="space-y-3 mt-6 md:mt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Items</h2>
            <span className="text-xs text-slate-400">
              {selectedVendorId
                ? loadingItems
                  ? 'Loading items…'
                  : `${items.length} items`
                : 'Choose a vendor first'}
            </span>
          </div>

          {!selectedVendorId && (
            <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-4 text-xs text-slate-300">
              Select a vendor on the left to see their inventory.
            </p>
          )}

          {selectedVendorId && !loadingItems && items.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-4 text-xs text-slate-300">
              This vendor has no inventory yet. Add rows in the
              <code className="mx-1 rounded bg-slate-800 px-1 py-0.5 text-[10px]">
                inventory
              </code>
              table in Supabase for this vendor.
            </p>
          )}

          {items.length > 0 && (
            <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1 text-sm">
              {items.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                const priceNumber =
                  typeof item.price_tzs === 'string'
                    ? Number.parseFloat(item.price_tzs)
                    : item.price_tzs;
                const lineTotal =
                  !Number.isNaN(priceNumber) && quantity > 0
                    ? priceNumber * quantity
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                  >
                    <div className="flex-1 w-full">
                      <p className="text-sm font-medium text-slate-100">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {priceNumber.toLocaleString('en-TZ')} TZS
                        {item.stock_quantity !== null && (
                          <span className="ml-2 text-slate-500">
                            · Stock: {item.stock_quantity}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <input
                        type="number"
                        min={0}
                        value={quantity}
                        onChange={(event) => {
                          const value = Number.parseInt(event.target.value, 10);
                          setQuantities((prev) => ({
                            ...prev,
                            [item.id]: Number.isNaN(value) || value < 0 ? 0 : value,
                          }));
                        }}
                        className="w-full md:w-20 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-base md:text-xs text-slate-50 outline-none focus:border-sky-500"
                      />
                      <div className="w-24 text-right text-[11px] text-slate-300">
                        {lineTotal > 0 && (
                          <span>{lineTotal.toLocaleString('en-TZ')} TZS</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </form>
    </main>
  );
}
