-- Extra tables: comments, shares, carts, orders, order_items

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  post_id uuid references public.posts(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  post_id uuid references public.posts(id) on delete cascade,
  platform text,
  created_at timestamptz default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  total numeric,
  status text default 'pending',
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity int default 1,
  price numeric,
  created_at timestamptz default now()
);
