-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO INITIALIZE STORAGE BUCKETS

-- 1. Create the buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('posts', 'posts', true),
  ('orgs', 'orgs', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up Storage Policies (RLS for Storage)
-- This allows anyone to view (since public=true), but only authenticated users can upload

-- Products Bucket Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Owner Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.uid() = owner);

-- Posts Bucket Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
CREATE POLICY "Owner Delete" ON storage.objects FOR DELETE USING (bucket_id = 'posts' AND auth.uid() = owner);

-- Orgs Bucket Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'orgs');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'orgs' AND auth.role() = 'authenticated');

-- Avatars Bucket Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Owner Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
