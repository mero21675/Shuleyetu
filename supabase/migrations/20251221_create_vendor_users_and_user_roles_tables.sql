-- Create vendor_users table
create table public.vendor_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index vendor_users_user_id_vendor_id_idx on public.vendor_users(user_id, vendor_id);

-- Create user_roles table
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create index user_roles_user_id_idx on public.user_roles(user_id);
