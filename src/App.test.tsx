import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { App } from "./App";

vi.mock("./features/contact/TurnstileWidget", () => ({
  TurnstileWidget: () => <div aria-label="Human verification" />,
}));

describe("App", () => {
  it("assembles one accessible document in the approved section order", () => {
    const { container } = render(<App />);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("heading", { level: 1, name: "Mike Eliovits" })).toBeInTheDocument();

    const sectionIds = Array.from(container.querySelectorAll("main > section")).map(
      (section) => section.id,
    );
    expect(sectionIds).toEqual([
      "top",
      "about",
      "skills",
      "experience",
      "projects",
      "education",
      "contact",
    ]);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.textContent).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  });

  it("renders the current year and safe professional links", () => {
    render(<App />);
    expect(
      screen.getByText(new RegExp(`© ${String(new Date().getFullYear())}`)),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: /GitHub|LinkedIn/ })) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
