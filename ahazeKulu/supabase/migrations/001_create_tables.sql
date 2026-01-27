-- Supabase SQL migration: create core tables for ahazePlaces

create extension if not exists "pgcrypto";

-- places table
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

-- posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  place_id uuid references public.places(id) on delete cascade,
  content text,
  media_urls text[],
  created_at timestamptz default now()
);

-- products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  place_id uuid references public.places(id) on delete cascade,
  title text,
  description text,
  price numeric,
  currency text default 'USD',
  media_urls text[],
  available boolean default true,
  created_at timestamptz default now()
);

-- reactions table (for posts)
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  post_id uuid references public.posts(id) on delete cascade,
  type text,
  created_at timestamptz default now()
);
