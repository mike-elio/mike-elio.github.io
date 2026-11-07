// Updated authentic project evidence. Binary image assets are uploaded separately.
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
  "aquaguard": {
    note: "Locally executed rule-based FastAPI diagnosis examples. These are formatted API execution evidence, not an original application frontend or new ML model predictions.",
    images: [
      { src: "/assets/projects/2026-11-08/AquaGuard-AI--COVER.webp", title: "Organic load and oxygen depletion \u2014 cover", alt: "Organic load and oxygen depletion \u2014 cover" },
      { src: "/assets/projects/2026-11-08/AquaGuard-AI--01-agricultural-runoff-request-response.webp", title: "Nutrient enrichment and runoff", alt: "Nutrient enrichment and runoff" },
      { src: "/assets/projects/2026-11-08/AquaGuard-AI--04-thermal-stress-request-response.webp", title: "Thermal stress diagnosis", alt: "Thermal stress diagnosis" },
      { src: "/assets/projects/2026-11-08/AquaGuard-AI--05-chemical-contamination-request-response.webp", title: "Extreme ammonia and abnormal pH", alt: "Extreme ammonia and abnormal pH" },
    ],
  },
  "tool-guide": {
    note: "Authentic ToolGuide interface captures. Match scores are catalog-specific fit indicators, not AI prediction accuracy; confidence and caveats remain visible.",
    images: [
      { src: "/assets/projects/2026-11-08/Adaptive-AI-Tool-Guide--COVER.webp", title: "Best-fit recommendation \u2014 cover", alt: "Best-fit recommendation \u2014 cover" },
      { src: "/assets/projects/2026-11-08/Adaptive-AI-Tool-Guide--10-complete-homepage.webp", title: "Project stage selection", alt: "Project stage selection" },
      { src: "/assets/projects/2026-11-08/Adaptive-AI-Tool-Guide--17-complete-ai-comparison-section.webp", title: "Side-by-side tool comparison", alt: "Side-by-side tool comparison" },
      { src: "/assets/projects/2026-11-08/Adaptive-AI-Tool-Guide--18-complete-what-if-recommendations.webp", title: "What-if scenario recommendations", alt: "What-if scenario recommendations" },
    ],
  },
  "nahd": {
    note: "Locally tested GoalPath Career Expert feature from Nahd AI. A sample career-fit score is not ML validation accuracy and other platform modules are not demonstrated here.",
    images: [
      { src: "/assets/projects/2026-11-08/Nahd-AI--COVER.webp", title: "Personalized path result \u2014 cover", alt: "Personalized path result \u2014 cover" },
      { src: "/assets/projects/2026-11-08/Nahd-AI--02-python-interview-complete.webp", title: "Python background interview", alt: "Python background interview" },
      { src: "/assets/projects/2026-11-08/Nahd-AI--03-goalpath-home-desktop.webp", title: "Choose a technology path", alt: "Choose a technology path" },
      { src: "/assets/projects/2026-11-08/Nahd-AI--06-rag-retrieval-track-preference.webp", title: "NLP preference question", alt: "NLP preference question" },
    ],
  },
  "fake-image-detector": {
    note: "Historical ConvNeXt notebook evaluation visualizations. These were not generated from a newly rerun model; experiments had different dataset sizes and configurations.",
    images: [
      { src: "/assets/projects/2026-11-08/Fake-Image-Detector--COVER.webp", title: "Five experiments compared \u2014 cover", alt: "Five experiments compared \u2014 cover" },
      { src: "/assets/projects/2026-11-08/Fake-Image-Detector--21-experiment-05-complete-learning-curves.webp", title: "Final recorded learning curves", alt: "Final recorded learning curves" },
      { src: "/assets/projects/2026-11-08/Fake-Image-Detector--22-experiment-01-recorded-learning-curves.webp", title: "Experiment 01 \u2014 ConvNeXt Base", alt: "Experiment 01 \u2014 ConvNeXt Base" },
      { src: "/assets/projects/2026-11-08/Fake-Image-Detector--22-experiment-02-recorded-learning-curves.webp", title: "Experiment 02 \u2014 ConvNeXt Small", alt: "Experiment 02 \u2014 ConvNeXt Small" },
      { src: "/assets/projects/2026-11-08/Fake-Image-Detector--22-experiment-03-recorded-learning-curves.webp", title: "Experiment 03 \u2014 ConvNeXt Small", alt: "Experiment 03 \u2014 ConvNeXt Small" },
      { src: "/assets/projects/2026-11-08/Fake-Image-Detector--22-experiment-04-recorded-learning-curves.webp", title: "Experiment 04 \u2014 ConvNeXt Base", alt: "Experiment 04 \u2014 ConvNeXt Base" },
    ],
  },
};

export function getProjectEvidence(slug: string): EvidenceCollection | undefined {
  return evidenceBySlug[slug];
}
