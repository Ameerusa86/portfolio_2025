import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sampleProjects } from "@/lib/sample-projects";
import { generateSlug } from "@/lib/slug-utils";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Test the connection by getting database stats
    const stats = await db.stats();

    console.log("✅ MongoDB connection successful!");
    console.log("Database stats:", stats);

    // Check if we have any projects, if not seed with sample data
    const projectsCount = await db.collection("projects").countDocuments();
    
    if (projectsCount === 0) {
      console.log("🌱 Seeding database with sample projects...");
      await db.collection("projects").insertMany(sampleProjects);
      console.log("✅ Database seeded with sample projects!");
    } else {
      // Update existing projects to have slugs if they don't have them
      console.log("🔄 Updating existing projects with slugs...");
      const projects = await db.collection("projects").find({ slug: { $exists: false } }).toArray();
      
      for (const project of projects) {
        const slug = generateSlug(project.title);
        await db.collection("projects").updateOne(
          { _id: project._id },
          { $set: { slug: slug } }
        );
        console.log(`✅ Updated project "${project.title}" with slug: ${slug}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Database connection successful!",
        database: stats.db,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        projectsCount: await db.collection("projects").countDocuments(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ DB Connection Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
