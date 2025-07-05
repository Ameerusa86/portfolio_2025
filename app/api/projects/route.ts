import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received project:", body);

    const { id, title, description, image, techStack, githubUrl, liveUrl } =
      body;

    // Validate required fields
    if (!title || !description) {
      console.warn("Missing required fields:", { title, description });
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Validate techStack is an array
    if (techStack && !Array.isArray(techStack)) {
      console.warn("Tech stack must be an array:", techStack);
      return NextResponse.json(
        { error: "Tech stack must be an array" },
        { status: 400 }
      );
    }

    // Here you can save to your database
    // For now, just log the project data
    console.log("Project to save:", {
      id,
      title,
      description,
      image,
      techStack: techStack || [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
    });

    return NextResponse.json(
      { message: "Project saved successfully!" },
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

export async function GET() {
  try {
    // For now, return sample data
    // In a real app, you'd fetch from your database
    const projects = [
      {
        id: "1",
        title: "Sample Project",
        description: "This is a sample project",
        image: "https://via.placeholder.com/400x300",
        techStack: ["React", "TypeScript", "Next.js"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
