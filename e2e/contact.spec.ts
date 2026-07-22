import { expect, test, type Page, type Request } from "@playwright/test";
import { installTurnstileMock } from "./helpers";

const formValues = {
  name: "Mike Visitor",
  email: "visitor@example.test",
  subject: "AI engineering opportunity",
  message: "I would like to discuss a relevant AI engineering opportunity.",
} as const;
const expectedFormspreeFormId =
  process.env.EXPECTED_FORMSPREE_FORM_ID?.trim() || "testformid";

async function fillForm(page: Page) {
  await page.getByLabel("Name").fill(formValues.name);
  await page.getByLabel("Email").fill(formValues.email);
  await page.getByLabel("Subject").fill(formValues.subject);
  await page.getByLabel("Message").fill(formValues.message);
}

function multipartFields(request: Request): Record<string, string> {
  const contentType = request.headers()["content-type"];
  const boundary = contentType?.match(/boundary=(.+)$/)?.[1];
  const body = request.postData();
  expect(contentType).toMatch(/^multipart\/form-data; boundary=/);
  expect(boundary).toBeTruthy();
  expect(body).not.toBeNull();

  const entries = body!
    .split(`--${boundary}`)
    .map((part) =>
      part.match(
        /^\r\nContent-Disposition: form-data; name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/,
      ),
    )
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => [match[1], match[2]] as const);
  return Object.fromEntries(entries);
}

async function makeFormOldEnough(page: Page) {
  await page.clock.install({ time: new Date("2026-07-22T12:00:00Z") });
}

test.beforeEach(async ({ page }) => {
  await installTurnstileMock(page);
});

test("keyboard validation focuses the first invalid contact field", async ({
  page,
}) => {
  await makeFormOldEnough(page);
  await page.goto("/#contact");
  await page.clock.fastForward(1_500);

  await page.getByRole("button", { name: "Send message" }).focus();
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Name")).toBeFocused();
  await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Check the highlighted fields and try again.")).toBeVisible();
});

test("submits only the allowlisted payload and reports confirmed success", async ({
  page,
}) => {
  await makeFormOldEnough(page);
  let interceptedRequest: Request | undefined;
  await page.route("https://formspree.io/f/**", async (route) => {
    interceptedRequest = route.request();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  await page.goto("/#contact");
  await fillForm(page);
  await page.clock.fastForward(1_500);
  await page.getByRole("button", { name: "Send message" }).click();

  const success = page.getByText("Thanks — your message was sent successfully.");
  await expect(success).toBeFocused();
  await expect(page.getByLabel("Message")).toHaveValue("");
  expect(interceptedRequest).toBeDefined();
  expect(interceptedRequest!.method()).toBe("POST");
  expect(interceptedRequest!.url()).toBe(
    `https://formspree.io/f/${expectedFormspreeFormId}`,
  );
  expect(await interceptedRequest!.headerValue("accept")).toBe("application/json");

  const fields = multipartFields(interceptedRequest!);
  expect(Object.keys(fields).sort()).toEqual(
    [
      "_gotcha",
      "cf-turnstile-response",
      "email",
      "message",
      "name",
      "subject",
    ].sort(),
  );
  expect(fields).toEqual({
    ...formValues,
    _gotcha: "",
    "cf-turnstile-response": "XXXX.DUMMY.TOKEN.XXXX",
  });
  expect(JSON.stringify(fields)).not.toContain("github_token");
});

test("preserves visitor input and focuses status after provider failure", async ({
  page,
}) => {
  await makeFormOldEnough(page);
  let interceptedRequests = 0;
  await page.route("https://formspree.io/f/**", async (route) => {
    interceptedRequests += 1;
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: '{"error":"unavailable"}',
    });
  });
  await page.goto("/#contact");
  await fillForm(page);
  await page.clock.fastForward(1_500);
  await page.getByRole("button", { name: "Send message" }).click();

  const failure = page.getByText(/could not be sent/i);
  await expect(failure).toBeFocused();
  await expect(page.getByRole("button", { name: "Retry message" })).toBeEnabled();
  await expect(page.getByLabel("Name")).toHaveValue(formValues.name);
  await expect(page.getByLabel("Email")).toHaveValue(formValues.email);
  await expect(page.getByLabel("Subject")).toHaveValue(formValues.subject);
  await expect(page.getByLabel("Message")).toHaveValue(formValues.message);
  expect(interceptedRequests).toBe(1);
});
