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

    const body = await readJsonBody<{ userId?: string; vendorId?: string }>(request);

    const userId = body?.userId?.trim() ?? "";
    const vendorId = body?.vendorId?.trim() ?? "";

    if (!userId || !vendorId) {
      return jsonError("userId and vendorId are required", 400);
    }

    const { error } = await supabaseServerClient
      .from("vendor_users")
      .delete()
      .eq("user_id", userId)
      .eq("vendor_id", vendorId);

    if (error) {
      logError("Error unlinking vendor user", error, {
        adminUserId: auth.user.id,
        userId,
        vendorId,
      });
      return jsonError("Failed to unlink", 500);
    }

    return jsonOk({ success: true });
  } catch (err) {
    logError("Unexpected error in unlink-vendor-user", err);
    return jsonError("Internal server error", 500);
  }
}
