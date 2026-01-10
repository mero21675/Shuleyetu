import { describe, expect, it } from "vitest";
import { isUuid, parseOrderLink } from "./orderTracking";

describe("orderTracking", () => {
  it("validates UUID", () => {
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("parses order summary link", () => {
    const res = parseOrderLink(
      "https://example.com/orders/550e8400-e29b-41d4-a716-446655440000?token=550e8400-e29b-41d4-a716-446655440001",
    );
    expect(res).toEqual({
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      token: "550e8400-e29b-41d4-a716-446655440001",
    });
  });

  it("parses pay link", () => {
    const res = parseOrderLink(
      "/orders/pay/550e8400-e29b-41d4-a716-446655440000?token=550e8400-e29b-41d4-a716-446655440001",
    );
    expect(res?.orderId).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(res?.token).toBe("550e8400-e29b-41d4-a716-446655440001");
  });
});
