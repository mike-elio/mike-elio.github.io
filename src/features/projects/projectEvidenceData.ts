// Verified project visuals and their provenance; shared by project cards and galleries.
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
    note: "Real screenshots from a locally running web application. Match scores are catalog-based fit indicators, not AI prediction accuracy. The complete comparison and what-if sections use contiguous scroll captures; the original low confidence and undocumented capabilities are preserved.",
    images: [
      { src: "/assets/projects/improved/Adaptive-AI-Tool-Guide--COVER.png", title: "Explainable CrewAI recommendation", alt: "Tool Guide CrewAI recommendation with actual match, low confidence, reasons, limitations and source" },
      { src: "/assets/projects/improved/Adaptive-AI-Tool-Guide--10-complete-homepage.png", title: "Project stage selection", alt: "Tool Guide complete homepage and project-stage selection" },
      { src: "/assets/projects/improved/Adaptive-AI-Tool-Guide--17-complete-ai-comparison-section.png", title: "Compare AI tools", alt: "CrewAI, LlamaIndex and Transformers comparison with documented capabilities and unknowns" },
      { src: "/assets/projects/improved/Adaptive-AI-Tool-Guide--18-complete-what-if-recommendations.png", title: "What-if recommendation comparison", alt: "Original and open-source-required scenario recommendations shown side by side" },
    ],
  },
  nahd: {
    note: "Real screenshots of the independently runnable GoalPath Career Expert feature. The recommendation and fit score use illustrative interview answers; other Nahd modules are not represented here.",
    images: [
      { src: "/assets/projects/improved/Nahd-AI--COVER.png", title: "Recommended track, fit score and gap plan", alt: "GoalPath AI Foundations Track recommendation with 62 percent sample fit, reasoning, strengths and personalized gap plan" },
      { src: "/assets/projects/improved/Nahd-AI--03-goalpath-home-desktop.png", title: "Choose a career domain", alt: "GoalPath Expert System homepage and three career-domain options" },
      { src: "/assets/projects/improved/Nahd-AI--02-python-interview-complete.png", title: "Complete interview question", alt: "GoalPath Python experience question with all answers and navigation visible" },
      { src: "/assets/projects/improved/Nahd-AI--06-rag-retrieval-track-preference.png", title: "NLP and RAG specialization", alt: "GoalPath NLP style question with RAG retrieval selected and all options visible" },
    ],
  },
  aquaguard: {
    note: "Actual locally executed FastAPI request and response evidence for rule-based diagnosis with illustrative water samples. These images are capture reports separate from the application, not a product frontend or a newly rerun machine-learning predictor.",
    images: [
      { src: "/assets/projects/improved/AquaGuard-AI--COVER.png", title: "Water quality diagnosis response", alt: "Water quality diagnosis response with actual HTTP 200, organic-load request, symptoms and likely causes" },
      { src: "/assets/projects/improved/AquaGuard-AI--01-agricultural-runoff-request-response.png", title: "Nutrient enrichment diagnosis", alt: "Actual AquaGuard request and response for nutrient enrichment and likely agricultural runoff" },
      { src: "/assets/projects/improved/AquaGuard-AI--04-thermal-stress-request-response.png", title: "Thermal stress diagnosis", alt: "Actual AquaGuard request and response identifying thermal stress and oxygen depletion" },
      { src: "/assets/projects/improved/AquaGuard-AI--05-chemical-contamination-request-response.png", title: "Chemical contamination diagnosis", alt: "Actual AquaGuard request and response for extreme ammonia and abnormal pH" },
    ],
  },
  "fake-image-detector": {
    note: "Historical notebook outputs from all five ConvNeXt experiments, replotted from saved rounded training logs with source-cell labels, not a newly rerun model. Validation and test metrics are distinct; the checkpoint and dataset were unavailable for fresh inference.",
    images: [
      { src: "/assets/projects/improved/Fake-Image-Detector--COVER.png", title: "Recorded experiment comparison", alt: "Best recorded validation accuracy across all five ConvNeXt experiments with separate historical test accuracy" },
      { src: "/assets/projects/improved/Fake-Image-Detector--21-experiment-05-complete-learning-curves.png", title: "Experiment 5: ConvNeXt-Base, 121,000 images", alt: "Experiment five recorded training and validation accuracy and loss, best validation accuracy 94.45 percent" },
      { src: "/assets/projects/improved/Fake-Image-Detector--22-experiment-01-recorded-learning-curves.png", title: "Experiment 1: ConvNeXt-Base, 3,976 images", alt: "Experiment 1 recorded training and validation accuracy and loss from the saved notebook" },
      { src: "/assets/projects/improved/Fake-Image-Detector--22-experiment-02-recorded-learning-curves.png", title: "Experiment 2: ConvNeXt-Small, 3,976 images", alt: "Experiment 2 recorded training and validation accuracy and loss from the saved notebook" },
      { src: "/assets/projects/improved/Fake-Image-Detector--22-experiment-03-recorded-learning-curves.png", title: "Experiment 3: ConvNeXt-Small, 50,000 images", alt: "Experiment 3 recorded training and validation accuracy and loss from the saved notebook" },
      { src: "/assets/projects/improved/Fake-Image-Detector--22-experiment-04-recorded-learning-curves.png", title: "Experiment 4: ConvNeXt-Base, 50,000 images", alt: "Experiment 4 recorded training and validation accuracy and loss from the saved notebook" },
    ],
  },
};

export function getProjectEvidence(slug: string): EvidenceCollection | undefined {
  return evidenceBySlug[slug];
}

