-- Sync all tables and columns for ahazeKulu
-- Run this in Supabase SQL Editor or use 'supabase db push'

-- 1. PROFILES (Ensure all fields exist)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grand_father_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS building TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS security_question TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS security_hint TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suggestion TEXT;

-- 2. ORGANIZATIONS (Fix reported missing columns)
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS address_region TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS address_zone TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS address_woreda TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS address_kebele TEXT;

-- 3. CONNECT POSTS (Social feed enhancements)
ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- 4. PRODUCTS (Market enhancements)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT false;

-- 5. NEW TABLE: EVENTS (For Places > Events Tab)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE,
    event_time TIME,
    location_name TEXT, -- The name of the place it belongs to
    media_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NEW TABLE: AGENTS (For Places > Agents Tab)
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    specialty TEXT, -- 'Tax Help', 'Legal', 'Market Guide'
    location_name TEXT,
    rating NUMERIC DEFAULT 5.0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES (Minimum viable for all tables)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access Agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Agents" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Orgs" ON public.organizations;
CREATE POLICY "Public Read Orgs" ON public.organizations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth Insert Orgs" ON public.organizations;
CREATE POLICY "Auth Insert Orgs" ON public.organizations FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = creator_id::text);

-- 8. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
