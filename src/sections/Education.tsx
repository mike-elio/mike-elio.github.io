import { useCallback, useRef, useState } from "react";
import { Timeline, type TimelineEntry } from "../components/timeline/Timeline";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { education, type Education as EducationRecord } from "../data/portfolio";
import { EducationDialog } from "../features/education/EducationDialog";

const degrees: readonly TimelineEntry[] = education.filter((entry) => entry.type === "Degree").map((entry) => ({
  id: entry.slug,
  title: entry.title,
  subtitle: entry.organization,
  date: entry.date,
  context: entry.type,
  summary: entry.grade,
  detailsAvailable: Boolean(entry.summary),
}));
const certificates = education.filter((entry) => entry.type !== "Degree").reverse();

export function Education() {
  const [selected, setSelected] = useState<EducationRecord | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeDialog = useCallback(() => setSelected(null), []);
  const openDetails = (entry: EducationRecord, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger;
    setSelected(entry);
  };

  return (
    <section aria-labelledby="education-title" className="section" id="education">
      <Reveal>
        <SectionHeading
          id="education-title"
          kicker="05 / Education"
          title="Education & Certification"
          intro="Academic foundations, focused training, and the original certificates behind them."
        />
      </Reveal>
      <div className="education-degree">
        <Timeline
          items={degrees}
          label="Education timeline"
          onOpenDetails={(id, trigger) => {
            const entry = education.find((record) => record.slug === id);
            if (entry) openDetails(entry, trigger);
          }}
        />
      </div>
      <div className="certificate-grid">
        {certificates.map((entry, index) => (
          <Reveal key={entry.slug} delay={(index % 2) as 0 | 1}>
            <article className="certificate-card">
              {entry.certificateImage ? (
                <button
                  className="certificate-preview"
                  aria-label={`Enlarge certificate: ${entry.title}`}
                  onClick={(event) => openDetails(entry, event.currentTarget)}
                  type="button"
                >
                  <img
                    src={entry.certificateImage.thumbnail}
                    alt={`${entry.organization} certificate: ${entry.title}`}
                    width={entry.certificateImage.width}
                    height={entry.certificateImage.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="certificate-zoom-label">Enlarge certificate <span aria-hidden="true">↗</span></span>
                </button>
              ) : null}
              <div className="certificate-copy">
                <p className="certificate-meta"><span>{entry.organization}</span><span>{entry.date}</span></p>
                <h3>{entry.title}</h3>
                {entry.credentialId ? <p className="credential-id"><span>Credential ID</span> {entry.credentialId}</p> : null}
                <button
                  className="timeline-details-trigger"
                  aria-label={`View details: ${entry.title}`}
                  onClick={(event) => openDetails(entry, event.currentTarget)}
                  type="button"
                >View details</button>
                {entry.verificationUrl ? <a className="certificate-verify" href={entry.verificationUrl} target="_blank" rel="noopener noreferrer">Verify credential</a> : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <EducationDialog entry={selected} onClose={closeDialog} returnFocusRef={returnFocusRef} />
    </section>
  );
}
