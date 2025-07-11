export type Project = {
  id: string; // UUID
  slug: string; // URL-friendly slug
  title: string;
  description: string;
  image: string; // URL or public path
  techStack: string[]; // ['Next.js', 'TypeScript', 'Tailwind CSS']
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean; // For homepage highlights
  published?: boolean; // Whether the project is published or draft
  createdAt: string; // ISO date string
  updatedAt?: string;
};
