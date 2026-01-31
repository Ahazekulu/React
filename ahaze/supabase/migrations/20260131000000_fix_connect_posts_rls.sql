-- Fix RLS Policies for connect_posts table
-- This migration adds proper Row Level Security policies for posting

-- 1. Enable RLS on connect_posts
ALTER TABLE public.connect_posts ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS Policies for connect_posts
DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can view posts" ON public.connect_posts;
    CREATE POLICY "Anyone can view posts" ON public.connect_posts FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Authenticated users can insert posts" ON public.connect_posts;
    CREATE POLICY "Authenticated users can insert posts" ON public.connect_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
    
    DROP POLICY IF EXISTS "Users can update own posts" ON public.connect_posts;
    CREATE POLICY "Users can update own posts" ON public.connect_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);
    
    DROP POLICY IF EXISTS "Users can delete own posts" ON public.connect_posts;
    CREATE POLICY "Users can delete own posts" ON public.connect_posts FOR DELETE TO authenticated USING (auth.uid() = author_id);
EXCEPTION WHEN others THEN NULL; END $$;

-- 3. Add missing columns that might be referenced in the app
DO $$ BEGIN
    ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS media_thumbnails TEXT[];
    ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'text';
    ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
    ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS saves_count INTEGER DEFAULT 0;
    ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
EXCEPTION WHEN others THEN NULL; END $$;

-- 4. Create likes table for posts
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES connect_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- 5. Enable RLS on post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for post_likes
DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
    CREATE POLICY "Anyone can view likes" ON public.post_likes FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can manage own likes" ON public.post_likes;
    CREATE POLICY "Users can manage own likes" ON public.post_likes FOR ALL TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL; END $$;

-- 7. Reload schema cache
NOTIFY pgrst, 'reload schema';
