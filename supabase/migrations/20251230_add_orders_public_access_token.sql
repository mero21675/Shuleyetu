alter table public.orders
  add column if not exists public_access_token uuid;

update public.orders
set public_access_token = gen_random_uuid()
where public_access_token is null;

alter table public.orders
  alter column public_access_token set default gen_random_uuid();

alter table public.orders
  alter column public_access_token set not null;

create unique index if not exists orders_public_access_token_idx
  on public.orders(public_access_token);
