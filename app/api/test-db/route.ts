import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const test = await prisma.project.findMany({ take: 1 });
    return NextResponse.json({ success: true, projectCount: test.length });
  } catch (err: any) {
    console.error("❌ DB Connection Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
