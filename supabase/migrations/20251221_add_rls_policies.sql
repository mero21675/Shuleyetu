-- Enable RLS for vendors table
alter table public.vendors enable row level security;

-- Policies for vendors table
create policy "Vendors can view their own vendor"
  on public.vendors
  for select
  using (
    id in (select vendor_id from public.vendor_users where user_id = auth.uid())
  );

create policy "Admins can manage all vendors"
  on public.vendors
  for all
  using (
    exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

-- Enable RLS for inventory table
alter table public.inventory enable row level security;

create policy "Vendors can manage their own inventory"
  on public.inventory
  for all
  using (
    vendor_id in (select vendor_id from public.vendor_users where user_id = auth.uid())
  );

create policy "Admins can manage all inventory"
  on public.inventory
  for all
  using (
    exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

-- Enable RLS for orders table
alter table public.orders enable row level security;

create policy "Vendors can manage their own orders"
  on public.orders
  for all
  using (
    vendor_id in (select vendor_id from public.vendor_users where user_id = auth.uid())
  );

create policy "Admins can manage all orders"
  on public.orders
  for all
  using (
    exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

-- Enable RLS for order_items table (usually accessed via orders, but for safety)
alter table public.order_items enable row level security;

create policy "Vendors can manage their own order items"
  on public.order_items
  for all
  using (
    order_id in (select id from public.orders where vendor_id in (select vendor_id from public.vendor_users where user_id = auth.uid()))
  );

create policy "Admins can manage all order items"
  on public.order_items
  for all
  using (
    exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );
