-- FORCE REFRESH SCHEMA CACHE AND FIX
-- Run this ENTIRE block in the Supabase SQL Editor

-- 1. Ensure columns exist (Idempotent)
ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'text';
ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';

-- 2. Ensure Comments Table Exists
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.connect_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Fix Permissions (Grant to Authenticated Users)
GRANT ALL ON public.connect_posts TO authenticated;
GRANT ALL ON public.comments TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.connect_posts_id_seq TO authenticated; -- if exists (usually uuid though)

-- 4. Enable RLS but ensure policies exist
alter table public.connect_posts enable row level security;
alter table public.comments enable row level security;

-- cleanup old policies to avoid conflicts
drop policy if exists "Public comments view" on public.comments;
drop policy if exists "Auth comments insert" on public.comments;
drop policy if exists "Auth comments delete" on public.comments;

create policy "Public comments view" on public.comments for select using (true);
create policy "Auth comments insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "Auth comments delete" on public.comments for delete using (auth.uid() = user_id);

-- 5. CRITICAL: NOTIFY RELOAD
NOTIFY pgrst, 'reload schema';
