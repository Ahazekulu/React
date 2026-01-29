-- Initial Schema for ahazeKulu

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  father_name TEXT,
  grand_father_name TEXT,
  mobile_number TEXT UNIQUE,
  gender TEXT,
  date_of_birth DATE,
  region TEXT,
  zone TEXT,
  woreda TEXT,
  kebele TEXT,
  avatar_url TEXT,
  about_me TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Places Table (for rich information about locations)
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_1 TEXT DEFAULT 'Ethiopia',
  level_2 TEXT NOT NULL, -- Region
  level_3 TEXT, -- Zone
  level_4 TEXT, -- Woreda
  level_5 TEXT, -- Kebele/Town
  description TEXT,
  population_est INTEGER,
  economy_type TEXT,
  infrastructure_status TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Connect Posts (Social feed)
CREATE TABLE IF NOT EXISTS connect_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  level_scope TEXT NOT NULL, -- 'country', 'region', 'zone', 'woreda', 'kebele'
  location_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Market Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  description TEXT,
  image_urls TEXT[],
  status TEXT DEFAULT 'active', -- 'active', 'sold', 'hidden'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  type TEXT, -- 'Government', 'Private', 'Religious', etc.
  ownership TEXT, -- 'Individual', 'Share Company', etc.
  address TEXT, -- physical address
  region TEXT,
  zone TEXT,
  woreda TEXT,
  kebele TEXT,
  description TEXT,
  opening_hours TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Knowledge Articles
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  content TEXT NOT NULL,
  media_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
