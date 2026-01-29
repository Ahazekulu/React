-- ahazeKulu Complete Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/uphdtxmreujnpatbyaoa/sql

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  father_name TEXT,
  grand_father_name TEXT,
  mobile_number TEXT UNIQUE,
  gender TEXT,
  date_of_birth DATE,
  region TEXT,
  zone TEXT,
  woreda TEXT,
  kebele TEXT,
  avatar_url TEXT,
  about_me TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, mobile_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'mobile', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. PLACES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_1 TEXT DEFAULT 'Ethiopia',
  level_2 TEXT NOT NULL, -- Region
  level_3 TEXT, -- Zone
  level_4 TEXT, -- Woreda
  level_5 TEXT, -- Kebele/Town
  description TEXT,
  population_est INTEGER,
  economy_type TEXT,
  infrastructure_status TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Places are viewable by everyone" 
  ON public.places FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert places" 
  ON public.places FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- ============================================
-- 3. CONNECT POSTS (Social Feed)
-- ============================================
CREATE TABLE IF NOT EXISTS public.connect_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  level_scope TEXT NOT NULL, -- 'country', 'region', 'zone', 'woreda', 'kebele'
  location_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.connect_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" 
  ON public.connect_posts FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON public.connect_posts FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" 
  ON public.connect_posts FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.connect_posts FOR DELETE 
  USING (auth.uid() = author_id);

-- ============================================
-- 4. PRODUCTS (Market)
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  description TEXT,
  image_urls TEXT[],
  status TEXT DEFAULT 'active', -- 'active', 'sold', 'hidden'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create products" 
  ON public.products FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products" 
  ON public.products FOR UPDATE 
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products" 
  ON public.products FOR DELETE 
  USING (auth.uid() = seller_id);

-- ============================================
-- 5. ORGANIZATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  type TEXT, -- 'Government', 'Private', 'Religious', etc.
  ownership TEXT, -- 'Individual', 'Share Company', etc.
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

CREATE POLICY "Organizations are viewable by everyone" 
  ON public.organizations FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create organizations" 
  ON public.organizations FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own organizations" 
  ON public.organizations FOR UPDATE 
  USING (auth.uid() = owner_id);

-- ============================================
-- 6. KNOWLEDGE ARTICLES
-- ============================================
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

CREATE POLICY "Articles are viewable by everyone" 
  ON public.knowledge_articles FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create articles" 
  ON public.knowledge_articles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own articles" 
  ON public.knowledge_articles FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own articles" 
  ON public.knowledge_articles FOR DELETE 
  USING (auth.uid() = author_id);

-- ============================================
-- 7. EVENTS
-- ============================================
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

CREATE POLICY "Events are viewable by everyone" 
  ON public.events FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create events" 
  ON public.events FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events" 
  ON public.events FOR UPDATE 
  USING (auth.uid() = organizer_id);

-- ============================================
-- 8. AGENTS
-- ============================================
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

CREATE POLICY "Agents are viewable by everyone" 
  ON public.agents FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create agent profiles" 
  ON public.agents FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own agent profiles" 
  ON public.agents FOR UPDATE 
  USING (auth.uid() = profile_id);

-- ============================================
-- REFRESH SCHEMA CACHE
-- ============================================
NOTIFY pgrst, 'reload schema';
