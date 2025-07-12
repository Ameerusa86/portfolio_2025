export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  image_key: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at?: string;
  order?: number;
  tags?: string[];
  status?: string;
};
