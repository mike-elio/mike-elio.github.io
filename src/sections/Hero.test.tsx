import { fireEvent, render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders stable identity, actions, social links, and accessible role copy", () => {
    render(<Hero forceReducedMotion />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Mike Eliovits" }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI Engineer", { selector: "[aria-hidden='true']" })).toBeInTheDocument();
    expect(screen.getByText(/AI Engineer, LLM Application Builder/)).toHaveClass(
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

  it("retains a branded initials fallback when the portrait fails", () => {
    const { container } = render(<Hero forceReducedMotion />);
    fireEvent.error(screen.getByAltText("Mike Eliovits"));
    expect(screen.queryByAltText("Mike Eliovits")).not.toBeInTheDocument();
    expect(container.querySelector(".portrait-fallback")).toHaveTextContent("ME");
  });
});
