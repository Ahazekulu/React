-- ahazeKulu Database Fix for Existing Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/uphdtxmreujnpatbyaoa/sql

-- ============================================
-- 1. FIX PROFILES TABLE
-- ============================================
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'first_name') THEN
        ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'father_name') THEN
        ALTER TABLE public.profiles ADD COLUMN father_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'grand_father_name') THEN
        ALTER TABLE public.profiles ADD COLUMN grand_father_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'mobile_number') THEN
        ALTER TABLE public.profiles ADD COLUMN mobile_number TEXT UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'gender') THEN
        ALTER TABLE public.profiles ADD COLUMN gender TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.profiles ADD COLUMN date_of_birth DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'region') THEN
        ALTER TABLE public.profiles ADD COLUMN region TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'zone') THEN
        ALTER TABLE public.profiles ADD COLUMN zone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'woreda') THEN
        ALTER TABLE public.profiles ADD COLUMN woreda TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'kebele') THEN
        ALTER TABLE public.profiles ADD COLUMN kebele TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'about_me') THEN
        ALTER TABLE public.profiles ADD COLUMN about_me TEXT;
    END IF;
END $$;

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create or replace trigger for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, mobile_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'mobile', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. FIX PRODUCTS TABLE
-- ============================================
-- Add missing columns to products table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'seller_id') THEN
        ALTER TABLE public.products ADD COLUMN seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'name') THEN
        ALTER TABLE public.products ADD COLUMN name TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'category') THEN
        ALTER TABLE public.products ADD COLUMN category TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'price') THEN
        ALTER TABLE public.products ADD COLUMN price NUMERIC NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'description') THEN
        ALTER TABLE public.products ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'image_urls') THEN
        ALTER TABLE public.products ADD COLUMN image_urls TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'products' 
                   AND column_name = 'status') THEN
        ALTER TABLE public.products ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create products" ON public.products;
CREATE POLICY "Authenticated users can create products" 
  ON public.products FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
CREATE POLICY "Users can update their own products" 
  ON public.products FOR UPDATE 
  USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Users can delete their own products" 
  ON public.products FOR DELETE 
  USING (auth.uid() = seller_id);

-- ============================================
-- 3. CREATE MISSING TABLES
-- ============================================

-- PLACES TABLE
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_1 TEXT DEFAULT 'Ethiopia',
  level_2 TEXT NOT NULL,
  level_3 TEXT,
  level_4 TEXT,
  level_5 TEXT,
  description TEXT,
  population_est INTEGER,
  economy_type TEXT,
  infrastructure_status TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Places are viewable by everyone" ON public.places;
CREATE POLICY "Places are viewable by everyone" ON public.places FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert places" ON public.places;
CREATE POLICY "Authenticated users can insert places" ON public.places FOR INSERT TO authenticated WITH CHECK (true);

-- CONNECT POSTS TABLE
CREATE TABLE IF NOT EXISTS public.connect_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  level_scope TEXT NOT NULL,
  location_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.connect_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.connect_posts;
CREATE POLICY "Posts are viewable by everyone" ON public.connect_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.connect_posts;
CREATE POLICY "Authenticated users can create posts" ON public.connect_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can update their own posts" ON public.connect_posts;
CREATE POLICY "Users can update their own posts" ON public.connect_posts FOR UPDATE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.connect_posts;
CREATE POLICY "Users can delete their own posts" ON public.connect_posts FOR DELETE USING (auth.uid() = author_id);

-- ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  type TEXT,
  ownership TEXT,
  address TEXT,
  region TEXT,
  zone TEXT,
  woreda TEXT,
  kebele TEXT,
  description TEXT,
  opening_hours TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Organizations are viewable by everyone" ON public.organizations;
CREATE POLICY "Organizations are viewable by everyone" ON public.organizations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;
CREATE POLICY "Authenticated users can create organizations" ON public.organizations FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Users can update their own organizations" ON public.organizations;
CREATE POLICY "Users can update their own organizations" ON public.organizations FOR UPDATE USING (auth.uid() = owner_id);

-- KNOWLEDGE ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  content TEXT NOT NULL,
  media_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON public.knowledge_articles;
CREATE POLICY "Articles are viewable by everyone" ON public.knowledge_articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.knowledge_articles;
CREATE POLICY "Authenticated users can create articles" ON public.knowledge_articles FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can update their own articles" ON public.knowledge_articles;
CREATE POLICY "Users can update their own articles" ON public.knowledge_articles FOR UPDATE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete their own articles" ON public.knowledge_articles;
CREATE POLICY "Users can delete their own articles" ON public.knowledge_articles FOR DELETE USING (auth.uid() = author_id);

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  region TEXT,
  zone TEXT,
  woreda TEXT,
  kebele TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

-- AGENTS TABLE
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  region TEXT,
  zone TEXT,
  woreda TEXT,
  kebele TEXT,
  contact_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agents are viewable by everyone" ON public.agents;
CREATE POLICY "Agents are viewable by everyone" ON public.agents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create agent profiles" ON public.agents;
CREATE POLICY "Authenticated users can create agent profiles" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can update their own agent profiles" ON public.agents;
CREATE POLICY "Users can update their own agent profiles" ON public.agents FOR UPDATE USING (auth.uid() = profile_id);

-- ============================================
-- REFRESH SCHEMA CACHE
-- ============================================
NOTIFY pgrst, 'reload schema';
