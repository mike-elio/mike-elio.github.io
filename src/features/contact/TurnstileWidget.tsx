import { useEffect, useRef } from "react";
import { loadTurnstile } from "./turnstile";

export function TurnstileWidget({
  siteKey,
  onToken,
  onUnavailable,
  resetSignal,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  onUnavailable: () => void;
  resetSignal: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const apiRef = useRef<TurnstileApi | null>(null);

  useEffect(() => {
    let active = true;
    void loadTurnstile()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        const api = window.turnstile;
        const widgetId = api.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: window.matchMedia?.("(max-width: 374px)")?.matches
            ? "compact"
            : "flexible",
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => {
            onToken("");
            onUnavailable();
          },
          "timeout-callback": () => {
            onToken("");
            onUnavailable();
          },
          "unsupported-callback": () => {
            onToken("");
            onUnavailable();
          },
        });
        if (!active) {
          api.remove(widgetId);
          return;
        }
        apiRef.current = api;
        widgetIdRef.current = widgetId;
      })
      .catch(() => {
        if (active) onUnavailable();
      });

    return () => {
      active = false;
      if (widgetIdRef.current && apiRef.current) {
        apiRef.current.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      apiRef.current = null;
    };
  }, [onToken, onUnavailable, siteKey]);

  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current && apiRef.current) {
      apiRef.current.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  return (
    <div
      aria-label="Human verification"
      className="turnstile-widget"
      ref={containerRef}
      role="group"
    />
  );
}
