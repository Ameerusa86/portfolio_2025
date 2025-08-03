import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // List all storage buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Storage error:", error);
      return NextResponse.json(
        {
          error: "Failed to check storage buckets",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Check if profile-images bucket exists
    const profileImagesBucket = buckets.find(
      (bucket) => bucket.id === "profile-images"
    );

    const result = {
      buckets: buckets.map((b) => ({
        id: b.id,
        name: b.name,
        public: b.public,
      })),
      profileImagesBucketExists: !!profileImagesBucket,
      profileImagesBucket: profileImagesBucket || null,
      total: buckets.length,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
