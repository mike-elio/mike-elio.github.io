import { z } from "zod";

// These ranges intentionally detect disallowed ASCII control characters.
// eslint-disable-next-line no-control-regex
const singleLineText = /^[^\u0000-\u001F\u007F]*$/;
// eslint-disable-next-line no-control-regex
const multiLineText = /^[^\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]*$/;

const schema = z
  .object({
    name: z
      .string()
      .refine((value) => singleLineText.test(value), "Remove control characters.")
      .trim()
      .min(2, "Enter at least 2 characters.")
      .max(80, "Use 80 characters or fewer."),
    email: z
      .string()
      .refine((value) => singleLineText.test(value), "Remove control characters.")
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Use 254 characters or fewer."),
    subject: z
      .string()
      .refine((value) => singleLineText.test(value), "Remove control characters.")
      .trim()
      .min(3, "Enter at least 3 characters.")
      .max(120, "Use 120 characters or fewer."),
    message: z
      .string()
      .refine(
        (value) => multiLineText.test(value),
        "Remove unsupported control characters.",
      )
      .trim()
      .min(20, "Enter at least 20 characters.")
      .max(2000, "Use 2,000 characters or fewer."),
  })
  .strict();

export type ContactValues = z.infer<typeof schema>;
export type ContactField = keyof ContactValues;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactValidationResult =
  | { success: true; data: ContactValues }
  | { success: false; errors: ContactFieldErrors; formError?: string };

export function validateContact(input: unknown): ContactValidationResult {
  const result = schema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors: ContactFieldErrors = {};
  let formError: string | undefined;
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === "name" || field === "email" || field === "subject" || field === "message") {
      errors[field] ??= issue.message;
    } else {
      formError = "The form contains an unexpected field.";
    }
  }
  return { success: false, errors, formError };
}

export function hasMinimumFillTime(
  startedAt: number,
  now: number,
  minimumMs = 1500,
): boolean {
  return now - startedAt >= minimumMs;
}
