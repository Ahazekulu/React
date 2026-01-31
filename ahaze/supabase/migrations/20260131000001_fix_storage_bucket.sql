-- Fix storage bucket issue - create ahaze-media bucket
-- This migration creates the missing storage bucket referenced in the uploadMedia function

-- 1. Create the ahaze-media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('ahaze-media', 'ahaze-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Create storage policies for ahaze-media bucket
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Select ahaze-media" ON storage.objects;
    CREATE POLICY "Public Select ahaze-media" ON storage.objects FOR SELECT USING (bucket_id = 'ahaze-media');
    
    DROP POLICY IF EXISTS "Authenticated Insert ahaze-media" ON storage.objects;
    CREATE POLICY "Authenticated Insert ahaze-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ahaze-media' AND auth.role() = 'authenticated');
    
    DROP POLICY IF EXISTS "Authenticated Update ahaze-media" ON storage.objects;
    CREATE POLICY "Authenticated Update ahaze-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ahaze-media' AND auth.role() = 'authenticated');
    
    DROP POLICY IF EXISTS "Authenticated Delete ahaze-media" ON storage.objects;
    CREATE POLICY "Authenticated Delete ahaze-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ahaze-media' AND auth.role() = 'authenticated');
EXCEPTION WHEN others THEN NULL; END $$;

-- 3. Reload schema cache
NOTIFY pgrst, 'reload schema';
