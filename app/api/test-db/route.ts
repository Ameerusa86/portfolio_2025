import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sampleProjects } from "@/lib/sample-projects";
import { sampleBlogPosts } from "@/lib/sample-blogs";
import { generateSlug } from "@/lib/slug-utils";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Test the connection by getting database stats
    const stats = await db.stats();

    console.log("✅ MongoDB connection successful!");
    console.log("Database stats:", stats);

    // Clear existing data and reseed
    console.log("🗑️ Clearing existing collections...");
    await db.collection("projects").deleteMany({});
    await db.collection("blogs").deleteMany({});

    // Seed projects
    console.log("🌱 Seeding database with sample projects...");
    await db.collection("projects").insertMany(sampleProjects);
    console.log(`✅ Inserted ${sampleProjects.length} sample projects!`);

    // Seed blogs
    console.log("🌱 Seeding database with sample blog posts...");
    await db.collection("blogs").insertMany(sampleBlogPosts);
    console.log(`✅ Inserted ${sampleBlogPosts.length} sample blog posts!`);

    const finalStats = await db.stats();

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully!",
        database: finalStats.db,
        collections: finalStats.collections,
        dataSize: finalStats.dataSize,
        storageSize: finalStats.storageSize,
        projectsCount: await db.collection("projects").countDocuments(),
        blogsCount: await db.collection("blogs").countDocuments(),
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
