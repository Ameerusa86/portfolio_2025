import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    console.log("Updating project:", id, body);

    const { title, description, image, techStack, githubUrl, liveUrl } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Validate techStack is an array
    if (techStack && !Array.isArray(techStack)) {
      return NextResponse.json(
        { error: "Tech stack must be an array" },
        { status: 400 }
      );
    }

    // Update project object
    const updateData = {
      title,
      description,
      image: image || "",
      techStack: techStack || [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      updatedAt: new Date(),
    };

    // Update in MongoDB
    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db
      .collection("projects")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("✅ Project updated in MongoDB:", id);

    return NextResponse.json(
      { message: "Project updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in PUT /api/projects/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    console.log("Deleting project:", id);

    // Delete from MongoDB
    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("projects").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("✅ Project deleted from MongoDB:", id);

    return NextResponse.json(
      { message: "Project deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in DELETE /api/projects/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    console.log("Getting project:", id);

    // Get from MongoDB
    const client = await clientPromise;
    const db = client.db("portfolio");
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(id),
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Convert ObjectId to string for JSON serialization
    const serializedProject = {
      ...project,
      id: project._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(serializedProject, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/projects/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
