-- Creates or replaces a SQL function to atomically increment blog likes
create or replace function public.increment_blog_likes(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes bigint;
begin
  update public.blogs
    set likes = coalesce(likes,0) + 1,
        updated_at = now()
    where slug = p_slug
    returning likes into new_likes;

  if not found then
    raise exception 'BLOG_NOT_FOUND';
  end if;

  return new_likes;
end;
$$;

grant execute on function public.increment_blog_likes(text) to anon, authenticated;
