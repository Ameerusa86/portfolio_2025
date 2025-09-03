-- 006_create_technologies_table.sql
-- Creates a canonical technologies table and inserts a few seeds.

CREATE TABLE IF NOT EXISTS public.technologies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: seed some common technologies (safe to re-run)
INSERT INTO public.technologies (name)
SELECT v FROM (VALUES
  ('React'),
  ('Next.js'),
  ('TypeScript'),
  ('Node.js'),
  ('Supabase'),
  ('Postgres'),
  ('Tailwind CSS')
) AS t(v)
ON CONFLICT (name) DO NOTHING;
