import { useCallback, useRef, useState } from "react";
import { ProjectCard } from "../features/projects/ProjectCard";
import { ProjectDialog } from "../features/projects/ProjectDialog";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { projects, type Project } from "../data/portfolio";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const returnFocusRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section aria-labelledby="projects-title" className="section" id="projects">
      <Reveal>
        <SectionHeading
          id="projects-title"
          kicker="04 / Selected Work"
          title="Projects with a clear purpose."
          intro="Public repositories and private academic case studies, each labeled exactly as it is."
        />
      </Reveal>
      <div className="project-grid">
        {projects.map((project, index) => (
          <Reveal delay={(index % 3) as 0 | 1 | 2} key={project.slug}>
            <ProjectCard
              index={index}
              onOpen={(trigger) => {
                returnFocusRef.current = trigger;
                setSelected(project);
              }}
              project={project}
            />
          </Reveal>
        ))}
      </div>
      <ProjectDialog onClose={close} project={selected} returnFocusRef={returnFocusRef} />
    </section>
  );
}
