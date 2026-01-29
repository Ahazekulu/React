-- SAFE FIX SCRIPT
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

-- 3. Fix Permissions
GRANT ALL ON public.connect_posts TO authenticated;
GRANT ALL ON public.comments TO authenticated;
-- Removed the sequence grant that was causing the error since UUIDs don't use sequences.

-- 4. Enable RLS but ensure policies exist
alter table public.connect_posts enable row level security;
alter table public.comments enable row level security;

-- cleanup old policies to avoid conflicts (wrapped in anonymous block to avoid errors if missing)
do $$ begin
    drop policy if exists "Public comments view" on public.comments;
    drop policy if exists "Auth comments insert" on public.comments;
    drop policy if exists "Auth comments delete" on public.comments;
exception when others then null; end $$;

create policy "Public comments view" on public.comments for select using (true);
create policy "Auth comments insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "Auth comments delete" on public.comments for delete using (auth.uid() = user_id);

-- 5. CRITICAL: NOTIFY RELOAD
NOTIFY pgrst, 'reload schema';
