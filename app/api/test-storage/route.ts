import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Test storage endpoint",
    timestamp: new Date().toISOString(),
  });
}
