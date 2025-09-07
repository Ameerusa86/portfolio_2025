-- Migration: Create about table if it doesn't exist
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS about (
  id TEXT PRIMARY KEY DEFAULT 'about-1',
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  story_title TEXT NOT NULL,
  story_content TEXT[] NOT NULL DEFAULT '{}',
  skills_title TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  cta_title TEXT NOT NULL,
  cta_description TEXT NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_about_updated_at ON about;
CREATE TRIGGER update_about_updated_at 
  BEFORE UPDATE ON about 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default data (only if table is empty)
INSERT INTO about (
  id,
  title,
  subtitle,
  hero_description,
  story_title,
  story_content,
  skills_title,
  skills,
  cta_title,
  cta_description
) 
SELECT 
  'about-1',
  'About Me',
  'Full-stack developer passionate about creating exceptional digital experiences that make a difference',
  'Full-stack developer passionate about creating exceptional digital experiences that make a difference',
  'My Story',
  ARRAY[
    'I''m a passionate full-stack developer with experience in modern web technologies. I love building applications that solve real-world problems and provide great user experiences.',
    'When I''m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community.'
  ],
  'Skills & Technologies',
  ARRAY[
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'PostgreSQL',
    'Tailwind CSS',
    'Python'
  ],
  'Let''s Work Together',
  'I''m always interested in new opportunities and exciting projects.'
WHERE NOT EXISTS (SELECT 1 FROM about);

-- Enable Row Level Security (RLS)
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read about data" ON about;
DROP POLICY IF EXISTS "Authenticated users can modify about data" ON about;

-- Create policy for public read access
CREATE POLICY "Public can read about data" ON about
  FOR SELECT USING (true);

-- Create policy for authenticated users to modify (adjust based on your auth setup)
CREATE POLICY "Authenticated users can modify about data" ON about
  FOR ALL USING (true);
