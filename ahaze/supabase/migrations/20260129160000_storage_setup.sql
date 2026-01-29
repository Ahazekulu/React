-- Migration: Storage Setup
-- Handles bucket creation and RLS policies for storage objects

-- 1. Create the buckets (using SQL as a fallback, though CLI/Console is usually preferred)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('posts', 'posts', true),
  ('orgs', 'orgs', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Set up Storage Policies (RLS for Storage)
-- Note: We use bucket_id in the policy to target specific folders/buckets

-- PRODUCTS BUCKET
DO $$ BEGIN
    CREATE POLICY "Products Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'products');
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Products Auth Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');
EXCEPTION WHEN others THEN NULL; END $$;

-- POSTS BUCKET
DO $$ BEGIN
    CREATE POLICY "Posts Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Posts Auth Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'posts');
EXCEPTION WHEN others THEN NULL; END $$;

-- ORGS BUCKET
DO $$ BEGIN
    CREATE POLICY "Orgs Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'orgs');
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Orgs Auth Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'orgs');
EXCEPTION WHEN others THEN NULL; END $$;

-- AVATARS BUCKET
DO $$ BEGIN
    CREATE POLICY "Avatars Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Avatars Auth Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Avatars User Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid() = owner);
EXCEPTION WHEN others THEN NULL; END $$;
