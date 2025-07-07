import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Params {
  slug: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;
    const db = await getDb();
    
    // First try to find by slug
    let blog = await db.collection("blogs").findOne({ slug });
    
    // If not found by slug, try by ID (fallback for old URLs)
    if (!blog && ObjectId.isValid(slug)) {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(slug) });
    }
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;
    const db = await getDb();
    const body = await request.json();
    
    // Remove _id from body if present
    const { _id, ...updateData } = body;
    
    // Add updated timestamp
    updateData.updatedAt = new Date();
    
    // First try to find by slug
    let blog = await db.collection("blogs").findOne({ slug });
    
    // If not found by slug, try by ID (fallback for old URLs)
    if (!blog && ObjectId.isValid(slug)) {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(slug) });
    }
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    const result = await db.collection("blogs").updateOne(
      { _id: blog._id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;
    const db = await getDb();
    
    // First try to find by slug
    let blog = await db.collection("blogs").findOne({ slug });
    
    // If not found by slug, try by ID (fallback for old URLs)
    if (!blog && ObjectId.isValid(slug)) {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(slug) });
    }
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    const result = await db.collection("blogs").deleteOne({ _id: blog._id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
