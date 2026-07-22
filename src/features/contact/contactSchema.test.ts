import { hasMinimumFillTime, validateContact } from "./contactSchema";

const valid = {
  name: "Mike Visitor",
  email: "visitor@example.test",
  subject: "AI engineering opportunity",
  message: "I would like to discuss a relevant AI engineering opportunity.",
};

describe("contact validation", () => {
  it("normalizes and accepts the expected four fields", () => {
    const result = validateContact({ ...valid, name: "  Mike Visitor  " });
    expect(result).toEqual({ success: true, data: valid });
  });

  it.each([
    ["name", { ...valid, name: "M" }],
    ["email", { ...valid, email: "not-an-email" }],
    ["subject", { ...valid, subject: "AI" }],
    ["message", { ...valid, message: "Too short" }],
  ])("rejects an invalid %s", (field, values) => {
    const result = validateContact(values);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors[field as keyof typeof valid]).toBeTruthy();
  });

  it("rejects values above the published limits and unexpected keys", () => {
    expect(validateContact({ ...valid, message: "x".repeat(2001) }).success).toBe(false);
    expect(validateContact({ ...valid, role: "admin" }).success).toBe(false);
  });

  it("rejects control characters in single-line fields", () => {
    expect(validateContact({ ...valid, subject: "AI\u0000 opportunity" }).success).toBe(false);
    expect(validateContact({ ...valid, name: "Mike\nVisitor" }).success).toBe(false);
  });

  it.each([
    ["name", { ...valid, name: "\nMike Visitor" }],
    ["subject", { ...valid, subject: "AI engineering opportunity\t" }],
    ["message", { ...valid, message: `\u000B${valid.message}\u000C` }],
  ])("rejects prohibited controls at the edges of %s before trimming", (field, values) => {
    const result = validateContact(values);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors[field as keyof typeof valid]).toBeTruthy();
  });

  it("allows supported multiline whitespace inside a message", () => {
    const message = "First valid line.\nSecond\tvalid line.\r\nFinal valid line.";
    expect(validateContact({ ...valid, message })).toEqual({
      success: true,
      data: { ...valid, message },
    });
  });

  it("requires at least 1500ms before submission", () => {
    expect(hasMinimumFillTime(1000, 2499, 1500)).toBe(false);
    expect(hasMinimumFillTime(1000, 2500, 1500)).toBe(true);
  });
});
