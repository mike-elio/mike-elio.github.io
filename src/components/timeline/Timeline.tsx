import { Reveal } from "../ui/Reveal";
import { TagList } from "../ui/TagList";

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  context: string;
  summary?: string;
  collaboration?: string;
  features?: readonly string[];
  tags?: readonly string[];
  credentialId?: string;
}

export function Timeline({
  items,
  label,
}: {
  items: readonly TimelineEntry[];
  label: string;
}) {
  return (
    <ol aria-label={label} className="timeline">
      {items.map((item, index) => (
        <li className="timeline-item" key={item.id}>
          <span aria-hidden="true" className="timeline-node" />
          <Reveal className="timeline-reveal" delay={(index % 2) as 0 | 1}>
            <article className="timeline-card">
              <div className="timeline-meta">
                <span>{item.context}</span>
                <time>{item.date}</time>
              </div>
              <h3>{item.title}</h3>
              <p className="timeline-subtitle">{item.subtitle}</p>
              {item.collaboration ? (
                <p className="collaboration-label">{item.collaboration}</p>
              ) : null}
              {item.summary ? <p>{item.summary}</p> : null}
              {item.features ? (
                <ul className="timeline-features">
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              ) : null}
              {item.tags ? (
                <TagList label={`${item.title} technologies`} items={item.tags} />
              ) : null}
              {item.credentialId ? (
                <p className="credential-id">
                  <span>Credential ID</span> {item.credentialId}
                </p>
              ) : null}
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
