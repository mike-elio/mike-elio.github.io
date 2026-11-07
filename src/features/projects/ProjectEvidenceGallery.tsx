import type { Project } from "../../data/portfolio";
import "./projectEvidence.css";

export interface EvidenceImage {
  src: string;
  title: string;
  alt: string;
}

interface EvidenceCollection {
  note: string;
  images: readonly EvidenceImage[];
}

const evidenceBySlug: Readonly<Record<string, EvidenceCollection>> = {
  "tool-guide": {
    note: "Real screenshots from a locally running web application. Match scores are catalog-based fit indicators, not AI prediction accuracy.",
    images: [
      { src: "/assets/projects/toolguide-home.webp", title: "Project stage selection", alt: "Tool Guide application home and project-stage selection" },
      { src: "/assets/projects/toolguide-question.webp", title: "Adaptive questionnaire", alt: "Tool Guide adaptive architecture selection question" },
      { src: "/assets/projects/toolguide-recommendations.webp", title: "Explainable recommendation", alt: "Tool Guide recommendation card with reasons and fit indicator" },
    ],
  },
  nahd: {
    note: "Real screenshots of the independently runnable GoalPath Career Expert feature. The recommendation and fit score use illustrative interview answers; other Nahd modules are not represented here.",
    images: [
      { src: "/assets/projects/nahd-home.webp", title: "Choose a career domain", alt: "GoalPath Expert System home screen and domain selection" },
      { src: "/assets/projects/nahd-recommendation.webp", title: "Recommended track and fit score", alt: "GoalPath AI Foundations Track recommendation and sample fit score" },
      { src: "/assets/projects/nahd-plan.webp", title: "Gap-resolution plan", alt: "GoalPath suggested Python, math, practice and tooling steps" },
      { src: "/assets/projects/nahd-api.webp", title: "Documented REST endpoints", alt: "GoalPath FastAPI OpenAPI endpoints" },
    ],
  },
  aquaguard: {
    note: "Verified live FastAPI screenshots of a rule-based diagnosis with illustrative input values. These do not demonstrate a newly rerun machine-learning predictor.",
    images: [
      { src: "/assets/projects/aquaguard-docs.webp", title: "OpenAPI diagnosis endpoint", alt: "AquaGuard API documentation showing POST diagnose endpoint" },
      { src: "/assets/projects/aquaguard-diagnosis.webp", title: "Water quality diagnosis response", alt: "Water quality diagnosis response with successful HTTP 200 and cause messages" },
    ],
  },
  "fake-image-detector": {
    note: "Historical notebook outputs from ConvNeXt experiments, not a newly rerun model. The checkpoint and dataset were unavailable for fresh inference.",
    images: [
      { src: "/assets/projects/fake-detector-accuracy.webp", title: "Final experiment accuracy", alt: "Experiment five training and validation accuracy plots" },
      { src: "/assets/projects/fake-detector-validation.webp", title: "Validation accuracy progression", alt: "Experiment five saved validation accuracy curve" },
    ],
  },
};

export function getProjectEvidence(slug: string): EvidenceCollection | undefined {
  return evidenceBySlug[slug];
}

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
