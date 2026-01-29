-- Final RLS & Foreign Key Fix for ahazeKulu
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. ROBUST PROFILE AUTO-CREATION
-- ============================================

-- Function to ensure profile exists for any table
-- It checks if the record's user ID column (passed as argument) exists in profiles
CREATE OR REPLACE FUNCTION public.maybe_create_profile()
RETURNS TRIGGER AS $$
DECLARE
    uid UUID;
BEGIN
    -- Determine which column to use based on the table
    CASE TG_TABLE_NAME
        WHEN 'connect_posts' THEN uid := NEW.author_id;
        WHEN 'products' THEN uid := NEW.seller_id;
        WHEN 'organizations' THEN uid := NEW.owner_id;
        WHEN 'knowledge_articles' THEN uid := NEW.author_id;
        WHEN 'events' THEN uid := NEW.organizer_id;
        WHEN 'agents' THEN uid := NEW.profile_id;
        ELSE uid := NULL;
    END CASE;

    -- If we have a UID, ensure it's in profiles
    IF uid IS NOT NULL THEN
        INSERT INTO public.profiles (id)
        VALUES (uid)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to all relevant tables
DROP TRIGGER IF EXISTS tr_ensure_profile_posts ON public.connect_posts;
CREATE TRIGGER tr_ensure_profile_posts BEFORE INSERT ON public.connect_posts FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();

DROP TRIGGER IF EXISTS tr_ensure_profile_products ON public.products;
CREATE TRIGGER tr_ensure_profile_products BEFORE INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();

DROP TRIGGER IF EXISTS tr_ensure_profile_orgs ON public.organizations;
CREATE TRIGGER tr_ensure_profile_orgs BEFORE INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();

DROP TRIGGER IF EXISTS tr_ensure_profile_knowledge ON public.knowledge_articles;
CREATE TRIGGER tr_ensure_profile_knowledge BEFORE INSERT ON public.knowledge_articles FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();

DROP TRIGGER IF EXISTS tr_ensure_profile_events ON public.events;
CREATE TRIGGER tr_ensure_profile_events BEFORE INSERT ON public.events FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();

DROP TRIGGER IF EXISTS tr_ensure_profile_agents ON public.agents;
CREATE TRIGGER tr_ensure_profile_agents BEFORE INSERT ON public.agents FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();

-- ============================================
-- 2. RELAX PROFILES RLS
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON public.profiles;
CREATE POLICY "Authenticated users can insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id OR true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============================================
-- 3. ENSURE ALL TABLES EXIST WITH CORRECT COLUMNS
-- ============================================

-- Profiles Table with all required fields
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    father_name TEXT,
    grand_father_name TEXT,
    mobile_number TEXT,
    email TEXT,
    gender TEXT,
    region TEXT,
    zone TEXT,
    woreda TEXT,
    kebele TEXT,
    mender TEXT,
    building TEXT,
    security_question TEXT,
    security_hint TEXT,
    suggestion TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC NOT NULL,
    description TEXT,
    image_urls TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure Connect Posts Table exists
CREATE TABLE IF NOT EXISTS public.connect_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[],
    level_scope TEXT,
    location_name TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. REFRESH
-- ============================================
NOTIFY pgrst, 'reload schema';
