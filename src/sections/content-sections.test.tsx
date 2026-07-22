import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { Skills } from "./Skills";

describe("About and Skills", () => {
  it("uses only verified fact labels", () => {
    render(<About />);
    expect(screen.getByText("Class of 2026")).toBeInTheDocument();
    expect(screen.getByText("2 academic AI platforms")).toBeInTheDocument();
    expect(screen.queryByText(/years of experience/i)).not.toBeInTheDocument();
  });

  it("shows four skill groups and qualifies Azure", () => {
    render(<Skills />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText("Microsoft Azure").parentElement).toHaveTextContent(
      "Advancing",
    );
  });
});
