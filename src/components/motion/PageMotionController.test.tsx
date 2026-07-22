import { act, render } from "@testing-library/react";
import { vi } from "vitest";
import { PageMotionController } from "./PageMotionController";

describe("PageMotionController", () => {
  it("pauses root motion when the document is hidden", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<PageMotionController />);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(document.documentElement).toHaveAttribute("data-page-visibility", "hidden");
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    vi.unstubAllGlobals();
  });
});
