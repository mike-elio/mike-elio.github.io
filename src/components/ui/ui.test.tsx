import { render, screen } from "@testing-library/react";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import { TagList } from "./TagList";

describe("UI primitives", () => {
  it("renders a safely configured external button link", () => {
    render(
      <ButtonLink href="https://github.com/mike-elio" external>
        GitHub profile
      </ButtonLink>,
    );

    expect(screen.getByRole("link", { name: "GitHub profile" })).toMatchObject({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("connects a section kicker and heading", () => {
    render(
      <SectionHeading id="test-section-title" kicker="01 / About" title="Engineering useful AI." />,
    );
    expect(screen.getByText("01 / About")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Engineering useful AI." }),
    ).toBeInTheDocument();
  });

  it("keeps icons decorative and labels tag lists", () => {
    const { container } = render(
      <>
        <Icon name="brain" />
        <TagList label="Technologies" items={["Python", "FastAPI"]} />
      </>,
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("list", { name: "Technologies" })).toHaveTextContent(
      "PythonFastAPI",
    );
  });
});
