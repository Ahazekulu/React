-- Fix for missing 'media_type' column in 'connect_posts'
ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'text';

-- While we are at it, ensure comments table exists as well (re-iterating just in case)
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.connect_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies for comments
alter table public.comments enable row level security;
do $$ begin
    create policy "Public comments view" on public.comments for select using (true);
    create policy "Auth comments insert" on public.comments for insert with check (auth.uid() = user_id);
    create policy "Auth comments delete" on public.comments for delete using (auth.uid() = user_id);
exception when others then null; end $$;

-- Reload Schema
NOTIFY pgrst, 'reload schema';
