ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_blogs_views ON public.blogs(views DESC);
