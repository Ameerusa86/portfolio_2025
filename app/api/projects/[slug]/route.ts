import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/slug-utils";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;

    const body = await req.json();
    const {
      title,
      description,
      image,
      imageKey,
      techStack,
      githubUrl,
      liveUrl,
      published,
      featured,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (techStack && !Array.isArray(techStack)) {
      return NextResponse.json(
        { error: "Tech stack must be an array" },
        { status: 400 }
      );
    }

    // Map camelCase to snake_case for Supabase
    const updateData: any = {
      title,
      description,
      image: image || "",
      image_key: imageKey || "",
      tech_stack: Array.isArray(techStack) ? techStack : [],
      github_url: githubUrl || "",
      live_url: liveUrl || "",
      updated_at: new Date().toISOString(),
    };

    if (typeof published === "boolean") {
      updateData.published = published;
    }

    if (typeof featured === "boolean") {
      updateData.featured = featured;
    }

    const { error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("slug", slug);

    if (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Project updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in PUT /api/projects/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;
    console.log("Attempting to delete project with slug:", slug);

    // Find the project by slug
    const { data, error: fetchError } = await supabase
      .from("projects")
      .select("id, image_key")
      .eq("slug", slug)
      .single();

    if (fetchError) {
      console.error("Error fetching project:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!data) {
      console.error("Project not found with slug:", slug);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete image from storage if present
    if (data.image_key) {
      try {
        await supabase.storage.from("project-images").remove([data.image_key]);
      } catch (err) {
        console.error("Failed to delete image from storage:", err);
        // Continue deletion even if image removal fails
      }
    }

    // Delete the project
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("slug", slug);

    if (deleteError) {
      console.error("Error deleting project:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in DELETE /api/projects/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error in GET /api/projects/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
