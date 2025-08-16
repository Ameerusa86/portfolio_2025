-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    read_time INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON public.blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON public.blogs
    FOR SELECT USING (true);

-- Create policies for authenticated users to manage blogs
CREATE POLICY "Enable all access for authenticated users" ON public.blogs
    FOR ALL USING (auth.role() = 'authenticated');

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();