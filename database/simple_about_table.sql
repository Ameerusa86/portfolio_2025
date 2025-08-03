-- Create the about table
CREATE TABLE about (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Insert default data
INSERT INTO about (
  title,
  subtitle,
  hero_description,
  story_title,
  story_content,
  skills_title,
  skills,
  cta_title,
  cta_description
) VALUES (
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
);

-- Enable Row Level Security
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read about data" ON about
  FOR SELECT USING (true);

-- Allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations on about" ON about
  FOR ALL USING (true);
