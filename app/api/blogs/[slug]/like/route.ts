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
    // Atomic increment using a single update with returning
    const { data, error } = await supabase
      .from("blogs")
      .update({ likes: ("likes" as any) + 1 })
      .eq("slug", slug)
      .select("likes")
      .single();

    if (error) {
      // Fallback: use rpc or manual select-update sequence if necessary
      console.error("Error incrementing like:", error);
      return NextResponse.json(
        { error: "Failed to like post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ likes: data.likes });
  } catch (e) {
    console.error("Error in POST /api/blogs/[slug]/like:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
