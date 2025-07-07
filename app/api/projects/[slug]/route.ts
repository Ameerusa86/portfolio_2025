import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { generateSlug } from "@/lib/slug-utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    console.log("Updating project:", slug, body);

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
    const updateData: any = {
      title,
      description,
      image: image || "",
      techStack: techStack || [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      updatedAt: new Date(),
    };

    // Update slug if title changed
    if (title) {
      updateData.slug = generateSlug(title);
    }

    // Update in MongoDB - try slug first, then fallback to ID
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    let result = await db
      .collection("projects")
      .updateOne({ slug: slug }, { $set: updateData });
    
    // If not found by slug, try by ObjectId (for old projects)
    if (result.matchedCount === 0 && ObjectId.isValid(slug)) {
      result = await db
        .collection("projects")
        .updateOne({ _id: new ObjectId(slug) }, { $set: updateData });
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("✅ Project updated in MongoDB:", slug);

    return NextResponse.json(
      { message: "Project updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in PUT /api/projects/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    console.log("Deleting project:", slug);

    // Delete from MongoDB - try slug first, then fallback to ID
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    let result = await db.collection("projects").deleteOne({
      slug: slug,
    });
    
    // If not found by slug, try by ObjectId (for old projects)
    if (result.deletedCount === 0 && ObjectId.isValid(slug)) {
      result = await db.collection("projects").deleteOne({
        _id: new ObjectId(slug),
      });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("✅ Project deleted from MongoDB:", slug);

    return NextResponse.json(
      { message: "Project deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in DELETE /api/projects/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    console.log("Getting project with slug:", slug);

    // Get from MongoDB
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Try to find by slug first, then fallback to ID (for backward compatibility)
    console.log("Searching by slug:", slug);
    let project = await db.collection("projects").findOne({
      slug: slug,
    });
    
    console.log("Found by slug:", project ? "YES" : "NO");
    
    // If not found by slug, try by ObjectId (for old projects)
    if (!project && ObjectId.isValid(slug)) {
      console.log("Trying by ObjectId:", slug);
      project = await db.collection("projects").findOne({
        _id: new ObjectId(slug),
      });
      console.log("Found by ObjectId:", project ? "YES" : "NO");
    }

    if (!project) {
      console.log("No project found with slug/id:", slug);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("Found project:", project.title, "with slug:", project.slug);

    // Convert ObjectId to string for JSON serialization and ensure slug exists
    const serializedProject = {
      ...project,
      id: project._id.toString(),
      slug: project.slug || generateSlug(project.title), // Generate slug if missing
      _id: undefined,
    };

    return NextResponse.json(serializedProject, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/projects/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
