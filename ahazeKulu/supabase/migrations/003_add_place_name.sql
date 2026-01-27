-- Add place_name column to posts and products so we can query by place path
alter table if exists public.posts
  add column if not exists place_name text;

alter table if exists public.products
  add column if not exists place_name text;
