export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function parseOrderLink(
  input: string,
): { orderId: string; token: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const asUrl = (() => {
    try {
      return new URL(trimmed);
    } catch {
      // continue
    }

    try {
      if (trimmed.startsWith("/")) {
        return new URL(trimmed, "https://example.com");
      }
      return new URL(`https://${trimmed}`);
    } catch {
      // continue
    }

    try {
      return new URL(trimmed, "https://example.com");
    } catch {
      return null;
    }
  })();

  if (!asUrl) return null;

  const parts = asUrl.pathname.split("/").filter(Boolean);
  const ordersIndex = parts.indexOf("orders");
  const firstAfterOrders = ordersIndex >= 0 ? (parts[ordersIndex + 1] ?? "") : "";
  const orderId =
    firstAfterOrders === "pay" ? (parts[ordersIndex + 2] ?? "") : firstAfterOrders;

  const token = asUrl.searchParams.get("token") ?? "";

  if (!orderId || !token) return null;
  return { orderId, token };
}
