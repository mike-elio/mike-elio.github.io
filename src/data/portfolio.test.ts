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
    expect(experiences).toHaveLength(1);
    expect(projects).toHaveLength(4);
    expect(education).toHaveLength(3);
  });

  it("links verified public projects to their repositories", () => {
    const privateProjects = projects.filter(
      (project) => project.visibility === "case-study",
    );
    const publicProjects = projects.filter(
      (project) => project.visibility === "public",
    );

    expect(privateProjects).toEqual([]);
    expect(
      publicProjects.map(({ slug, sourceUrl }) => ({ slug, sourceUrl })),
    ).toEqual([
      {
        slug: "nahd",
        sourceUrl: "https://github.com/mike-elio/Nahd-AI-Coaching-Platform",
      },
      {
        slug: "aquaguard",
        sourceUrl: "https://github.com/mike-elio/AquaGuard-AI",
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

  it("shows Nahd's verified AI stack without RAG", () => {
    const nahd = projects.find((project) => project.slug === "nahd");
    const skillLabels = skills.flatMap((group) =>
      group.items.map((item) => item.label),
    );

    expect(nahd).toMatchObject({
      description:
        "Nahd is an AI coaching platform that combines FastAPI, LLMs, NLP, Computer Vision, Machine Learning, and Expert Systems to deliver guided, validated learning workflows.",
      technologies: [
        "Python",
        "JavaScript",
        "FastAPI",
        "Large Language Models (LLM)",
        "Computer Vision",
        "Natural Language Processing (NLP)",
        "HTML5",
        "Ollama",
        "Software Development Life Cycle (SDLC)",
        "Machine Learning",
        "Expert Systems",
        "Validation Processing",
      ],
    });
    expect(skillLabels).toEqual(
      expect.arrayContaining([
        "JavaScript",
        "Validation Processing",
        "FastAPI",
        "Large Language Models (LLM)",
        "Computer Vision",
        "Natural Language Processing (NLP)",
        "HTML5",
        "Ollama",
        "Software Development Life Cycle (SDLC)",
        "Machine Learning",
        "Data Preprocessing",
        "Expert Systems",
      ]),
    );
    expect(JSON.stringify({ nahd, skills })).not.toContain("RAG");
  });

  it("contains the approved professional internship without unsupported wording", () => {
    const serialized = JSON.stringify({
      profile,
      skills,
      experiences,
      projects,
      education,
    });

    expect(serialized).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(serialized).not.toMatch(/employee|full-time|freelance client/i);
    expect(experiences[0]).toMatchObject({
      title: "Artificial Intelligence with Coding & Cybersecurity",
      organization: "EARTech Information Technology",
      employmentType: "Internship",
      location: "Syria",
      workArrangement: "Remote",
    });
  });
});
