import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Education } from "../../sections/Education";

describe("Education details", () => {
  it("opens complete degree details and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<Education />);
    const trigger = screen.getByRole("button", {
      name: "View details: Bachelor of Engineering, Artificial Intelligence",
    });

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Bachelor of Engineering, Artificial Intelligence",
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.body).toHaveClass("dialog-open");
    expect(
      screen.getByText(
        "Academic Project Team Member | AI and Machine Learning Research | Technical Documentation and Presentations",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nahd — an intelligent digital coaching/)).toBeInTheDocument();
    expect(screen.getByText(/AquaGuard AI — a machine-learning/)).toBeInTheDocument();
    expect(screen.getByText(/Gained practical experience with Python/)).toBeInTheDocument();
    expect(
      screen.getByRole("list", {
        name: "Bachelor of Engineering, Artificial Intelligence skills",
      }),
    ).toHaveTextContent("Fine-TuningComputer VisionPythonNLP");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(document.body).not.toHaveClass("dialog-open");
    expect(trigger).toHaveFocus();
  });

  it("shows the exact RISE-MICCAI description and named skills", async () => {
    const user = userEvent.setup();
    render(<Education />);

    await user.click(
      screen.getByRole("button", {
        name: "View details: RISE-MICCAI Summer School 2025",
      }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: "RISE-MICCAI Summer School 2025",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Certificate of Completion for attending the RISE-MICCAI Summer School, held from July 14–18, 2025.",
      ),
    ).toBeInTheDocument();
    const skills = screen.getByRole("list", {
      name: "RISE-MICCAI Summer School 2025 skills",
    });
    expect(skills).toHaveTextContent("Artificial Intelligence (AI)");
    expect(skills).toHaveTextContent("Machine Learning");
    expect(skills).toHaveTextContent("Computer Vision");
    expect(skills).toHaveTextContent("Medical Imaging");
    expect(skills.children).toHaveLength(4);
  });

  it("shows the provider, description, and skills for the AI and cybersecurity certificate", async () => {
    const user = userEvent.setup();
    render(<Education />);

    await user.click(
      screen.getByRole("button", {
        name: "View details: Artificial Intelligence with Coding & Cybersecurity",
      }),
    );

    const dialog = await screen.findByRole("dialog", {
        name: "Artificial Intelligence with Coding & Cybersecurity",
      });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText("EARTech Information Technology")).toBeInTheDocument();
    expect(within(dialog).getByText("Issued Sep 2025")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Certificate of completion awarded by EarTech Information Technology for successfully completing a training program focused on artificial intelligence, coding, and cybersecurity.",
      ),
    ).toBeInTheDocument();
    const skills = screen.getByRole("list", {
      name: "Artificial Intelligence with Coding & Cybersecurity skills",
    });
    expect(skills).toHaveTextContent("Artificial Intelligence (AI)");
    expect(skills).toHaveTextContent("Hack the Box");
    expect(skills).toHaveTextContent("Python (Programming Language)");
    expect(skills.children).toHaveLength(3);
  });
});
