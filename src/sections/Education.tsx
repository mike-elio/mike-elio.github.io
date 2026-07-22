import { useCallback, useRef, useState } from "react";
import { Timeline, type TimelineEntry } from "../components/timeline/Timeline";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { education, type Education as EducationRecord } from "../data/portfolio";
import { EducationDialog } from "../features/education/EducationDialog";

const items: readonly TimelineEntry[] = [...education].reverse().map((entry) => ({
  id: entry.slug,
  title: entry.title,
  subtitle: entry.organization,
  date: entry.date,
  context: entry.type,
  summary: entry.grade,
  credentialId: entry.credentialId,
  detailsAvailable: Boolean(entry.summary),
}));

export function Education() {
  const [selected, setSelected] = useState<EducationRecord | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeDialog = useCallback(() => setSelected(null), []);

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
      <Timeline
        items={items}
        label="Education and certification timeline"
        onOpenDetails={(id, trigger) => {
          returnFocusRef.current = trigger;
          setSelected(education.find((entry) => entry.slug === id) ?? null);
        }}
      />
      <EducationDialog
        entry={selected}
        onClose={closeDialog}
        returnFocusRef={returnFocusRef}
      />
    </section>
  );
}
