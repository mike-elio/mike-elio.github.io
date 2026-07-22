import { fireEvent, render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, vi } from "vitest";
import { TurnstileWidget } from "./TurnstileWidget";

afterEach(() => {
  delete window.turnstile;
  document.getElementById("turnstile-script")?.remove();
  vi.unstubAllGlobals();
});

describe("TurnstileWidget", () => {
  it("passes tokens without logging or exposing a secret", async () => {
    const onToken = vi.fn();
    const remove = vi.fn();
    window.turnstile = {
      render: vi.fn((_container, options) => {
        options.callback("browser-token");
        return "widget-1";
      }),
      reset: vi.fn(),
      remove,
    };
    const { unmount } = render(
      <TurnstileWidget
        onToken={onToken}
        onUnavailable={vi.fn()}
        resetSignal={0}
        siteKey="1x00000000000000000000AA"
      />,
    );
    await waitFor(() => expect(onToken).toHaveBeenCalledWith("browser-token"));
    unmount();
    expect(remove).toHaveBeenCalledWith("widget-1");
  });

  it("reports widget errors and clears the token", async () => {
    const onToken = vi.fn();
    const onUnavailable = vi.fn();
    window.turnstile = {
      render: vi.fn((_container, options) => {
        options["error-callback"]();
        return "widget-2";
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };
    render(
      <TurnstileWidget
        onToken={onToken}
        onUnavailable={onUnavailable}
        resetSignal={0}
        siteKey="1x00000000000000000000AA"
      />,
    );
    await waitFor(() => expect(onUnavailable).toHaveBeenCalledOnce());
    expect(onToken).toHaveBeenCalledWith("");
  });

  it("uses the compact widget below 375px", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const renderWidget = vi.fn(() => "widget-compact");
    window.turnstile = { render: renderWidget, reset: vi.fn(), remove: vi.fn() };
    render(
      <TurnstileWidget
        onToken={vi.fn()}
        onUnavailable={vi.fn()}
        resetSignal={0}
        siteKey="1x00000000000000000000AA"
      />,
    );
    await waitFor(() =>
      expect(renderWidget).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ size: "compact" }),
      ),
    );
  });

  it("reports an unavailable challenge script", async () => {
    const onUnavailable = vi.fn();
    render(
      <TurnstileWidget
        onToken={vi.fn()}
        onUnavailable={onUnavailable}
        resetSignal={0}
        siteKey="1x00000000000000000000AA"
      />,
    );
    const script = document.getElementById("turnstile-script");
    expect(script).not.toBeNull();
    fireEvent.error(script!);
    await waitFor(() => expect(onUnavailable).toHaveBeenCalledOnce());
  });

  it("removes a widget returned after a synchronous callback unmounts it", async () => {
    let unmount: () => void = () => undefined;
    const remove = vi.fn();
    window.turnstile = {
      render: vi.fn((_container, options) => {
        options.callback("sync-token");
        return "widget-after-unmount";
      }),
      reset: vi.fn(),
      remove,
    };

    const view = render(
      <TurnstileWidget
        onToken={() => unmount()}
        onUnavailable={vi.fn()}
        resetSignal={0}
        siteKey="1x00000000000000000000AA"
      />,
    );
    unmount = view.unmount;

    await waitFor(() =>
      expect(remove).toHaveBeenCalledWith("widget-after-unmount"),
    );
  });

  it("does not leak widgets across StrictMode effect replay", async () => {
    const remove = vi.fn();
    const renderedIds: string[] = [];
    window.turnstile = {
      render: vi.fn(() => {
        const id = `strict-widget-${renderedIds.length + 1}`;
        renderedIds.push(id);
        return id;
      }),
      reset: vi.fn(),
      remove,
    };

    const { unmount } = render(
      <StrictMode>
        <TurnstileWidget
          onToken={vi.fn()}
          onUnavailable={vi.fn()}
          resetSignal={0}
          siteKey="1x00000000000000000000AA"
        />
      </StrictMode>,
    );
    await waitFor(() => expect(renderedIds.length).toBeGreaterThan(0));
    unmount();

    for (const id of renderedIds) {
      expect(remove).toHaveBeenCalledWith(id);
    }
  });

  it.each([
    ["expired-callback", false],
    ["timeout-callback", true],
    ["unsupported-callback", true],
  ] as const)("clears tokens for %s", async (callbackName, reportsUnavailable) => {
    let options: TurnstileRenderOptions | undefined;
    const onToken = vi.fn();
    const onUnavailable = vi.fn();
    window.turnstile = {
      render: vi.fn((_container, nextOptions) => {
        options = nextOptions;
        return "widget-callbacks";
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };
    render(
      <TurnstileWidget
        onToken={onToken}
        onUnavailable={onUnavailable}
        resetSignal={0}
        siteKey="1x00000000000000000000AA"
      />,
    );
    await waitFor(() => expect(options).toBeDefined());

    options?.[callbackName]();

    expect(onToken).toHaveBeenCalledWith("");
    expect(onUnavailable).toHaveBeenCalledTimes(reportsUnavailable ? 1 : 0);
  });
});
