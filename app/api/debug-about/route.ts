// Deprecated: debug-about endpoint removed.
export async function GET() {
  return new Response("Gone", { status: 410 });
}
