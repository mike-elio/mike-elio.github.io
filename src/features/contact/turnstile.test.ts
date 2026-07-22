import { afterEach, vi } from "vitest";

const OFFICIAL_TURNSTILE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function getScript() {
  const script = document.getElementById("turnstile-script");
  expect(script).toBeInstanceOf(HTMLScriptElement);
  return script as HTMLScriptElement;
}

function installApi() {
  window.turnstile = {
    render: vi.fn(() => "widget-1"),
    reset: vi.fn(),
    remove: vi.fn(),
  };
}

async function freshLoader() {
  vi.resetModules();
  return import("./turnstile");
}

afterEach(() => {
  vi.useRealTimers();
  delete window.turnstile;
  document.getElementById("turnstile-script")?.remove();
});

describe("loadTurnstile", () => {
  it("loads the exact official explicit-render URL once for concurrent callers", async () => {
    const { loadTurnstile } = await freshLoader();

    const first = loadTurnstile();
    const second = loadTurnstile();
    const script = getScript();

    expect(first).toBe(second);
    expect(document.querySelectorAll("#turnstile-script")).toHaveLength(1);
    expect(script.src).toBe(OFFICIAL_TURNSTILE_URL);

    installApi();
    script.dispatchEvent(new Event("load"));
    await expect(Promise.all([first, second])).resolves.toEqual([undefined, undefined]);
  });

  it("detaches both listeners after a successful load", async () => {
    const { loadTurnstile } = await freshLoader();
    const result = loadTurnstile();
    const script = getScript();
    const removeListener = vi.spyOn(script, "removeEventListener");

    installApi();
    script.dispatchEvent(new Event("load"));
    await result;

    expect(removeListener).toHaveBeenCalledWith("load", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("error", expect.any(Function));
  });

  it("removes an API-missing script and permits immediate retry", async () => {
    const { loadTurnstile } = await freshLoader();
    const failed = loadTurnstile();
    const failedScript = getScript();
    const removeListener = vi.spyOn(failedScript, "removeEventListener");

    failedScript.dispatchEvent(new Event("load"));
    await expect(failed).rejects.toThrow(
      "Turnstile API was unavailable after loading",
    );
    expect(failedScript).not.toBeInTheDocument();
    expect(removeListener).toHaveBeenCalledWith("load", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("error", expect.any(Function));

    const retry = loadTurnstile();
    const retryScript = getScript();
    expect(retryScript).not.toBe(failedScript);
    installApi();
    retryScript.dispatchEvent(new Event("load"));
    await expect(retry).resolves.toBeUndefined();
  });

  it("removes a timed-out script and detaches both listeners", async () => {
    vi.useFakeTimers();
    const { loadTurnstile } = await freshLoader();
    const failed = loadTurnstile();
    const rejection = expect(failed).rejects.toThrow("Turnstile could not load");
    const script = getScript();
    const removeListener = vi.spyOn(script, "removeEventListener");

    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;

    expect(script).not.toBeInTheDocument();
    expect(removeListener).toHaveBeenCalledWith("load", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("error", expect.any(Function));

    const retry = loadTurnstile();
    const retryScript = getScript();
    expect(retryScript).not.toBe(script);
    installApi();
    retryScript.dispatchEvent(new Event("load"));
    await expect(retry).resolves.toBeUndefined();
  });

  it("removes an errored script, detaches listeners, and permits retry", async () => {
    const { loadTurnstile } = await freshLoader();
    const failed = loadTurnstile();
    const rejection = expect(failed).rejects.toThrow("Turnstile could not load");
    const failedScript = getScript();
    const removeListener = vi.spyOn(failedScript, "removeEventListener");

    failedScript.dispatchEvent(new Event("error"));
    await rejection;

    expect(failedScript).not.toBeInTheDocument();
    expect(removeListener).toHaveBeenCalledWith("load", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("error", expect.any(Function));

    const retry = loadTurnstile();
    expect(getScript()).not.toBe(failedScript);
    const retryScript = getScript();
    installApi();
    retryScript.dispatchEvent(new Event("load"));
    await expect(retry).resolves.toBeUndefined();
  });
});
