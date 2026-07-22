import { Timeline, type TimelineEntry } from "../components/timeline/Timeline";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { education } from "../data/portfolio";

const items: readonly TimelineEntry[] = [...education].reverse().map((entry, index) => ({
  id: `education-${index + 1}`,
  title: entry.title,
  subtitle: entry.organization,
  date: entry.date,
  context: entry.type,
  credentialId: entry.credentialId,
}));

export function Education() {
  return (
    <section aria-labelledby="education-title" className="section" id="education">
      <Reveal>
        <SectionHeading
          id="education-title"
          kicker="05 / Education"
          title="Education & Certification"
          intro="Academic foundations and focused training across AI, coding, and cybersecurity."
        />
      </Reveal>
      <Timeline items={items} label="Education and certification timeline" />
    </section>
  );
}
