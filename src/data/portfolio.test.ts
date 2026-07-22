import {
  education,
  experiences,
  profile,
  projects,
  skills,
} from "./portfolio";

describe("portfolio data", () => {
  it("contains the approved identity and section inventory", () => {
    expect(profile.name).toBe("Mike Eliovits");
    expect(profile.roles).toEqual([
      "AI Engineer",
      "LLM Application Builder",
      "NLP & Machine Learning Engineer",
      "Backend AI Developer",
    ]);
    expect(skills).toHaveLength(4);
    expect(experiences).toHaveLength(2);
    expect(projects).toHaveLength(5);
    expect(education).toHaveLength(2);
  });

  it("allows repository actions only for verified public projects", () => {
    const privateProjects = projects.filter(
      (project) => project.visibility === "case-study",
    );
    const publicProjects = projects.filter(
      (project) => project.visibility === "public",
    );

    expect(privateProjects.map((project) => project.title)).toEqual([
      "Nahd AI Coaching Platform",
      "AquaGuard AI",
    ]);
    expect(
      publicProjects.map(({ slug, sourceUrl }) => ({ slug, sourceUrl })),
    ).toEqual([
      {
        slug: "goalpath",
        sourceUrl: "https://github.com/mike-elio/senior",
      },
      {
        slug: "product-task-platform",
        sourceUrl: "https://github.com/mike-elio/project-part2",
      },
      {
        slug: "game-discovery",
        sourceUrl: "https://github.com/mike-elio/game-discovery-platform",
      },
    ]);
  });

  it("contains no email address or unsupported employment wording", () => {
    const serialized = JSON.stringify({
      profile,
      skills,
      experiences,
      projects,
      education,
    });

    expect(serialized).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(serialized).not.toMatch(/employee|full-time|freelance client/i);
    expect(experiences.every((entry) => entry.context === "Academic project")).toBe(
      true,
    );
  });
});
