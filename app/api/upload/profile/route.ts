import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log("Profile upload endpoint called");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("File received:", file ? file.name : "No file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `profile-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;
    const filePath = `about/${fileName}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Uploading to Supabase:", filePath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: `Failed to upload image: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Upload successful:", data);

    // Return the file path (not the full URL, just the path)
    return NextResponse.json({
      success: true,
      filePath: data.path,
      message: "Profile image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
