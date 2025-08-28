// Deprecated: This route has been removed. Returning 410 Gone.
export async function GET() {
  return new Response("Gone", { status: 410 });
}

export async function POST() {
  return new Response("Gone", { status: 410 });
}
