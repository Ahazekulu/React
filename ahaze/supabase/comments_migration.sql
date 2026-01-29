-- Create Comments Table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.connect_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies
create policy "Public comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can insert their own comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = user_id);

-- Add comment_count to connect_posts if not exists (optional, but good for performance)
-- We'll just count them dynamically for now to save complexity.

-- NOTIFY to reload schema
NOTIFY pgrst, 'reload schema';
