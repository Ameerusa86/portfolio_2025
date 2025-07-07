import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Get all collections
    const collections = await db.listCollections().toArray();

    // Get projects count and sample data
    const projectsCollection = db.collection("projects");
    const projectCount = await projectsCollection.countDocuments();
    const sampleProjects = await projectsCollection.find({}).limit(3).toArray();

    console.log("✅ Database inspection successful!");

    return NextResponse.json(
      {
        success: true,
        database: "portfolio",
        collections: collections.map((c) => c.name),
        projectCount,
        sampleProjects: sampleProjects.map((p) => ({
          id: p._id.toString(),
          title: p.title,
          description: p.description,
          techStack: p.techStack,
          hasImage: !!p.image,
          imageUrl: p.image,
          createdAt: p.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Database inspection failed:", error);
    return NextResponse.json(
      {
        error: "Database inspection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
