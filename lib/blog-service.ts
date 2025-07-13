import { BlogPost, CreateBlogData, UpdateBlogData } from "@/types/blog";

const API_BASE = "/api/blogs";

export class BlogService {
  // Fetch all blogs with optional filtering
  static async getBlogs(params?: {
    status?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<BlogPost[]> {
    const url = new URL(API_BASE, window.location.origin);

    if (params) {
      if (params.status) url.searchParams.set("status", params.status);
      if (params.featured) url.searchParams.set("featured", "true");
      if (params.limit) url.searchParams.set("limit", params.limit.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`);
    }

    return response.json();
  }

  // Fetch a single blog by slug
  static async getBlog(slug: string): Promise<BlogPost> {
    const response = await fetch(`${API_BASE}/${slug}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Blog not found");
      }
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    return response.json();
  }

  // Create a new blog
  static async createBlog(data: CreateBlogData): Promise<BlogPost> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create blog: ${response.statusText}`);
    }

    return response.json();
  }

  // Update an existing blog
  static async updateBlog(
    slug: string,
    data: UpdateBlogData
  ): Promise<BlogPost> {
    const response = await fetch(`${API_BASE}/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Blog not found");
      }
      throw new Error(`Failed to update blog: ${response.statusText}`);
    }

    return response.json();
  }

  // Delete a blog
  static async deleteBlog(slug: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete blog: ${response.statusText}`);
    }
  }

  // Bulk delete blogs
  static async deleteBlogs(slugs: string[]): Promise<void> {
    await Promise.all(slugs.map((slug) => this.deleteBlog(slug)));
  }

  // Get blog statistics
  static async getBlogStats() {
    const blogs = await this.getBlogs();

    return {
      total: blogs.length,
      published: blogs.filter((blog) => blog.status === "published").length,
      draft: blogs.filter((blog) => blog.status === "draft").length,
      featured: blogs.filter((blog) => blog.featured).length,
    };
  }
}
