import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { useTypewriter } from "./useTypewriter";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useTypewriter", () => {
  it("types, holds, erases, and advances to the next phrase", async () => {
    const { result } = renderHook(() =>
      useTypewriter(["AI", "ML"], {
        typeMs: 10,
        holdMs: 20,
        eraseMs: 10,
      }),
    );

    await act(() => vi.advanceTimersByTimeAsync(20));
    expect(result.current).toBe("AI");
    await act(() => vi.advanceTimersByTimeAsync(60));
    expect(result.current).toBe("");
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(result.current).toBe("M");
  });

  it("returns stable text when motion is reduced", () => {
    const { result } = renderHook(() =>
      useTypewriter(["AI Engineer", "Backend AI"], { reduced: true }),
    );
    expect(result.current).toBe("AI Engineer");
  });

  it("does not advance timers while the document is hidden", async () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    const { result } = renderHook(() =>
      useTypewriter(["AI"], { typeMs: 10, holdMs: 20, eraseMs: 10 }),
    );
    document.dispatchEvent(new Event("visibilitychange"));
    await act(() => vi.advanceTimersByTimeAsync(100));
    expect(result.current).toBe("");
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });
});
