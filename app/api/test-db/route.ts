import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Test the connection by getting database stats
    const stats = await db.stats();

    console.log("✅ MongoDB connection successful!");
    console.log("Database stats:", stats);

    return NextResponse.json(
      {
        success: true,
        message: "Database connection successful!",
        database: stats.db,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
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
