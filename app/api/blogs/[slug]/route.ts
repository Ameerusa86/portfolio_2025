import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching blog:", error);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/blogs/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Handle different types of updates
    if (body.title) {
      // Full blog update - validate required fields
      const {
        title,
        excerpt,
        content,
        image,
        tags,
        read_time,
        featured,
        status,
      } = body;

      if (!title || !excerpt || !content) {
        return NextResponse.json(
          { error: "Missing required fields: title, excerpt, content" },
          { status: 400 }
        );
      }

      Object.assign(updateData, {
        title,
        excerpt,
        content,
        image: image || null,
        tags: tags || [],
        read_time: read_time || 5,
        featured: featured || false,
        status: status || "draft",
      });
    } else {
      // Partial update (toggle operations) - only update provided fields
      if (body.hasOwnProperty("featured")) {
        updateData.featured = Boolean(body.featured);
      }
      if (body.hasOwnProperty("status")) {
        updateData.status = body.status;
      }
      if (body.hasOwnProperty("read_time")) {
        updateData.read_time = body.read_time;
      }
      if (body.hasOwnProperty("image")) {
        updateData.image = body.image;
      }
      if (body.hasOwnProperty("tags")) {
        updateData.tags = body.tags;
      }
      if (body.hasOwnProperty("excerpt")) {
        updateData.excerpt = body.excerpt;
      }
      if (body.hasOwnProperty("content")) {
        updateData.content = body.content;
      }
    }

    console.log("Updating blog with data:", updateData);

    // Update the blog
    const { data, error } = await supabase
      .from("blogs")
      .update(updateData)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog:", error);
      return NextResponse.json(
        { error: "Failed to update blog" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/blogs/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const { error } = await supabase.from("blogs").delete().eq("slug", slug);

    if (error) {
      console.error("Error deleting blog:", error);
      return NextResponse.json(
        { error: "Failed to delete blog" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/blogs/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
