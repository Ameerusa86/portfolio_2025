import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const { data, error } = await supabase.rpc("increment_blog_views", {
      p_slug: slug,
    });

    if (error) {
      if (error.message.includes("function increment_blog_views")) {
        const { data: current, error: fetchErr } = await supabase
          .from("blogs")
          .select("views")
          .eq("slug", slug)
          .single();
        if (fetchErr) {
          return NextResponse.json(
            { error: "Unable to fetch current views" },
            { status: 500 }
          );
        }
        const nextViews = (current?.views || 0) + 1;
        const { data: updated, error: updateErr } = await supabase
          .from("blogs")
          .update({ views: nextViews })
          .eq("slug", slug)
          .select("views")
          .single();
        if (updateErr) {
          return NextResponse.json(
            { error: "Failed to update views" },
            { status: 500 }
          );
        }
        return NextResponse.json({ views: updated.views });
      }
      console.error("Error incrementing views:", error);
      return NextResponse.json(
        { error: "Failed to increment views" },
        { status: 500 }
      );
    }

    return NextResponse.json({ views: data });
  } catch (e) {
    console.error("Error in POST /api/blogs/[slug]/view:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
