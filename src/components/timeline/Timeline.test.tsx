import { render, screen } from "@testing-library/react";
import { Education } from "../../sections/Education";
import { Experience } from "../../sections/Experience";

describe("portfolio timelines", () => {
  it("renders a single professional internship timeline entry", () => {
    render(<Experience />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Professional Experience" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Syria · Remote")).toBeInTheDocument();
    expect(
      screen.getByText("EARTech Information Technology · Internship"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Academic project")).not.toBeInTheDocument();
  });

  it("renders the exact degree, RISE-MICCAI, and existing certificate content", () => {
    const { container } = render(<Education />);
    expect(screen.getByText("Sep 2021 – Jun 2026")).toBeInTheDocument();
    expect(screen.getByText("Grade: 3.23/4.0")).toBeInTheDocument();
    expect(screen.getByText("RISE-MICCAI Summer School 2025")).toBeInTheDocument();
    expect(screen.getByText("RISE-MICCAI")).toBeInTheDocument();
    expect(screen.getByText("Issued Jul 2025")).toBeInTheDocument();
    expect(
      screen.getByText("6e9ae40f-644f-432e-84de-166fcc490525"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "View details: Bachelor of Engineering, Artificial Intelligence",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "View details: RISE-MICCAI Summer School 2025",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "View details: Artificial Intelligence with Coding & Cybersecurity",
      }),
    ).toBeInTheDocument();

    const text = container.textContent ?? "";
    expect(text.indexOf("Artificial Intelligence with Coding & Cybersecurity")).toBeLessThan(
      text.indexOf("RISE-MICCAI Summer School 2025"),
    );
    expect(text.indexOf("RISE-MICCAI Summer School 2025")).toBeLessThan(
      text.indexOf("Bachelor of Engineering, Artificial Intelligence"),
    );
  });
});
