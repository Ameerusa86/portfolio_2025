import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/slug-utils";

export async function GET(req: NextRequest) {
  try {
    const isAdmin = req.nextUrl?.searchParams?.get("admin") === "true";
    let query = supabase.from("projects").select("*");
    if (!isAdmin) {
      query = query.eq("published", true);
    }
    const { data, error } = await query;
    if (error) throw error;
    const projects = (data || []).map((project: Record<string, unknown>) => ({
      ...project,
      slug: project.slug || generateSlug(project.title as string),
    }));
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("POST request body:", body); // Debug log

    // Accept both camelCase and snake_case from frontend
    const title = body.title;
    const description = body.description;
    const image = body.image || body.image_url || "";
    const image_key = body.imageKey || body.image_key || "";
    const tech_stack = body.techStack || body.tech_stack || [];
    const github_url = body.githubUrl || body.github_url || "";
    const live_url = body.liveUrl || body.live_url || "";
    const published =
      typeof body.published === "boolean" ? body.published : true;
    const featured = typeof body.featured === "boolean" ? body.featured : false;
    const tags = body.tags || [];
    const status = body.status || "";
    const order = typeof body.order === "number" ? body.order : null;

    console.log("Processed data:", {
      title,
      description,
      tech_stack,
      github_url,
      live_url,
    }); // Debug log

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }
    if (tech_stack && !Array.isArray(tech_stack)) {
      return NextResponse.json(
        { error: "Tech stack must be an array" },
        { status: 400 }
      );
    }
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const now = new Date().toISOString();
    const project = {
      title,
      slug,
      description,
      image,
      image_key,
      tech_stack,
      github_url,
      live_url,
      published,
      featured,
      created_at: now,
      updated_at: now,
      tags,
      status,
      order,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert([project])
      .select("id");
    if (error) throw error;
    return NextResponse.json(
      {
        message: "Project saved successfully!",
        id: data && data[0] ? data[0].id : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in POST /api/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
