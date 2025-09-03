import { NextRequest, NextResponse } from "next/server";
import { AboutData, CreateAboutData } from "@/types/about";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function supabaseHeaders() {
  return {
    "Content-Type": "application/json",
    apikey: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : "",
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    Prefer: "return=representation",
  } as Record<string, string>;
}

// Helper to call Supabase REST for the `about` table without importing supabase-js
async function restFetch(path: string, options?: RequestInit) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not configured");
  }

  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1${path}`;
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { status: res.status, body: text ? JSON.parse(text) : null };
  } catch (e) {
    return { status: res.status, body: text };
  }
}

// GET /api/about - Fetch about data
export async function GET() {
  try {
    const { status, body } = await restFetch("/about?select=*&limit=1", {
      method: "GET",
      headers: {
        ...supabaseHeaders(),
        Prefer: "return=representation",
      },
    });

    if (status >= 400) {
      console.error("Error fetching about data: status", status, body);
      return NextResponse.json(
        { error: "Failed to fetch about data" },
        { status: 500 }
      );
    }

    const aboutData = Array.isArray(body) && body.length > 0 ? body[0] : null;

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

    const { status, body: resBody } = await restFetch("/about", {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (status >= 400) {
      console.error("Error creating about data:", status, resBody);
      return NextResponse.json(
        { error: "Failed to create about data" },
        { status: 500 }
      );
    }

    // Supabase returns an array of created rows
    const data = Array.isArray(resBody) ? resBody[0] : resBody;
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
    const { id, ...updateData } = body as any;

    if (!id) {
      return NextResponse.json(
        { error: "About ID is required" },
        { status: 400 }
      );
    }

    const { status, body: resBody } = await restFetch(
      `/about?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: supabaseHeaders(),
        body: JSON.stringify({
          ...updateData,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (status >= 400) {
      console.error("Error updating about data:", status, resBody);
      return NextResponse.json(
        { error: "Failed to update about data" },
        { status: 500 }
      );
    }

    const data = Array.isArray(resBody) ? resBody[0] : resBody;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
