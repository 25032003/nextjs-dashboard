// Removed - Chapter 6 does not include a db-ping route.
export async function GET() {
  return new Response('Not Found', { status: 404 });
}
