import { withSupabase } from "@supabase/server";

export type SupabaseAuthMode = "user" | "publishable" | "secret" | "none";

export function withProNPSSupabase(
  auth: SupabaseAuthMode,
  handler: Parameters<typeof withSupabase>[1],
) {
  return withSupabase(
    {
      auth,
      cors: false,
    },
    handler,
  );
}

