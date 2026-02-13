export async function GET() {
  return Response.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    databaseUrlStart: process.env.DATABASE_URL?.substring(0, 15) || 'NOT_FOUND',
    openRouterStart: process.env.OPENROUTER_API_KEY?.substring(0, 10) || 'NOT_FOUND',
  });
}
