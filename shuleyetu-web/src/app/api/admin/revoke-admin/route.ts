import { NextRequest } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServer";
import { requireAdmin } from "@/lib/adminAuth";
import { jsonError, jsonOk, readJsonBody } from "@/lib/apiUtils";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const body = await readJsonBody<{ userId?: string }>(request);

    const userId = body?.userId?.trim() ?? "";
    if (!userId) {
      return jsonError("userId is required", 400);
    }

    if (userId === auth.user.id) {
      return jsonError("Cannot revoke yourself", 400);
    }

    const { count, error: countErr } = await supabaseServerClient
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "admin");

    if (countErr) {
      logError("Error counting admins", countErr, { adminUserId: auth.user.id });
      return jsonError("Failed to revoke admin", 500);
    }

    if ((count ?? 0) <= 1) {
      return jsonError("Cannot revoke the last admin", 400);
    }

    const { error } = await supabaseServerClient
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");

    if (error) {
      logError("Error revoking admin", error, {
        adminUserId: auth.user.id,
        targetUserId: userId,
      });
      return jsonError("Failed to revoke admin", 500);
    }

    return jsonOk({ success: true });
  } catch (err) {
    logError("Unexpected error in revoke-admin", err);
    return jsonError("Internal server error", 500);
  }
}
