import { fireEvent, render, screen, within } from "@testing-library/react";
import { About } from "./About";
import { Experience } from "./Experience";
import { Skills } from "./Skills";

describe("About and Skills", () => {
  it("uses only verified fact labels", () => {
    render(<About />);
    expect(screen.getByText("Class of 2026")).toBeInTheDocument();
    expect(screen.getByText("2 academic AI platforms")).toBeInTheDocument();
    expect(screen.queryByText(/years of experience/i)).not.toBeInTheDocument();
  });

  it("shows compact skills, expands the full list, and omits removed labels", () => {
    render(<Skills />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText("Microsoft Azure")).toBeInTheDocument();
    expect(screen.queryByText("Advancing")).not.toBeInTheDocument();
    expect(screen.queryByText("Feature Engineering")).not.toBeInTheDocument();
    expect(screen.queryByText("Prompt Engineering")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View all skills" }));
    expect(screen.getByText("Prompt Engineering")).toBeInTheDocument();
    expect(screen.queryByText("Feature Engineering")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show core skills" })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Show core skills" }));
    expect(screen.queryByText("Prompt Engineering")).not.toBeInTheDocument();
  });
});

describe("Experience", () => {
  it("renders the approved EARTech internship without links or academic projects", () => {
    const { container } = render(<Experience />);
    const element = container.querySelector("#experience");

    expect(element).not.toBeNull();
    const section = within(element as HTMLElement);

    expect(
      section.getByRole("heading", { name: "Professional Experience" }),
    ).toBeInTheDocument();
    expect(
      section.getByRole("heading", { name: "Backend AI Engineer - Intern" }),
    ).toBeInTheDocument();
    expect(
      section.getByText("FlyRank AI · Internship"),
    ).toBeInTheDocument();
    expect(
      section.getByText("Aug 2026 – Present · Ongoing"),
    ).toBeInTheDocument();
    expect(
      section.getByText("New York City Metropolitan Area · Remote"),
    ).toBeInTheDocument();
    expect(
      section.getByText(
        "Backend AI engineering internship with hands-on work in Python model development, supervised and unsupervised learning, data preprocessing, exploratory analysis, and deployment practices under mentorship. Applying Express.js, SQL, and prompt engineering.",
      ),
    ).toBeInTheDocument();
    expect(section.getByText("Backend AI Engineering")).toBeInTheDocument();
    expect(section.getAllByText("Artificial Intelligence (AI)")).toHaveLength(2);

    expect(
      section.getByRole("heading", {
        name: "Artificial Intelligence with Coding & Cybersecurity",
      }),
    ).toBeInTheDocument();
    expect(
      section.getByText("EARTech Information Technology · Internship"),
    ).toBeInTheDocument();
    expect(
      section.getByText("Aug 2025 – Sep 2025 · 2 mos"),
    ).toBeInTheDocument();
    expect(section.getByText("Istanbul, Türkiye · Remote")).toBeInTheDocument();
    expect(
      section.getByText(
        "Completed 92 hours of practical training in Python, applied AI, web development, cybersecurity, and Microsoft Azure. Completed 5 Hack The Box labs, 4 small projects, and more than 10 coding exercises.",
      ),
    ).toBeInTheDocument();

    for (const skill of [
      "Python (Programming Language)",
      "Front-End Web Development",
      "Hack The Box",
      "Microsoft Azure",
    ]) {
      expect(section.getByText(skill)).toBeInTheDocument();
    }

    expect(section.queryByText("Nahd Graduation Project")).not.toBeInTheDocument();
    expect(section.queryByText("AquaGuard Junior Project")).not.toBeInTheDocument();
    expect(section.queryByRole("link")).not.toBeInTheDocument();
  });
});
