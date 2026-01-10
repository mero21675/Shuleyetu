export type PublicOrderRequestInput =
  | { orderId?: string; token?: string; includeItems?: boolean }
  | null
  | undefined;

export type PublicOrderRequestValidationResult =
  | {
      ok: true;
      orderId: string;
      token: string;
      includeItems: boolean;
    }
  | { ok: false; status: number; error: string };

export function validatePublicOrderRequest(
  input: PublicOrderRequestInput,
): PublicOrderRequestValidationResult {
  const orderId = input?.orderId;
  const token = input?.token;
  const includeItems = input?.includeItems ?? true;

  if (!orderId || !token) {
    return { ok: false, status: 400, error: "orderId and token are required" };
  }

  return { ok: true, orderId, token, includeItems };
}
