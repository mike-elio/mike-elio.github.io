import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Projects } from "../../sections/Projects";

describe("Projects", () => {
  it("renders five fixed projects without a runtime GitHub dependency", () => {
    render(<Projects />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.getByText("Nahd AI Coaching Platform")).toBeInTheDocument();
    expect(screen.getByText("Game Discovery Platform")).toBeInTheDocument();
  });

  it("opens a private case study without a source action and restores focus", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const trigger = screen.getByRole("button", {
      name: "View case study: Nahd AI Coaching Platform",
    });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Nahd AI Coaching Platform",
    });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.queryByRole("link", { name: /source code/i })).not.toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(trigger).toHaveFocus();
  });

  it("shows a safe source link for a public project", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(
      screen.getByRole("button", { name: "View case study: GoalPath Expert System" }),
    );
    expect(screen.getByRole("link", { name: "View source code" })).toMatchObject({
      href: "https://github.com/mike-elio/senior",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("uses a dismissible viewport-modal fallback without showModal", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const trigger = screen.getByRole("button", {
      name: "View case study: Nahd AI Coaching Platform",
    });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", {
      name: "Nahd AI Coaching Platform",
    });
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(dialog).toHaveAttribute("data-dialog-mode", "fallback");
    expect(dialog).toHaveClass("project-dialog--fallback");
    expect(document.body).toHaveClass("dialog-open");

    fireEvent.click(dialog);

    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(document.body).not.toHaveClass("dialog-open");
    expect(trigger).toHaveFocus();
  });

  it("opens the fallback before moving initial focus to its close button", async () => {
    const nativeFocus = HTMLElement.prototype.focus;
    const focus = vi
      .spyOn(HTMLElement.prototype, "focus")
      .mockImplementation(function focusLikeABrowser(
        this: HTMLElement,
        options?: FocusOptions,
      ) {
        const dialog = this.closest("dialog");
        if (dialog && !dialog.hasAttribute("open")) return;
        nativeFocus.call(this, options);
      });

    try {
      const user = userEvent.setup();
      render(<Projects />);
      await user.click(
        screen.getByRole("button", {
          name: "View case study: Nahd AI Coaching Platform",
        }),
      );

      const dialog = screen.getByRole("dialog", {
        name: "Nahd AI Coaching Platform",
      });
      const closeButton = screen.getByRole("button", {
        name: "Close project details",
      });

      expect(dialog).toHaveAttribute("data-dialog-mode", "fallback");
      expect(dialog).toHaveAttribute("open");
      expect(closeButton).toHaveFocus();
    } finally {
      focus.mockRestore();
    }
  });
});
