import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { ContactForm } from "./ContactForm";

afterEach(() => {
  vi.useRealTimers();
  delete window.turnstile;
});

function installPassingTurnstile() {
  window.turnstile = {
    render: vi.fn((_container, options) => {
      options.callback("verified-token");
      return "widget-1";
    }),
    reset: vi.fn(),
    remove: vi.fn(),
  };
}

function installControlledTurnstile(initialToken?: string) {
  let options: TurnstileRenderOptions | undefined;
  window.turnstile = {
    render: vi.fn((_container, nextOptions) => {
      options = nextOptions;
      if (initialToken) nextOptions.callback(initialToken);
      return "widget-controlled";
    }),
    reset: vi.fn(),
    remove: vi.fn(),
  };
  return () => options;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Mike Visitor");
  await user.type(screen.getByLabelText("Email"), "visitor@example.test");
  await user.type(screen.getByLabelText("Subject"), "AI engineering opportunity");
  await user.type(
    screen.getByLabelText("Message"),
    "I would like to discuss a relevant AI engineering opportunity.",
  );
}

describe("ContactForm", () => {
  it("submits once, clears fields, resets Turnstile, and reports success", async () => {
    installPassingTurnstile();
    const submitter = vi.fn().mockResolvedValue({ ok: true });
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    await waitFor(() => expect(window.turnstile?.render).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(submitter).toHaveBeenCalledOnce());
    expect(
      await screen.findByText("Thanks — your message was sent successfully."),
    ).toHaveFocus();
    expect(screen.getByLabelText("Message")).toHaveValue("");
    await waitFor(() =>
      expect(window.turnstile?.reset).toHaveBeenCalledWith("widget-1"),
    );
  });

  it("focuses the first invalid field and makes no request", async () => {
    installPassingTurnstile();
    const submitter = vi.fn();
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={() => 2_000}
        submitter={submitter}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByLabelText("Name")).toHaveFocus();
    expect(submitter).not.toHaveBeenCalled();
  });

  it("preserves entered values after a provider failure", async () => {
    installPassingTurnstile();
    const submitter = vi
      .fn()
      .mockResolvedValue({ ok: false, kind: "provider-error" });
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/could not be sent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry message" })).toBeEnabled();
    await waitFor(() =>
      expect(window.turnstile?.reset).toHaveBeenCalledWith("widget-1"),
    );
    expect(screen.getByLabelText("Message")).toHaveValue(
      "I would like to discuss a relevant AI engineering opportunity.",
    );
  });

  it("rejects an immediate automated-looking submission", async () => {
    installPassingTurnstile();
    const submitter = vi.fn();
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(100);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(
      await screen.findByText("Please wait a moment before sending."),
    ).toHaveFocus();
    expect(submitter).not.toHaveBeenCalled();
  });

  it("disables the submit action while one request is pending", async () => {
    installPassingTurnstile();
    let resolveRequest: (value: { ok: true }) => void = () => undefined;
    const submitter = vi.fn(
      () =>
        new Promise<{ ok: true }>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    const button = screen.getByRole("button", { name: "Send message" });
    await user.click(button);
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Sending…" }));
    expect(submitter).toHaveBeenCalledOnce();
    await act(async () => resolveRequest({ ok: true }));
    await screen.findByText("Thanks — your message was sent successfully.");
  });

  it("requires a challenge token before submitting", async () => {
    installControlledTurnstile();
    const submitter = vi.fn();
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(
      await screen.findByText("Please complete human verification before sending."),
    ).toHaveFocus();
    expect(submitter).not.toHaveBeenCalled();
  });

  it("holds a rate-limited submission in cooldown for 30 seconds", async () => {
    installPassingTurnstile();
    const submitter = vi
      .fn()
      .mockResolvedValue({ ok: false, kind: "rate-limited" });
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    vi.useFakeTimers();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Send message" }));
      await Promise.resolve();
    });

    expect(screen.getByRole("button", { name: "Please wait" })).toBeDisabled();
    expect(
      screen.getByText("Too many attempts were received. Please wait before trying again."),
    ).toHaveFocus();
    expect(screen.getByLabelText("Message")).not.toHaveValue("");
    expect(window.turnstile?.reset).toHaveBeenCalledWith("widget-1");

    act(() => vi.advanceTimersByTime(29_999));
    expect(screen.getByRole("button", { name: "Please wait" })).toBeDisabled();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("passes only the exact reviewed submission arguments", async () => {
    installPassingTurnstile();
    const submitter = vi.fn().mockResolvedValue({ ok: true });
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    fireEvent.change(document.getElementById("contact-company")!, {
      target: { value: "bot-trap-value" },
    });
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(submitter).toHaveBeenCalledOnce());
    expect(submitter).toHaveBeenCalledWith({
      values: {
        name: "Mike Visitor",
        email: "visitor@example.test",
        subject: "AI engineering opportunity",
        message: "I would like to discuss a relevant AI engineering opportunity.",
      },
      turnstileToken: "verified-token",
      honeypot: "bot-trap-value",
      config: { formId: "testformid" },
    });
  });

  it("locks duplicate submit events before React can render pending state", async () => {
    installPassingTurnstile();
    const resolvers: Array<(value: { ok: true }) => void> = [];
    const submitter = vi.fn(
      () =>
        new Promise<{ ok: true }>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    const form = screen.getByRole("button", { name: "Send message" }).closest("form")!;

    act(() => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(submitter).toHaveBeenCalledOnce();
    await act(async () => {
      for (const resolve of resolvers) resolve({ ok: true });
    });
  });

  it("keeps the visual and synchronous lock through challenge callbacks", async () => {
    const getOptions = installControlledTurnstile("verified-token");
    let resolveRequest: (value: { ok: false; kind: "provider-error" }) => void =
      () => undefined;
    const submitter = vi.fn(
      () =>
        new Promise<{ ok: false; kind: "provider-error" }>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    const form = screen.getByRole("button", { name: "Send message" }).closest("form")!;
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();

    act(() => {
      getOptions()?.["timeout-callback"]();
      getOptions()?.callback("replacement-token");
    });

    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
    act(() => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(submitter).toHaveBeenCalledOnce();

    await act(async () => resolveRequest({ ok: false, kind: "provider-error" }));
  });

  it("suppresses pending request continuation after unmount", async () => {
    installPassingTurnstile();
    let resolveRequest: (value: { ok: true }) => void = () => undefined;
    const submitter = vi.fn(
      () =>
        new Promise<{ ok: true }>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const now = vi.fn().mockReturnValueOnce(0).mockReturnValue(2_000);
    const user = userEvent.setup();
    const { unmount } = render(
      <ContactForm
        config={{ formId: "testformid", siteKey: "1x00000000000000000000AA" }}
        now={now}
        submitter={submitter}
      />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(submitter).toHaveBeenCalledOnce();
    unmount();
    const timeout = vi.spyOn(window, "setTimeout");

    await act(async () => resolveRequest({ ok: true }));

    expect(timeout).not.toHaveBeenCalledWith(expect.any(Function), 10_000);
  });
});
