-- ULTIMATE REPAIR SCRIPT FOR AHAZEKULU
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/uphdtxmreujnpatbyaoa/sql

-- ============================================
-- 1. CONSOLIDATED STORAGE SETUP
-- ============================================
-- We use ONE bucket 'ahaze-media' to fit within Supabase Free Tier (3 bucket limit)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ahaze-media', 'ahaze-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Universal Storage Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
    CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'ahaze-media');

    DROP POLICY IF EXISTS "Auth Upload Access" ON storage.objects;
    CREATE POLICY "Auth Upload Access" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ahaze-media');

    DROP POLICY IF EXISTS "Owner Delete Access" ON storage.objects;
    CREATE POLICY "Owner Delete Access" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ahaze-media' AND auth.uid() = owner);
EXCEPTION WHEN others THEN NULL; END $$;

-- ============================================
-- 2. PLACES TABLE SCHEMA FIX
-- ============================================
-- Adding 'name' column as requested by the UI components
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS name TEXT;

-- Migration: if level_5 exists (Kebele), use it as the name. Otherwise use level_4 (Woreda), etc.
UPDATE public.places 
SET name = COALESCE(level_5, level_4, level_3, level_2)
WHERE name IS NULL;

-- ============================================
-- 3. PROFILES FIELD FIX
-- ============================================
-- Ensure all identity fields exist for the profile edit form
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grand_father_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS building TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS security_question TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS security_hint TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suggestion TEXT;

-- ============================================
-- 4. RELOAD SCHEMA
-- ============================================
NOTIFY pgrst, 'reload schema';
