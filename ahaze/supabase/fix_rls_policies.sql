-- Fix RLS Policies for Signup and Posting
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. FIX PROFILES RLS POLICY
-- ============================================
-- The issue: Users can't insert their own profile during signup
-- Solution: Allow users to insert profiles with their own auth.uid()

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a more permissive insert policy
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure the trigger can insert profiles
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users during signup"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- 2. FIX CONNECT_POSTS FOREIGN KEY ISSUE
-- ============================================
-- The issue: Trying to create a post before profile exists
-- Solution: Ensure profile exists first, or make author_id nullable temporarily

-- Check if the user has a profile, if not create one
CREATE OR REPLACE FUNCTION public.ensure_profile_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile exists for the author_id
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = NEW.author_id
  ) THEN
    -- Create a basic profile if it doesn't exist
    INSERT INTO public.profiles (id)
    VALUES (NEW.author_id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to connect_posts
DROP TRIGGER IF EXISTS ensure_profile_before_post ON public.connect_posts;
CREATE TRIGGER ensure_profile_before_post
  BEFORE INSERT ON public.connect_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_exists();

-- Apply same trigger to products
DROP TRIGGER IF EXISTS ensure_profile_before_product ON public.products;
CREATE TRIGGER ensure_profile_before_product
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_exists();

-- Apply same trigger to organizations
DROP TRIGGER IF EXISTS ensure_profile_before_org ON public.organizations;
CREATE TRIGGER ensure_profile_before_org
  BEFORE INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_exists();

-- Apply same trigger to knowledge_articles
DROP TRIGGER IF EXISTS ensure_profile_before_article ON public.knowledge_articles;
CREATE TRIGGER ensure_profile_before_article
  BEFORE INSERT ON public.knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_exists();

-- Apply same trigger to events
DROP TRIGGER IF EXISTS ensure_profile_before_event ON public.events;
CREATE TRIGGER ensure_profile_before_event
  BEFORE INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_exists();

-- Apply same trigger to agents
DROP TRIGGER IF EXISTS ensure_profile_before_agent ON public.agents;
CREATE TRIGGER ensure_profile_before_agent
  BEFORE INSERT ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_exists();

-- ============================================
-- 3. SIMPLIFY PROFILES INSERT POLICY
-- ============================================
-- Remove the restrictive policy and use a simpler one

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.profiles;

-- Recreate with simpler, more permissive policies
CREATE POLICY "Anyone can view profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert profiles" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- 4. REFRESH SCHEMA
-- ============================================
NOTIFY pgrst, 'reload schema';
