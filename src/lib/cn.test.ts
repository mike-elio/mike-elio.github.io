import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names without serializing false values", () => {
    expect(cn("base", false, undefined, "active", null)).toBe("base active");
  });
});
