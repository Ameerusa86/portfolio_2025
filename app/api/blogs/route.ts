import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const blogs = await db.collection("blogs").find({}).toArray();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();

    // Add timestamps and default values
    const blogData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: body.published || false,
      views: 0,
      likes: 0,
    };

    const result = await db.collection("blogs").insertOne(blogData);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
