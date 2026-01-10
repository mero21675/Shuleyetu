import { NextRequest } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServer";
import { validatePublicOrderRequest } from "@/lib/publicOrderValidation";
import { jsonError, jsonOk, readJsonBody } from "@/lib/apiUtils";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<{
      orderId?: string;
      token?: string;
      includeItems?: boolean;
    }>(request);

    const validated = validatePublicOrderRequest(body);
    if (!validated.ok) {
      return jsonError(validated.error, validated.status);
    }

    const { orderId, token, includeItems } = validated;

    const { data: order, error: orderError } = await supabaseServerClient
      .from("orders")
      .select(
        "id, vendor_id, customer_name, customer_phone, student_name, school_name, total_amount_tzs, status, payment_status, created_at, payment_reference, clickpesa_transaction_id, public_access_token, vendors(name)",
      )
      .eq("id", orderId)
      .eq("public_access_token", token)
      .maybeSingle();

    if (orderError || !order) {
      return jsonError("Order not found", 404);
    }

    if (!includeItems) {
      return jsonOk({ order, items: [] });
    }

    const { data: items, error: itemsError } = await supabaseServerClient
      .from("order_items")
      .select(
        "id, quantity, unit_price_tzs, total_price_tzs, inventory:inventory_id(name, category)",
      )
      .eq("order_id", orderId)
      .order("id", { ascending: true });

    if (itemsError) {
      logError("Failed to load public order items", itemsError, { orderId });
      return jsonError("Failed to load order items", 500);
    }

    return jsonOk({ order, items: items ?? [] });
  } catch (error) {
    logError("Unexpected error in public order API", error);
    return jsonError("Internal server error", 500);
  }
}
