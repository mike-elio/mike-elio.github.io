import type { Project } from "../../data/portfolio";
import { getProjectEvidence } from "./projectEvidenceData";
import "./projectEvidence.css";

export function ProjectEvidenceGallery({ project }: { project: Project }) {
  const collection = getProjectEvidence(project.slug);
  if (!collection) return null;

  return (
    <section
      className="project-evidence"
      aria-label={project.title + " screenshot evidence"}
    >
      <h3>Project visuals &amp; evidence</h3>
      <p className="project-evidence-note">{collection.note}</p>
      <div className="project-evidence-grid">
        {collection.images.map((image) => (
          <figure className="project-evidence-item" key={image.src}>
            <a
              href={image.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={image.title + " — open full-size screenshot"}
            >
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            </a>
            <figcaption>{image.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
