export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  tags: string[];
  author: string;
  published_at?: string;
  updated_at: string;
  created_at: string;
  read_time: number;
  featured: boolean;
  status: "published" | "draft";
}

export interface BlogFormData {
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  status: "published" | "draft";
}

export interface CreateBlogData {
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  status: "published" | "draft";
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  // id is handled in the API route, not needed in the update data
}
