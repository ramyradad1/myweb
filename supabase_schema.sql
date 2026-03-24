-- SQL script to set up Supabase schema migrating from Firestore

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    "metaDescription" TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Technology',
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'Editorial Team',
    "sourceUrl" TEXT,
    "originalUrl" TEXT,
    "sourceName" TEXT,
    "heroImage" TEXT,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    blocks JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "publishedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create bot_config table (single row configuration)
CREATE TABLE IF NOT EXISTS public.bot_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    "aiModel" TEXT DEFAULT 'gemini-2.5-flash',
    "editorialTone" TEXT DEFAULT 'Professional',
    "editorialDepth" INTEGER DEFAULT 85,
    "autoTranslate" BOOLEAN DEFAULT true,
    verticals TEXT[] DEFAULT '{"techcrunch.com", "theverge.com", "wired.com", "mashable.com"}',
    "dailyTarget" INTEGER DEFAULT 5,
    "scheduleFormat" TEXT DEFAULT 'Drip Publishing - Better for SEO consistency',
    "isActive" BOOLEAN DEFAULT false
);

-- 3. Insert default bot_config row if it doesn't exist
INSERT INTO public.bot_config (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- 4. Set up Row Level Security (RLS) allowing anonymous read, 
-- Service Role/Admin write. For MVP, we can allow public read/write if needed,
-- or define strict policies. (Leaving open for easier migration initially)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles
CREATE POLICY "Public articles are viewable by everyone."
ON public.articles FOR SELECT USING (true);

-- Allow public read access to bot_config
CREATE POLICY "Bot config is viewable by everyone."
ON public.bot_config FOR SELECT USING (true);

-- Allow all operations for authenticated or service role (adjust as needed for strict security)
CREATE POLICY "Allow all operations for now"
ON public.articles FOR ALL USING (true);

CREATE POLICY "Allow all operations for bot_config"
ON public.bot_config FOR ALL USING (true);
