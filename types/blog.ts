export type BlogPost = {
  id: string;
  slug: string; // URL-friendly slug
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // in minutes
  featured?: boolean;
  status: "published" | "draft";
};
