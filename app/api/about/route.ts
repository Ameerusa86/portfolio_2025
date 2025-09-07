import { NextRequest, NextResponse } from "next/server";
import { AboutData, CreateAboutData } from "@/types/about";
import { supabaseAdmin, supabase } from "@/lib/supabase";

// GET /api/about - Fetch about data
export async function GET() {
  try {
    // Debug environment variables
    console.log("Environment debug:", {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl:
        process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "...",
    });

    // Use admin client if available, fallback to anon client
    const client = supabaseAdmin || supabase;

    console.log("Client status:", {
      hasAdmin: !!supabaseAdmin,
      hasAnon: !!supabase,
      usingClient: supabaseAdmin ? "admin" : "anon",
    });

    if (!client) {
      console.error("No Supabase client available");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    console.log("Attempting to fetch from about table...");
    const { data: aboutData, error } = await client
      .from("about")
      .select("*")
      .limit(1)
      .maybeSingle();

    console.log("Query result:", {
      hasData: !!aboutData,
      hasError: !!error,
      errorCode: error?.code,
      errorMessage: error?.message,
      dataCount: aboutData ? 1 : 0,
    });

    if (error) {
      console.error("Supabase error fetching about data:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch about data",
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    if (!aboutData) {
      console.log("No about data found in database, returning default");
      // Since you have the table, let's check if we can insert some test data
      console.log("Attempting to check table structure...");

      // Try to get table info
      const { data: tableCheck, error: tableError } = await client
        .from("about")
        .select("id")
        .limit(1);

      console.log("Table check result:", {
        tableExists: !tableError,
        hasData: !!tableCheck && tableCheck.length > 0,
        tableError: tableError?.message,
      });

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

    console.log("Successfully fetched about data from Supabase:", aboutData.id);
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Unexpected error in GET /api/about:", error);
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
    const client = supabaseAdmin || supabase;

    if (!client) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const { data, error } = await client
      .from("about")
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating about data:", error);
      return NextResponse.json(
        { error: "Failed to create about data", details: error.message },
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
    const client = supabaseAdmin || supabase;

    if (!client) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "About ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await client
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
        { error: "Failed to update about data", details: error.message },
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
