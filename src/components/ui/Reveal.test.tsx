import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  it("starts visible when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal>Readable content</Reveal>);
    expect(screen.getByText("Readable content")).toHaveAttribute(
      "data-revealed",
      "true",
    );
    vi.unstubAllGlobals();
  });

  it("reveals once after intersecting", () => {
    let callback: IntersectionObserverCallback = () => undefined;
    const unobserve = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(next: IntersectionObserverCallback) {
          callback = next;
        }
        observe = vi.fn();
        unobserve = unobserve;
        disconnect = vi.fn();
      },
    );
    render(<Reveal>Observed content</Reveal>);
    const element = screen.getByText("Observed content");
    act(() =>
      callback(
        [
          { isIntersecting: true, target: element } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    );
    expect(element).toHaveAttribute("data-revealed", "true");
    expect(unobserve).toHaveBeenCalledWith(element);
    vi.unstubAllGlobals();
  });
});
