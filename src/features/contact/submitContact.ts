import type { ContactValues } from "./contactSchema";

export interface ContactConfig {
  formId: string;
}

export type SubmitContactResult =
  | { ok: true }
  | {
      ok: false;
      kind: "rate-limited" | "timeout" | "network-error" | "provider-error";
    };

export interface SubmitContactArgs {
  values: ContactValues;
  turnstileToken: string;
  honeypot: string;
  config: ContactConfig;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function isJsonMediaType(contentType: string): boolean {
  return contentType.split(";", 1)[0]?.trim().toLowerCase() === "application/json";
}

function isJsonObject(payload: unknown): payload is Record<string, unknown> {
  return payload !== null && typeof payload === "object" && !Array.isArray(payload);
}

export async function submitContact({
  values,
  turnstileToken,
  honeypot,
  config,
  fetchImpl = fetch,
  timeoutMs = 12_000,
}: SubmitContactArgs): Promise<SubmitContactResult> {
  if (!/^[A-Za-z0-9]+$/.test(config.formId)) {
    return { ok: false, kind: "provider-error" };
  }

  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const data = new FormData();
    data.set("name", values.name);
    data.set("email", values.email);
    data.set("subject", values.subject);
    data.set("message", values.message);
    data.set("_gotcha", honeypot);
    data.set("cf-turnstile-response", turnstileToken);

    timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetchImpl(
      `https://formspree.io/f/${encodeURIComponent(config.formId)}`,
      {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    );
    if (response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      if (!isJsonMediaType(contentType)) {
        return { ok: false, kind: "provider-error" };
      }
      try {
        const payload: unknown = await response.json();
        return isJsonObject(payload) ? { ok: true } : { ok: false, kind: "provider-error" };
      } catch {
        return controller.signal.aborted
          ? { ok: false, kind: "timeout" }
          : { ok: false, kind: "provider-error" };
      }
    }
    if (response.status === 429) return { ok: false, kind: "rate-limited" };
    return { ok: false, kind: "provider-error" };
  } catch {
    return controller.signal.aborted
      ? { ok: false, kind: "timeout" }
      : { ok: false, kind: "network-error" };
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}
