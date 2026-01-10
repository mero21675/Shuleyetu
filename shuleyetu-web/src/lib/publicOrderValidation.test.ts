import { describe, expect, it } from "vitest";
import { validatePublicOrderRequest } from "./publicOrderValidation";

describe("validatePublicOrderRequest", () => {
  it("requires orderId and token", () => {
    expect(validatePublicOrderRequest(null)).toEqual({
      ok: false,
      status: 400,
      error: "orderId and token are required",
    });

    expect(validatePublicOrderRequest({ orderId: "1" })).toEqual({
      ok: false,
      status: 400,
      error: "orderId and token are required",
    });
  });

  it("passes through includeItems", () => {
    expect(
      validatePublicOrderRequest({ orderId: "o", token: "t", includeItems: false }),
    ).toEqual({ ok: true, orderId: "o", token: "t", includeItems: false });
  });
});
