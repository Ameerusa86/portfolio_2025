import { NextRequest, NextResponse } from "next/server";
import { AboutData, CreateAboutData } from "@/types/about";

async function getSupabaseAdminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return supabase;
}

// GET /api/about - Fetch about data
export async function GET() {
  try {
    const supabase = await getSupabaseAdminClient();
    const { data: aboutData, error } = await supabase
      .from("about")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching about data:", error);
      return NextResponse.json(
        { error: "Failed to fetch about data" },
        { status: 500 }
      );
    }

    // If no data exists, return default data
    if (!aboutData) {
      const defaultData: AboutData = {
        id: "default",
        title: "About Me",
        subtitle:
          "Full-stack developer passionate about creating exceptional digital experiences that make a difference",
        hero_description:
          "Full-stack developer passionate about creating exceptional digital experiences that make a difference",
        story_title: "My Story",
        story_content: [
          "I'm a passionate full-stack developer with experience in modern web technologies. I love building applications that solve real-world problems and provide great user experiences.",
          "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community.",
        ],
        skills_title: "Skills & Technologies",
        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "MongoDB",
          "PostgreSQL",
          "Tailwind CSS",
          "Python",
        ],
        cta_title: "Let's Work Together",
        cta_description:
          "I'm always interested in new opportunities and exciting projects.",
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      return NextResponse.json(defaultData);
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/about - Create about data
export async function POST(request: NextRequest) {
  try {
    const body: CreateAboutData = await request.json();

    const supabase = await getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("about")
      .insert([
        {
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating about data:", error);
      return NextResponse.json(
        { error: "Failed to create about data" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/about - Update about data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "About ID is required" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("about")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating about data:", error);
      return NextResponse.json(
        { error: "Failed to update about data" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
