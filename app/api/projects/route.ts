import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const projects = await db.collection("projects").find({}).toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedProjects = projects.map((project) => ({
      ...project,
      id: project._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(serializedProjects, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received project:", body);

    const { title, description, image, techStack, githubUrl, liveUrl } = body;

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

    // Create project object
    const project = {
      title,
      description,
      image: image || "",
      techStack: techStack || [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("projects").insertOne(project);

    console.log("✅ Project saved to MongoDB:", result.insertedId);

    return NextResponse.json(
      {
        message: "Project saved successfully!",
        id: result.insertedId.toString(),
      },
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
