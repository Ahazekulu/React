-- LIKE SYSTEM MIGRATION
-- 1. Create Likes Table
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.connect_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id) -- Ensure one like per user per post
);

-- 2. Enable RLS
alter table public.likes enable row level security;

-- 3. Policies
create policy "Public likes view" on public.likes for select using (true);
create policy "Auth likes insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "Auth likes delete" on public.likes for delete using (auth.uid() = user_id);

-- 4. Reload Schema
NOTIFY pgrst, 'reload schema';
