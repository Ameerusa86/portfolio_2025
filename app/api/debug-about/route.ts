// Debug About API Route
// Added to fix build error: empty file wasn't treated as a module.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, route: "debug-about" });
}

// (Optional) You can expand this later to return about table diagnostics.
