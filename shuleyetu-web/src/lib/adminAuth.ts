import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServer";
import { parseBearerToken } from "@/lib/httpAuth";

export type AdminAuthSuccess = {
  ok: true;
  user: { id: string; email: string | null };
};

export type AdminAuthFailure = { ok: false; response: NextResponse };

export async function requireAdmin(
  request: NextRequest,
): Promise<AdminAuthSuccess | AdminAuthFailure> {
  const token = parseBearerToken(request.headers.get("authorization"));
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: userData, error: userError } = await supabaseServerClient.auth.getUser(
    token,
  );

  const user = userData?.user ?? null;
  if (userError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: roleRow, error: roleError } = await supabaseServerClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError) {
    console.error("Error checking admin role", roleError);
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!roleRow) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email ?? null },
  };
}
