import { NextResponse } from "next/server";

// Simple debug endpoint to verify API works in all environments
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
