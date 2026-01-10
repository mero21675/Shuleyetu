-- Tanzanian school supply marketplace schema for Shuleyetu

-- Enums
create type public.item_category as enum (
  'textbook',
  'uniform',
  'stationery',
  'other'
);

create type public.order_status as enum (
  'pending',
  'awaiting_payment',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'failed'
);

create type public.payment_status as enum (
  'unpaid',
  'pending',
  'paid',
  'refunded',
  'failed'
);

-- Vendors (stationery shops)
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,

  phone_number text,
  email text,

  -- Tanzanian location fields
  region text,
  district text,
  ward text,
  street_address text,
  latitude numeric(9,6),
  longitude numeric(9,6),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Inventory (textbooks, uniforms, etc.)
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,

  name text not null,
  description text,
  sku text,

  category public.item_category not null default 'other',

  price_tzs numeric(12,2) not null,
  currency_code text not null default 'TZS',

  stock_quantity integer not null default 0,
  is_active boolean not null default true,

  metadata jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inventory_vendor_id_idx on public.inventory(vendor_id);

-- Orders (one per checkout)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id),

  -- Buyer info (parent/guardian)
  customer_name text,
  customer_phone text,

  -- School context (optional)
  student_name text,
  school_name text,

  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',

  total_amount_tzs numeric(12,2) not null,
  currency_code text not null default 'TZS',

  -- ClickPesa-related fields (no secrets)
  payment_provider text not null default 'clickpesa',
  payment_reference text,
  clickpesa_transaction_id text,
  clickpesa_raw_payload jsonb,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_vendor_id_idx on public.orders(vendor_id);
create index orders_created_at_idx on public.orders(created_at);

-- Order items (line items per order)
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  inventory_id uuid not null references public.inventory(id),

  quantity integer not null default 1,
  unit_price_tzs numeric(12,2) not null,

  total_price_tzs numeric(12,2)
    generated always as (quantity * unit_price_tzs) stored,

  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_inventory_id_idx on public.order_items(inventory_id);
