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
    // Prefer RPC function for atomic increment
    const { data, error } = await supabase.rpc("increment_blog_likes", {
      p_slug: slug,
    });
    if (error) {
      // Fallback to select + update (non-atomic) if function missing
      if (error.message.includes("increment_blog_likes")) {
        const { data: current, error: fetchErr } = await supabase
          .from("blogs")
          .select("likes")
          .eq("slug", slug)
          .single();
        if (fetchErr) {
          return NextResponse.json(
            { error: "Unable to fetch current likes" },
            { status: 500 }
          );
        }
        const nextLikes = (current?.likes || 0) + 1;
        const { data: updated, error: updateErr } = await supabase
          .from("blogs")
          .update({ likes: nextLikes })
          .eq("slug", slug)
          .select("likes")
          .single();
        if (updateErr) {
          return NextResponse.json(
            { error: "Failed to update likes" },
            { status: 500 }
          );
        }
        return NextResponse.json({ likes: updated.likes });
      }
      console.error("Error incrementing like:", error);
      return NextResponse.json(
        { error: "Failed to like post" },
        { status: 500 }
      );
    }
    return NextResponse.json({ likes: data });
  } catch (e) {
    console.error("Error in POST /api/blogs/[slug]/like:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
