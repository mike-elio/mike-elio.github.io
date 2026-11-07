import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Projects } from "../../sections/Projects";

describe("Project visual evidence", () => {
  it("shows real screenshot previews for the four documented projects", () => {
    render(<Projects />);

    expect(screen.getByRole("img", { name: "Adaptive AI Tool Guide screenshot preview" }))
      .toHaveAttribute("src", "/assets/projects/toolguide-home.webp");
    expect(screen.getByRole("img", { name: "Nahd AI Coaching Platform screenshot preview" }))
      .toHaveAttribute("src", "/assets/projects/nahd-home.webp");
    expect(screen.getByRole("img", { name: "AquaGuard AI screenshot preview" }))
      .toHaveAttribute("src", "/assets/projects/aquaguard-docs.webp");
    expect(screen.getByRole("img", { name: "Fake Image Detector screenshot preview" }))
      .toHaveAttribute("src", "/assets/projects/fake-detector-accuracy.webp");
    expect(screen.queryByRole("img", { name: "Game Discovery Platform screenshot preview" }))
      .not.toBeInTheDocument();
  });

  it("opens a project gallery with clear provenance and linked full-size screenshots", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole("button", {
      name: "View case study: Fake Image Detector",
    }));

    const dialog = screen.getByRole("dialog", { name: "Fake Image Detector" });
    expect(within(dialog).getByRole("heading", { name: "Project visuals & evidence" }))
      .toBeInTheDocument();
    expect(within(dialog).getByText(/historical notebook outputs/i))
      .toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /Final experiment accuracy/i }))
      .toHaveAttribute("href", "/assets/projects/fake-detector-accuracy.webp");
  });

  it("displays an API-only evidence disclaimer for AquaGuard", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole("button", { name: "View case study: AquaGuard AI" }));

    const dialog = screen.getByRole("dialog", { name: "AquaGuard AI" });
    expect(within(dialog).getByText(/rule-based diagnosis/i))
      .toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: /Water quality diagnosis response/i }))
      .toHaveAttribute("src", "/assets/projects/aquaguard-diagnosis.webp");
  });
});
