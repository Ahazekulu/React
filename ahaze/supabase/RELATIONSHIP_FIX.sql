-- FIX RELATIONSHIPS FOR SUPABASE JOINS
-- The frontend is trying to join 'comments' with 'profiles' (aliased as author).
-- This requires a Foreign Key from comments.user_id -> public.profiles.id.
-- Currently, it likely points to auth.users, which prevents the automatic join with profiles.

DO $$ 
BEGIN
  -- 1. Drop existing FK to auth.users if it exists (guessing naming convention or just blindly replacing)
  -- We try to alter the constraint.
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'comments_user_id_fkey' AND table_name = 'comments') THEN
    ALTER TABLE public.comments DROP CONSTRAINT comments_user_id_fkey;
  END IF;

  -- 2. Add FK to public.profiles
  ALTER TABLE public.comments
    ADD CONSTRAINT comments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
    
EXCEPTION WHEN OTHERS THEN
  -- Assuming profiles might not exist or constraint name differs. 
  -- We try a brute force add if drop failed or whatever.
  NULL;
END $$;

-- Just in case the above block was skipped or error trapped:
-- Ensure the column exists and references profiles.
-- The safest "fix all" is often:
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE public.comments 
  ADD CONSTRAINT comments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';
