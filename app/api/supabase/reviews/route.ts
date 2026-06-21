import { withProNPSSupabase } from "@/lib/supabase/server";

const handler = withProNPSSupabase("user", async (_request, ctx) => {
  const { data, error } = await ctx.supabase
    .from("Review")
    .select("id, rating, comment, contact, source, status, createdAt")
    .order("createdAt", { ascending: false });

  if (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }

  return Response.json({ data });
});

export async function GET(request: Request) {
  return handler(request);
}
