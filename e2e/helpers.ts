import type { Page } from "@playwright/test";

export async function installTurnstileMock(page: Page) {
  await page.addInitScript(() => {
    Object.assign(window, {
      turnstile: {
        render: (
          _container: HTMLElement,
          options: { callback: (token: string) => void },
        ) => {
          queueMicrotask(() => options.callback("XXXX.DUMMY.TOKEN.XXXX"));
          return "playwright-widget";
        },
        reset: () => undefined,
        remove: () => undefined,
      },
    });
  });
}

export async function installSaveDataMock(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
}
