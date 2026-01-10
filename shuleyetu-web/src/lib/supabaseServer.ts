import { createClient } from "@supabase/supabase-js";

function createMissingEnvClient(): any {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Supabase server env vars SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
        );
      },
    },
  );
}

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    "Supabase server env vars SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not set.",
  );
}

export const supabaseServerClient =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : createMissingEnvClient();
