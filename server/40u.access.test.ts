import { describe, expect, it } from "vitest";
import { is40UAdmin } from "../shared/access";

describe("40U admin access", () => {
  it("allows only the configured administrator email", () => {
    expect(is40UAdmin("triftan88@gmail.com")).toBe(true);
    expect(is40UAdmin("TRIFTAN88@GMAIL.COM")).toBe(true);
    expect(is40UAdmin("someone@example.com")).toBe(false);
    expect(is40UAdmin(undefined)).toBe(false);
  });
});
