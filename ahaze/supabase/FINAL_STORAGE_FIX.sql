-- TOTAL STORAGE RESET & INITIALIZATION
-- Run this in your Supabase SQL Editor to force-create all buckets and policies

-- 1. DROP EXISTING POLICIES (To avoid conflicts)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
    DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
    DROP POLICY IF EXISTS "Public Select" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
    DROP POLICY IF EXISTS "Posts Insert Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Posts Select Policy" ON storage.objects;
END $$;

-- 2. CREATE BUCKETS
-- This ensures the physical storage folders exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('posts', 'posts', true),
  ('products', 'products', true),
  ('orgs', 'orgs', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. APPLY UNIVERSAL POLICIES (Easiest & Most Robust)
-- Allow anyone to read any file (since we want a public app)
CREATE POLICY "Universal Public Select" 
ON storage.objects FOR SELECT 
USING (true);

-- Allow any logged-in user to upload to any bucket
CREATE POLICY "Universal Auth Insert" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to delete their own files
CREATE POLICY "Universal Owner Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (auth.uid() = owner);

-- 4. REFRESH
NOTIFY pgrst, 'reload schema';
