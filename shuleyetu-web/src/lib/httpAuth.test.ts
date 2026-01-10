import { describe, expect, it } from "vitest";
import { parseBearerToken } from "./httpAuth";

describe("parseBearerToken", () => {
  it("returns empty string when missing", () => {
    expect(parseBearerToken(null)).toBe("");
    expect(parseBearerToken("")).toBe("");
  });

  it("extracts token", () => {
    expect(parseBearerToken("Bearer abc.def.ghi")).toBe("abc.def.ghi");
    expect(parseBearerToken("bearer   token123 ")).toBe("token123");
  });

  it("rejects non-bearer", () => {
    expect(parseBearerToken("Basic abc")).toBe("");
  });
});
