import { Timeline, type TimelineEntry } from "../components/timeline/Timeline";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { experiences } from "../data/portfolio";

const items: readonly TimelineEntry[] = experiences.map((entry, index) => ({
  id: `experience-${index + 1}`,
  title: entry.project,
  subtitle: `${entry.title} · ${entry.organization}`,
  date: entry.date,
  context: entry.context,
  collaboration: entry.collaboration,
  summary: entry.summary,
  features: entry.features,
  tags: entry.tags,
}));

export function Experience() {
  return (
    <section aria-labelledby="experience-title" className="section" id="experience">
      <Reveal>
        <SectionHeading
          id="experience-title"
          kicker="03 / Experience"
          title="Academic Project Experience"
          intro="Collaborative university work applying AI and backend engineering to concrete decision-support problems."
        />
      </Reveal>
      <Timeline items={items} label="Academic project timeline" />
    </section>
  );
}
