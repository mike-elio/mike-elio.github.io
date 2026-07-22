import { render, screen } from "@testing-library/react";
import { Education } from "../../sections/Education";
import { Experience } from "../../sections/Experience";

describe("portfolio timelines", () => {
  it("labels project work as academic and keeps chronological DOM order", () => {
    const { container } = render(<Experience />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Academic Project Experience" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Academic project")).toHaveLength(2);
    expect(screen.getByText("Collaborative university project")).toBeInTheDocument();

    const text = container.textContent ?? "";
    expect(text.indexOf("Nahd Graduation Project")).toBeLessThan(
      text.indexOf("AquaGuard Junior Project"),
    );
  });

  it("renders the degree and exact certificate credential", () => {
    const { container } = render(<Education />);
    expect(screen.getByText("Class of 2026")).toBeInTheDocument();
    expect(
      screen.getByText("6e9ae40f-644f-432e-84de-166fcc490525"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/grade|honors|distinction/i)).not.toBeInTheDocument();

    const text = container.textContent ?? "";
    expect(text.indexOf("Artificial Intelligence with Coding & Cybersecurity")).toBeLessThan(
      text.indexOf("Bachelor's Degree in Informatics and Artificial Intelligence"),
    );
  });
});
