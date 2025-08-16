-- Adds likes column to blogs table if not exists
alter table public.blogs
  add column if not exists likes bigint default 0;

create index if not exists blogs_likes_idx on public.blogs (likes desc);
