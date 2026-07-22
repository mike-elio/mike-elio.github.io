import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { installSaveDataMock, installTurnstileMock } from "./helpers";

const sectionIds = [
  "top",
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "contact",
] as const;

const viewportWidths = [1440, 1024, 768, 390, 320] as const;

async function blockingAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
}

test.beforeEach(async ({ page }) => {
  await installTurnstileMock(page);
});

test("renders every portfolio section in semantic order without browser errors", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Mike Eliovits" }),
  ).toBeVisible();
  await expect(page.locator("main > section")).toHaveCount(sectionIds.length);
  expect(
    await page.locator("main > section").evaluateAll((sections) =>
      sections.map((section) => section.id),
    ),
  ).toEqual(sectionIds);
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(6);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("desktop navigation reaches each section from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await expect(navigation).toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();

  const projects = navigation.getByRole("link", { name: "Projects" });
  await projects.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page.locator("main")).toBeFocused();
  await expect(page).toHaveURL(/#main$/);
});

test("responsive layouts have no horizontal overflow at supported widths", async ({
  page,
}) => {
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `${width}px viewport overflow`).toBeLessThanOrEqual(1);

    const desktopNavigation = page.getByRole("navigation", {
      name: "Primary navigation",
    });
    const mobileTrigger = page.getByRole("button", {
      name: "Open navigation",
    });
    if (width >= 900) {
      await expect(desktopNavigation).toBeVisible();
      await expect(mobileTrigger).toBeHidden();
    } else {
      await expect(desktopNavigation).toBeHidden();
      await expect(mobileTrigger).toBeVisible();
    }
  }
});

test("mobile navigation and the 320px contact layout remain keyboard usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Contact" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  const viewportWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  // The clipped, aria-hidden anti-bot honeypot is intentionally not a user
  // control. Its intrinsically sized child must not dilute these strict bounds
  // checks for every visible field and action a visitor can operate.
  const userOperableControls = page.locator(
    ".contact-form .form-field input, .contact-form .form-field textarea, .contact-form > button",
  );
  for (const control of await userOperableControls.all()) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  }
});

test("private project dialog traps keyboard focus and restores its trigger", async ({
  page,
}) => {
  await page.goto("/#projects");
  const trigger = page.getByRole("button", {
    name: "View case study: Nahd AI Coaching Platform",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", {
    name: "Nahd AI Coaching Platform",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(
    dialog.getByRole("button", { name: "Close project details" }),
  ).toBeFocused();
  await expect(dialog.getByRole("link", { name: "View source code" })).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close project details" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("reduced-motion preference removes continuous ambient animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".ambient-bubble").first()).toHaveCSS(
    "display",
    "none",
  );
  await expect(page.locator(".orbit").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("save-data preference uses the reduced-motion presentation", async ({ page }) => {
  await installSaveDataMock(page);
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".ambient-bubble").first()).toHaveCSS(
    "display",
    "none",
  );
});

test("has no serious or critical automated accessibility findings", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  expect(await blockingAxeViolations(page)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  expect(await blockingAxeViolations(page)).toEqual([]);
  await page.keyboard.press("Escape");

  const trigger = page.getByRole("button", {
    name: "View case study: Nahd AI Coaching Platform",
  });
  await trigger.click();
  expect(await blockingAxeViolations(page)).toEqual([]);
});
