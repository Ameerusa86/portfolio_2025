import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { BlogPost, CreateBlogData } from "@/types/blog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET /api/blogs - Fetch all blogs
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const featured = url.searchParams.get("featured");
    const limit = url.searchParams.get("limit");

    let query = supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: blogs, error } = await query;

    if (error) {
      console.error("Error fetching blogs:", error);
      return NextResponse.json(
        { error: "Failed to fetch blogs" },
        { status: 500 }
      );
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error in GET /api/blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body: CreateBlogData = await request.json();

    // Generate slug from title
    let slug = generateSlug(body.title);

    // Check if slug already exists and make it unique
    const { data: existingBlogs } = await supabase
      .from("blogs")
      .select("slug")
      .like("slug", `${slug}%`);

    if (existingBlogs && existingBlogs.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const blogData = {
      ...body,
      slug,
      published_at:
        body.status === "published" ? new Date().toISOString() : null,
    };

    const { data: blog, error } = await supabase
      .from("blogs")
      .insert([blogData])
      .select()
      .single();

    if (error) {
      console.error("Error creating blog:", error);
      return NextResponse.json(
        { error: "Failed to create blog" },
        { status: 500 }
      );
    }

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
