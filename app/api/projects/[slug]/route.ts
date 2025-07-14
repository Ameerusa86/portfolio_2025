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

    // Determine if it's a slug, UUID, or numeric ID
    let updateQuery;

    // Check if it's a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Check if it's a numeric ID
    const isNumericId = /^\d+$/.test(slug);

    if (uuidRegex.test(slug)) {
      // It's a UUID, search by id
      console.log("Detected UUID, searching by id:", slug);
      updateQuery = supabase.from("projects").update(updateData).eq("id", slug);
    } else if (isNumericId) {
      // It's a numeric ID, search by id
      console.log("Detected numeric ID, searching by id:", slug);
      updateQuery = supabase
        .from("projects")
        .update(updateData)
        .eq("id", parseInt(slug));
    } else {
      // It's a slug, search by slug
      console.log("Detected slug, searching by slug:", slug);
      updateQuery = supabase
        .from("projects")
        .update(updateData)
        .eq("slug", slug);
    }

    const { error } = await updateQuery;

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
    console.log("Attempting to delete project with identifier:", slug);

    // Determine if it's a slug, UUID, or numeric ID
    let findQuery;

    // Check if it's a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Check if it's a numeric ID
    const isNumericId = /^\d+$/.test(slug);

    if (uuidRegex.test(slug)) {
      // It's a UUID, search by id
      console.log("Detected UUID, searching by id:", slug);
      findQuery = supabase
        .from("projects")
        .select("id, image_key")
        .eq("id", slug)
        .single();
    } else if (isNumericId) {
      // It's a numeric ID, search by id
      console.log("Detected numeric ID, searching by id:", slug);
      findQuery = supabase
        .from("projects")
        .select("id, image_key")
        .eq("id", parseInt(slug))
        .single();
    } else {
      // It's a slug, search by slug
      console.log("Detected slug, searching by slug:", slug);
      findQuery = supabase
        .from("projects")
        .select("id, image_key")
        .eq("slug", slug)
        .single();
    }

    const { data, error: fetchError } = await findQuery;

    if (fetchError) {
      console.error("Error fetching project:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!data) {
      console.error("Project not found with identifier:", slug);
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

    // Delete the project using the id we found
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", data.id);

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

    // Determine if it's a slug, UUID, or numeric ID
    let query;

    // Check if it's a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Check if it's a numeric ID
    const isNumericId = /^\d+$/.test(slug);

    if (uuidRegex.test(slug)) {
      // It's a UUID, search by id
      console.log("Detected UUID, searching by id:", slug);
      query = supabase.from("projects").select("*").eq("id", slug).single();
    } else if (isNumericId) {
      // It's a numeric ID, search by id
      console.log("Detected numeric ID, searching by id:", slug);
      query = supabase
        .from("projects")
        .select("*")
        .eq("id", parseInt(slug))
        .single();
    } else {
      // It's a slug, search by slug
      console.log("Detected slug, searching by slug:", slug);
      query = supabase.from("projects").select("*").eq("slug", slug).single();
    }

    const { data, error } = await query;

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
