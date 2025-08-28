// Deprecated: test-storage endpoint removed.
export async function GET() {
  return new Response("Gone", { status: 410 });
}
