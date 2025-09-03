import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin)
      return NextResponse.json({ error: "No admin client" }, { status: 500 });
    const { data, error } = await supabaseAdmin
      .from("technologies")
      .select("id, name")
      .order("name", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch technologies", err);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name: string = String(body.name || "").trim();
    if (!name)
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!supabaseAdmin)
      return NextResponse.json({ error: "No admin client" }, { status: 500 });
    const { data, error } = await supabaseAdmin
      .from("technologies")
      .insert({ name })
      .select("id, name")
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Failed to create technology", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!supabaseAdmin)
      return NextResponse.json({ error: "No admin client" }, { status: 500 });
    const { error } = await supabaseAdmin
      .from("technologies")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete technology", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;
    const name = String(body.name || "").trim();
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!name)
      return NextResponse.json({ error: "name required" }, { status: 400 });
    if (!supabaseAdmin)
      return NextResponse.json({ error: "No admin client" }, { status: 500 });

    const { data, error } = await supabaseAdmin
      .from("technologies")
      .update({ name })
      .eq("id", id)
      .select("id, name")
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to update technology", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
