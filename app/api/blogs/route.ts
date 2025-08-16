import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { CreateBlogData } from "@/types/blog";
import { generateSlug } from "@/lib/slug-utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/blogs - Fetch all blogs
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const featured = url.searchParams.get("featured");
    const limit = url.searchParams.get("limit");
    const popular = url.searchParams.get("popular");
    const sort = url.searchParams.get("sort");
    const mostLiked = url.searchParams.get("mostLiked");

    let query = supabase.from("blogs").select("*");

    // Sorting logic
    if (popular === "true" || sort === "views") {
      query = query.order("views", { ascending: false });
      query = query.order("created_at", { ascending: false });
      // default limit for popular
      if (!limit) {
        query = query.limit(5);
      }
    } else if (mostLiked === "true" || sort === "likes") {
      query = query.order("likes", { ascending: false });
      query = query.order("created_at", { ascending: false });
      if (!limit) {
        query = query.limit(5);
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

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
