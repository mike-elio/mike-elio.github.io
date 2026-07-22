import { vi } from "vitest";
import { submitContact } from "./submitContact";

const values = {
  name: "Mike Visitor",
  email: "visitor@example.test",
  subject: "AI engineering opportunity",
  message: "I would like to discuss a relevant AI engineering opportunity.",
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("submitContact", () => {
  it("posts only allowed fields and the Turnstile token", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl,
    });

    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://formspree.io/f/testformid");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ Accept: "application/json" });
    const data = init?.body as FormData;
    const entries = [...data.entries()];
    expect(entries).toHaveLength(6);
    expect(entries).toEqual([
      ["name", values.name],
      ["email", values.email],
      ["subject", values.subject],
      ["message", values.message],
      ["_gotcha", ""],
      ["cf-turnstile-response", "verified-token"],
    ]);
  });

  it("classifies 429 without clearing caller state", async () => {
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 429 })),
    });
    expect(result).toEqual({ ok: false, kind: "rate-limited" });
  });

  it("rejects an unexpected successful HTML response", async () => {
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(
        new Response("<html>Unexpected</html>", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }),
      ),
    });
    expect(result).toEqual({ ok: false, kind: "provider-error" });
  });

  it.each(["application/jsonp", "text/plain; profile=application/json"])(
    "rejects a misleading JSON content type: %s",
    async (contentType) => {
      const result = await submitContact({
        values,
        turnstileToken: "verified-token",
        honeypot: "",
        config: { formId: "testformid" },
        fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": contentType },
          }),
        ),
      });
      expect(result).toEqual({ ok: false, kind: "provider-error" });
    },
  );

  it("accepts the JSON media type with parameters", async () => {
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }),
      ),
    });
    expect(result).toEqual({ ok: true });
  });

  it.each([
    ["invalid", "not-json"],
    ["null", "null"],
    ["array", "[]"],
  ])("rejects a successful %s JSON response", async (_description, body) => {
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(body, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    });
    expect(result).toEqual({ ok: false, kind: "provider-error" });
  });

  it("classifies a rejected request as a network error", async () => {
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl: vi.fn<typeof fetch>().mockRejectedValue(new TypeError("Network unavailable")),
    });
    expect(result).toEqual({ ok: false, kind: "network-error" });
  });

  it("aborts a stalled request after the configured timeout", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn<typeof fetch>((_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      }),
    );
    const pending = submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl,
      timeoutMs: 25,
    });
    await vi.advanceTimersByTimeAsync(25);
    await expect(pending).resolves.toEqual({ ok: false, kind: "timeout" });
  });

  it("classifies a plain AbortError from its own timeout", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn<typeof fetch>((_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject({ name: "AbortError" }));
      }),
    );
    const pending = submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl,
      timeoutMs: 25,
    });
    await vi.advanceTimersByTimeAsync(25);
    await expect(pending).resolves.toEqual({ ok: false, kind: "timeout" });
  });

  it("classifies a timeout while reading the JSON response body", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn<typeof fetch>((_input, init) =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ "Content-Type": "application/json" }),
        json: () =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject({ name: "AbortError" }));
          }),
      } as Response),
    );
    const pending = submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl,
      timeoutMs: 25,
    });
    await vi.advanceTimersByTimeAsync(25);
    await expect(pending).resolves.toEqual({ ok: false, kind: "timeout" });
  });

  it("cleans its timeout after a settled request", async () => {
    vi.useFakeTimers();
    const result = await submitContact({
      values,
      turnstileToken: "verified-token",
      honeypot: "",
      config: { formId: "testformid" },
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    });
    expect(result).toEqual({ ok: true });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses runtime-neutral timers without a window global", async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    vi.stubGlobal("window", undefined);
    await expect(
      submitContact({
        values,
        turnstileToken: "verified-token",
        honeypot: "",
        config: { formId: "testformid" },
        fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(response),
      }),
    ).resolves.toEqual({ ok: true });
  });

  it("does not leak a timer when request setup throws", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "FormData",
      class ThrowingFormData {
        constructor() {
          throw new Error("FormData setup failed");
        }
      },
    );
    await expect(
      submitContact({
        values,
        turnstileToken: "verified-token",
        honeypot: "",
        config: { formId: "testformid" },
        fetchImpl: vi.fn<typeof fetch>(),
      }),
    ).resolves.toEqual({ ok: false, kind: "network-error" });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("refuses a malformed form identifier before making a request", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    await expect(
      submitContact({
        values,
        turnstileToken: "verified-token",
        honeypot: "",
        config: { formId: "https://untrusted.test" },
        fetchImpl,
      }),
    ).resolves.toEqual({ ok: false, kind: "provider-error" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
