-- Creates or replaces a SQL function to atomically increment blog views
-- Safe to run multiple times (CREATE OR REPLACE)

create or replace function public.increment_blog_views(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views bigint;
begin
  update public.blogs
    set views = coalesce(views,0) + 1,
        updated_at = now()
    where slug = p_slug
    returning views into new_views;

  if not found then
    raise exception 'BLOG_NOT_FOUND';
  end if;

  return new_views;
end;
$$;

-- Allow anon & authenticated to execute the function (so client-side call possible if desired)
grant execute on function public.increment_blog_views(text) to anon, authenticated;
