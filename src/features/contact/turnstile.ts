let pending: Promise<void> | null = null;

export function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    const existing = document.getElementById(
      "turnstile-script",
    ) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    let settled = false;
    const detachListeners = () => {
      script.removeEventListener("load", finish);
      script.removeEventListener("error", fail);
    };
    const settle = (error?: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      detachListeners();
      pending = null;
      if (error) {
        script.remove();
        reject(error);
      } else resolve();
    };
    const finish = () => {
      settle(
        window.turnstile
          ? undefined
          : new Error("Turnstile API was unavailable after loading"),
      );
    };
    const fail = () => {
      settle(new Error("Turnstile could not load"));
    };
    const timeout = window.setTimeout(fail, 10_000);
    script.id = "turnstile-script";
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    if (!existing) document.head.append(script);
  });

  return pending;
}
