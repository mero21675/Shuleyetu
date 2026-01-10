-- Auth + RLS for Shuleyetu (open ordering: parents don't log in)

-- Map Supabase auth users to vendors
create table if not exists public.vendor_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vendor_id)
);

create index if not exists vendor_users_user_id_idx on public.vendor_users(user_id);
create index if not exists vendor_users_vendor_id_idx on public.vendor_users(vendor_id);

-- Enable RLS on core tables
alter table public.vendors enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.vendor_users enable row level security;

-- VENDORS -----------------------------------------------------------------

-- Anyone (anon or authenticated) can list vendors
create policy if not exists "Public select vendors" on public.vendors
  for select
  using (true);

-- Authenticated vendors can manage their own vendor row
create policy if not exists "Vendor manage own vendor" on public.vendors
  for all
  to authenticated
  using (
    exists (
      select 1 from public.vendor_users vu
      where vu.vendor_id = vendors.id
        and vu.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.vendor_users vu
      where vu.vendor_id = vendors.id
        and vu.user_id = auth.uid()
    )
  );

-- VENDOR_USERS -------------------------------------------------------------

-- A user can only see their own vendor mappings
create policy if not exists "Vendor users see own rows" on public.vendor_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- Allow inserts for admins only (adjust as needed manually in dashboard)
-- For now we do NOT allow anonymous or normal users to insert here via RLS.

-- INVENTORY ----------------------------------------------------------------

-- Anyone can view inventory (for open catalog browsing)
create policy if not exists "Public select inventory" on public.inventory
  for select
  using (true);

-- Authenticated vendors can manage inventory for their vendor
create policy if not exists "Vendor manage own inventory" on public.inventory
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.vendor_users vu
      where vu.vendor_id = inventory.vendor_id
        and vu.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.vendor_users vu
      where vu.vendor_id = inventory.vendor_id
        and vu.user_id = auth.uid()
    )
  );

-- ORDERS -------------------------------------------------------------------

-- Parents (anon) can create orders
create policy if not exists "Public insert orders" on public.orders
  for insert
  with check (true);

-- Vendors can see and update only their own orders
create policy if not exists "Vendors select own orders" on public.orders
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.vendor_users vu
      where vu.vendor_id = orders.vendor_id
        and vu.user_id = auth.uid()
    )
  );

create policy if not exists "Vendors update own orders" on public.orders
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.vendor_users vu
      where vu.vendor_id = orders.vendor_id
        and vu.user_id = auth.uid()
    )
  );

-- For now we do not expose delete via RLS.

-- ORDER ITEMS --------------------------------------------------------------

-- Parents (anon) can create order items attached to any existing order
create policy if not exists "Public insert order_items" on public.order_items
  for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
    )
  );

-- Vendors can read order_items for their own orders
create policy if not exists "Vendors select own order_items" on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
        join public.vendor_users vu on vu.vendor_id = o.vendor_id
      where o.id = order_items.order_id
        and vu.user_id = auth.uid()
    )
  );

-- Vendors can update their own order_items if needed
create policy if not exists "Vendors update own order_items" on public.order_items
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
        join public.vendor_users vu on vu.vendor_id = o.vendor_id
      where o.id = order_items.order_id
        and vu.user_id = auth.uid()
    )
  );
