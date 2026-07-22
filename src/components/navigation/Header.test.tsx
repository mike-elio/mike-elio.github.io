import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";
import { Header } from "./Header";

let intersectionCallback: IntersectionObserverCallback;
let intersectionDisconnect: ReturnType<typeof vi.fn>;
let desktopMediaListener: ((event: MediaQueryListEvent) => void) | undefined;
let removeDesktopMediaListener: ReturnType<typeof vi.fn>;

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
    intersectionDisconnect = this.disconnect;
  }
}

function renderHeader() {
  return render(
    <>
      <button type="button">Before navigation</button>
      <Header />
      <main>
        <section id="about">About</section>
        <section id="skills">Skills</section>
        <section id="experience">Experience</section>
        <section id="projects">Projects</section>
        <section id="education">Education</section>
        <section id="contact">Contact</section>
        <button type="button">After navigation</button>
      </main>
    </>,
  );
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  removeDesktopMediaListener = vi.fn();
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(
      (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        desktopMediaListener = listener;
      },
    ),
    removeEventListener: removeDesktopMediaListener,
  })));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Header", () => {
  it("opens the mobile navigation, traps focus, and closes on Escape", async () => {
    const user = userEvent.setup();
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation" });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "Site navigation" });
    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByRole("button", { name: "Close navigation" }),
    ).toHaveFocus();
    expect(document.body).toHaveClass("navigation-open");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveClass("navigation-open");

    const outside = screen.getByRole("button", { name: "After navigation" });
    outside.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(outside).toHaveFocus();
  });

  it("keeps the most visible section across sequential observer callbacks", () => {
    renderHeader();
    const projects = document.getElementById("projects");
    const skills = document.getElementById("skills");
    expect(projects).not.toBeNull();
    expect(skills).not.toBeNull();

    act(() => {
      intersectionCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.8,
            target: projects,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(
      screen.getAllByRole("link", { name: "Projects" })[0],
    ).toHaveAttribute("aria-current", "location");

    act(() => {
      intersectionCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.3,
            target: skills,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(
      screen.getAllByRole("link", { name: "Projects" })[0],
    ).toHaveAttribute("aria-current", "location");

    act(() => {
      intersectionCallback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0,
            target: projects,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getAllByRole("link", { name: "Skills" })[0]).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("wraps focus forward from the last drawer link", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const dialog = screen.getByRole("dialog", { name: "Site navigation" });
    const close = within(dialog).getByRole("button", {
      name: "Close navigation",
    });
    within(dialog).getByRole("link", { name: "Contact" }).focus();

    await user.tab();

    expect(close).toHaveFocus();
  });

  it("wraps focus backward from the first drawer control", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const dialog = screen.getByRole("dialog", { name: "Site navigation" });

    await user.tab({ shift: true });

    expect(within(dialog).getByRole("link", { name: "Contact" })).toHaveFocus();
  });

  it("recovers focus from outside the drawer in both tab directions", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const dialog = screen.getByRole("dialog", { name: "Site navigation" });
    const close = within(dialog).getByRole("button", {
      name: "Close navigation",
    });
    const last = within(dialog).getByRole("link", { name: "Contact" });

    screen.getByRole("button", { name: "After navigation" }).focus();
    await user.tab();
    expect(close).toHaveFocus();

    screen.getByRole("button", { name: "Before navigation" }).focus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it("closes the drawer when a navigation link is selected", async () => {
    const user = userEvent.setup();
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    await user.click(trigger);
    await user.click(screen.getAllByRole("link", { name: "About" }).at(-1)!);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the drawer at the desktop breakpoint and cleans up its listener", async () => {
    const user = userEvent.setup();
    const { unmount } = renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    await user.click(trigger);

    act(() => {
      desktopMediaListener?.({ matches: true } as MediaQueryListEvent);
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveClass("navigation-open");
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Mike Eliovits, home" })).toHaveFocus();
    });

    unmount();
    expect(removeDesktopMediaListener).toHaveBeenCalledOnce();
  });

  it("cleans up the drawer state and observer on unmount", async () => {
    const user = userEvent.setup();
    const { unmount } = renderHeader();
    await user.click(screen.getByRole("button", { name: "Open navigation" }));

    unmount();

    expect(document.body).not.toHaveClass("navigation-open");
    expect(intersectionDisconnect).toHaveBeenCalledOnce();
  });
});
