# Professional Experience Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two academic-project entries in Experience with one text-only EARTech internship entry while leaving Projects unchanged.

**Architecture:** Keep `src/data/portfolio.ts` as the source of truth, but generalize its `Experience` interface from academic-project fields to professional-experience fields. Adapt `src/sections/Experience.tsx` into the existing generic `Timeline` interface, preserving the current responsive visual system and introducing no links, images, or dependencies.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, Testing Library

## Global Constraints

- Render exactly one Experience entry.
- Do not add external links or a logo.
- Keep the separate Projects section and its data unchanged.
- Use the approved English copy from the design specification.
- Preserve the existing Timeline component and responsive styling.
- Add no dependencies.

---

### Task 1: Render the EARTech professional internship

**Files:**
- Modify: `src/sections/content-sections.test.tsx`
- Modify: `src/data/portfolio.ts`
- Modify: `src/sections/Experience.tsx`
- Verify unchanged: `src/sections/Projects.tsx`

**Interfaces:**
- Produces: `Experience` with `title`, `organization`, `employmentType`, `date`, `duration`, `location`, `workArrangement`, `summary`, and `skills`.
- Consumes: `TimelineEntry` from `src/components/timeline/Timeline.tsx`; no changes to that interface.
- Maps: role → `TimelineEntry.title`; organization/type → `subtitle`; date/duration → `date`; location/arrangement → `context`; description → `summary`; skills → `tags`.

- [ ] **Step 1: Write the failing Experience test**

Update the imports and add this test to `src/sections/content-sections.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- src/sections/content-sections.test.tsx
```

Expected: FAIL because the Experience section still renders `Academic Project Experience` and does not contain the EARTech internship.

- [ ] **Step 3: Generalize the Experience model and replace its data**

Replace the `Experience` interface in `src/data/portfolio.ts` with:

```ts
export interface Experience {
  title: string;
  organization: string;
  employmentType: string;
  date: string;
  duration: string;
  location: string;
  workArrangement: string;
  summary: string;
  skills: readonly string[];
}
```

Replace the complete `experiences` array with:

```ts
export const experiences: readonly Experience[] = [
  {
    title: "Artificial Intelligence with Coding & Cybersecurity",
    organization: "EARTech Information Technology",
    employmentType: "Internship",
    date: "Aug 2025 – Sep 2025",
    duration: "2 mos",
    location: "Syria",
    workArrangement: "Remote",
    summary:
      "Completed a professional training program in Artificial Intelligence, Coding, and Cybersecurity. Built practical skills in Python, network security, secure software development, and hands-on cybersecurity exercises using Hack The Box, while exploring real-world AI applications.",
    skills: [
      "Python (Programming Language)",
      "Front-End Web Development",
      "Laravel",
      "Hack The Box",
      "Artificial Intelligence (AI)",
      "Network Security",
    ],
  },
];
```

Do not modify the adjacent `projects` array.

- [ ] **Step 4: Adapt the Experience section to the professional fields**

Replace `src/sections/Experience.tsx` with:

```tsx
import { Timeline, type TimelineEntry } from "../components/timeline/Timeline";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { experiences } from "../data/portfolio";

const items: readonly TimelineEntry[] = experiences.map((entry, index) => ({
  id: `experience-${index + 1}`,
  title: entry.title,
  subtitle: `${entry.organization} · ${entry.employmentType}`,
  date: `${entry.date} · ${entry.duration}`,
  context: `${entry.location} · ${entry.workArrangement}`,
  summary: entry.summary,
  tags: entry.skills,
}));

export function Experience() {
  return (
    <section aria-labelledby="experience-title" className="section" id="experience">
      <Reveal>
        <SectionHeading
          id="experience-title"
          kicker="03 / Experience"
          title="Professional Experience"
          intro="Professional training across artificial intelligence, software development, and cybersecurity."
        />
      </Reveal>
      <Timeline items={items} label="Professional experience timeline" />
    </section>
  );
}
```

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
npm test -- src/sections/content-sections.test.tsx
```

Expected: PASS for all tests in `content-sections.test.tsx`.

- [ ] **Step 6: Run repository-wide verification**

Run:

```bash
npm run verify
```

Expected: lint, typecheck, unit tests, production build, contract checks, bundle checks, and Playwright browser tests all complete successfully.

- [ ] **Step 7: Inspect the production build**

Serve the generated `dist/` using the repository's existing preview or E2E server and confirm:

- The Experience navigation target opens a single EARTech card.
- The card is readable on desktop and mobile widths.
- No title, chip, or metadata overflows.
- The Projects section still contains all existing project cards.
- No Experience content is clickable.

- [ ] **Step 8: Commit the implementation**

```bash
git add src/data/portfolio.ts src/sections/Experience.tsx src/sections/content-sections.test.tsx
git commit -m "feat: replace academic experience with EARTech internship"
```
