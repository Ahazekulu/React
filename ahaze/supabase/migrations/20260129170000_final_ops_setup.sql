-- Consolidated Final Migration for ahazeKulu
-- Covers schema fixes, storage setup, and profile auto-creation

-- 1. FUNCTIONS & TRIGGERS (Auto-Profile Creation)
CREATE OR REPLACE FUNCTION public.maybe_create_profile()
RETURNS TRIGGER AS $$
DECLARE
    uid UUID;
BEGIN
    CASE TG_TABLE_NAME
        WHEN 'connect_posts' THEN uid := NEW.author_id;
        WHEN 'products' THEN uid := NEW.seller_id;
        WHEN 'organizations' THEN uid := NEW.owner_id;
        WHEN 'knowledge_articles' THEN uid := NEW.author_id;
        WHEN 'events' THEN uid := NEW.organizer_id;
        WHEN 'agents' THEN uid := NEW.profile_id;
        ELSE uid := NULL;
    END CASE;

    IF uid IS NOT NULL THEN
        INSERT INTO public.profiles (id)
        VALUES (uid)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply Triggers
DO $$ BEGIN
    CREATE TRIGGER tr_ensure_profile_posts BEFORE INSERT ON public.connect_posts FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER tr_ensure_profile_products BEFORE INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER tr_ensure_profile_orgs BEFORE INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.maybe_create_profile();
EXCEPTION WHEN others THEN NULL; END $$;

-- 2. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('posts', 'posts', true),
  ('orgs', 'orgs', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. STORAGE POLICIES
DO $$ BEGIN
    CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING (true);
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN others THEN NULL; END $$;

-- 4. PROFILE RLS FIXES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
    CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Authenticated insert profiles" ON public.profiles;
    CREATE POLICY "Authenticated insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id OR true);
    
    DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
    CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
EXCEPTION WHEN others THEN NULL; END $$;

-- 5. RELOAD
NOTIFY pgrst, 'reload schema';
