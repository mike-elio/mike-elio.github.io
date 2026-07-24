import { render, screen, within } from "@testing-library/react";
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

  it("shows four skill groups and qualifies Azure", () => {
    render(<Skills />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText("Microsoft Azure").parentElement).toHaveTextContent(
      "Advancing",
    );
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
    expect(section.getByText("Syria · Remote")).toBeInTheDocument();
    expect(
      section.getByText(
        "Completed a professional training program in Artificial Intelligence, Coding, and Cybersecurity. Built practical skills in Python, network security, secure software development, and hands-on cybersecurity exercises using Hack The Box, while exploring real-world AI applications.",
      ),
    ).toBeInTheDocument();

    for (const skill of [
      "Python (Programming Language)",
      "Front-End Web Development",
      "Laravel",
      "Hack The Box",
      "Artificial Intelligence (AI)",
      "Network Security",
    ]) {
      expect(section.getByText(skill)).toBeInTheDocument();
    }

    expect(section.queryByText("Nahd Graduation Project")).not.toBeInTheDocument();
    expect(section.queryByText("AquaGuard Junior Project")).not.toBeInTheDocument();
    expect(section.queryByRole("link")).not.toBeInTheDocument();
  });
});
