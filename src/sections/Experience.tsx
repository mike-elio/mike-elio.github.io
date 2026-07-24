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
