create or replace function public.get_user_emails_by_ids(p_user_ids uuid[])
returns table (user_id uuid, email text)
language sql
security definer
set search_path = public, auth
as $$
  select u.id as user_id, u.email
  from auth.users u
  where u.id = any(p_user_ids);
$$;

revoke all on function public.get_user_emails_by_ids(uuid[]) from public;
grant execute on function public.get_user_emails_by_ids(uuid[]) to service_role;
