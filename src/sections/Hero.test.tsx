import { fireEvent, render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders stable identity, actions, social links, and accessible role copy", () => {
    render(<Hero forceReducedMotion />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Mike Eliovits" }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI Backend Engineer", { selector: "[aria-hidden='true']" })).toBeInTheDocument();
    expect(screen.getByText("AI Backend Engineer", { selector: ".sr-only" })).toHaveClass(
      "sr-only",
    );
    expect(screen.getByRole("link", { name: "View My Work" })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: "Let's Talk" })).toHaveAttribute(
      "href",
      "#contact",
    );
    expect(screen.getByAltText("Mike Eliovits")).toHaveAttribute(
      "src",
      "/assets/profile.jpg",
    );
  });

  it("links qualified achievements to their project evidence and omits the removed biography", () => {
    const { container } = render(<Hero forceReducedMotion />);
    expect(screen.getByRole("list", { name: "Selected project achievements" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /94.24% accuracy/ })).toHaveAttribute("href", "#project-fake-image-detector");
    expect(screen.getByRole("link", { name: /0.888 F1/ })).toHaveAttribute("href", "#project-nahd");
    expect(screen.getByRole("link", { name: /250\/250 simulated API sessions/ })).toHaveAttribute("href", "#project-tool-guide");
    expect(container.querySelector("#about")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/GPA|Arab International University|practical, tested solutions/);
  });

  it("retains a branded initials fallback when the portrait fails", () => {
    const { container } = render(<Hero forceReducedMotion />);
    fireEvent.error(screen.getByAltText("Mike Eliovits"));
    expect(screen.queryByAltText("Mike Eliovits")).not.toBeInTheDocument();
    expect(container.querySelector(".portrait-fallback")).toHaveTextContent("ME");
  });
});
