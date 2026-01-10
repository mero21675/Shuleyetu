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

    const body = await readJsonBody<{ email?: string; vendorId?: string }>(request);

    const email = body?.email?.trim().toLowerCase() ?? "";
    const vendorId = body?.vendorId?.trim() ?? "";

    if (!email || !vendorId) {
      return jsonError("email and vendorId are required", 400);
    }

    const { data: userId, error: userErr } = await supabaseServerClient.rpc(
      "get_user_id_by_email",
      { p_email: email },
    );

    if (userErr || !userId) {
      return jsonError("User not found", 404);
    }

    const { data: vendorRow, error: vendorErr } = await supabaseServerClient
      .from("vendors")
      .select("id")
      .eq("id", vendorId)
      .maybeSingle();

    if (vendorErr || !vendorRow?.id) {
      return jsonError("Vendor not found", 404);
    }

    const { error: insertErr } = await supabaseServerClient
      .from("vendor_users")
      .insert({ user_id: userId, vendor_id: vendorId });

    if (insertErr) {
      const code = (insertErr as any)?.code;
      if (code === "23505") {
        return jsonOk({ success: true, alreadyLinked: true });
      }
      logError("Failed to link vendor user", insertErr, {
        adminUserId: auth.user.id,
        targetEmail: email,
        vendorId,
      });
      return jsonError("Failed to link user to vendor", 500);
    }

    return jsonOk({ success: true, alreadyLinked: false });
  } catch (error) {
    logError("Unexpected error linking vendor user", error);
    return jsonError("Internal server error", 500);
  }
}
