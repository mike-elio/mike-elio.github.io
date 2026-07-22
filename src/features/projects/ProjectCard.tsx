import type { Project } from "../../data/portfolio";
import { TagList } from "../../components/ui/TagList";

export function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <article className={project.featured ? "project-card project-card--featured" : "project-card"}>
      <div className="project-card-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.visibility === "public" ? "Public project" : "Case study"}</span>
      </div>
      <p className="project-eyebrow">{project.eyebrow}</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <TagList label={`${project.title} technologies`} items={project.technologies} />
      <button
        aria-label={`View case study: ${project.title}`}
        className="project-open"
        onClick={(event) => onOpen(event.currentTarget)}
        type="button"
      >
        View case study <span aria-hidden="true">↗</span>
      </button>
    </article>
  );
}
