import { withProNPSSupabase } from "@/lib/supabase/server";

const handler = withProNPSSupabase("none", async (_request, ctx) => {
  return Response.json({
    ok: true,
    authMode: ctx.authMode,
    hasRlsScopedClient: Boolean(ctx.supabase),
    hasAdminClient: Boolean(ctx.supabaseAdmin),
  });
});

export async function GET(request: Request) {
  return handler(request);
}

