export interface Profile {
  name: string;
  title: string;
  eyebrow: string;
  positioning: string;
  summary: string;
  availability: string;
  roles: readonly string[];
  social: ReadonlyArray<{
    label: "GitHub" | "LinkedIn";
    url: string;
  }>;
}

export interface SkillGroup {
  title: string;
  icon: "code" | "brain" | "server" | "tools";
  items: ReadonlyArray<{
    label: string;
  }>;
}

export interface Experience {
  title: string;
  organization: string;
  employmentType: string;
  date: string;
  duration: string;
  location: string;
  workArrangement: string;
  summary: string;
  skills: readonly string[];
}

interface ProjectBase {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  contribution: string;
  features: readonly string[];
  technologies: readonly string[];
  featured?: boolean;
}

export interface PublicProject extends ProjectBase {
  visibility: "public";
  sourceUrl: `https://github.com/mike-elio/${string}`;
}

export interface CaseStudyProject extends ProjectBase {
  visibility: "case-study";
  sourceUrl?: never;
}

export type Project = PublicProject | CaseStudyProject;

export interface Education {
  slug: string;
  title: string;
  organization: string;
  date: string;
  type: "Degree" | "Professional Certificate";
  credentialId?: string;
  certificateImage?: { thumbnail: string; original: string; width: number; height: number };
  verificationUrl?: string;
  grade?: string;
  activities?: string;
  summary?: string;
  details?: string;
  projects?: readonly string[];
  skills?: readonly string[];
}

export const profile: Profile = {
  name: "Mike Eliovits",
  title: "Backend AI Engineer",
  eyebrow: "Hello, I'm",
  positioning:
    "I build practical AI systems that explain their decisions and ship as usable products.",
  summary:
    "I develop and evaluate AI models with PyTorch, Hugging Face Transformers, and scikit-learn, and integrate them through reliable FastAPI services. My work spans LLM applications, NLP, computer vision, and backend development.",
  availability: "Open to AI/ML & Backend AI opportunities · Remote & relocation",
  roles: [
    "AI Engineer",
    "LLM Application Builder",
    "NLP & Machine Learning Engineer",
    "Backend AI Developer",
  ],
  social: [
    { label: "GitHub", url: "https://github.com/mike-elio" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/mike-eliovits-4861b3379/",
    },
  ],
};

export const skills: readonly SkillGroup[] = [
  {
    title: "Languages",
    icon: "code",
    items: [
      { label: "Python" },
      { label: "JavaScript" },
      { label: "SQL" },
      { label: "HTML5" },
    ],
  },
  {
    title: "AI & ML",
    icon: "brain",
    items: [
      { label: "Large Language Models (LLM)" },
      { label: "Machine Learning" },
      { label: "Data Preprocessing" },
      { label: "Deep Learning" },
      { label: "Natural Language Processing (NLP)" },
      { label: "Computer Vision" },
      { label: "Expert Systems" },
      { label: "PyTorch" },
      { label: "Hugging Face Transformers" },
      { label: "scikit-learn" },
      { label: "Model Evaluation" },
      { label: "Prompt Engineering" },
    ],
  },
  {
    title: "Backend",
    icon: "server",
    items: [
      { label: "FastAPI" },
      { label: "Node.js" },
      { label: "Express.js" },
      { label: "Pydantic" },
      { label: "pytest" },
      { label: "JSON Schema" },
      { label: "Model Deployment" },
      { label: "REST APIs" },
      { label: "Validation Processing" },
    ],
  },
  {
    title: "Tools & Cloud",
    icon: "tools",
    items: [
      { label: "Git" },
      { label: "GitHub" },
      { label: "Docker" },
      { label: "Microsoft Azure" },
      { label: "Ollama" },
      { label: "MLOps Fundamentals" },
      { label: "OpenAI Codex" },
      { label: "Claude Code" },
      { label: "Google Antigravity" },
      { label: "Software Development Life Cycle (SDLC)" },
    ],
  },
];

export const experiences: readonly Experience[] = [
  {
    title: "Backend AI Engineer - Intern",
    organization: "FlyRank AI",
    employmentType: "Internship",
    date: "Aug 2026 – Present",
    duration: "Ongoing",
    location: "New York City Metropolitan Area",
    workArrangement: "Remote",
    summary:
      "Backend AI engineering internship with hands-on work in Python model development, supervised and unsupervised learning, data preprocessing, exploratory analysis, and deployment practices under mentorship. Applying Express.js, SQL, and prompt engineering.",
    skills: ["Backend AI Engineering", "Artificial Intelligence (AI)", "Express.js", "Prompt Engineering", "SQL"],
  },
  {
    title: "Artificial Intelligence with Coding & Cybersecurity",
    organization: "EARTech Information Technology",
    employmentType: "Internship",
    date: "Aug 2025 – Sep 2025",
    duration: "2 mos",
    location: "Istanbul, Türkiye",
    workArrangement: "Remote",
    summary:
      "Completed 92 hours of practical training in Python, applied AI, web development, cybersecurity, and Microsoft Azure. Completed 5 Hack The Box labs, 4 small projects, and more than 10 coding exercises.",
    skills: [
      "Python (Programming Language)",
      "Front-End Web Development",
      "Hack The Box",
      "Artificial Intelligence (AI)",
      "Microsoft Azure",
    ],
  },
];

export const projects: readonly Project[] = [
  {
    slug: "fake-image-detector",
    title: "Fake Image Detector",
    eyebrow: "SharafAI · Jul – Sep 2026",
    visibility: "public",
    sourceUrl: "https://github.com/mike-elio/image-detection-fake",
    summary:
      "A computer-vision project for detecting fake images, with ConvNeXt training and deployed FastAPI inference.",
    description:
      "Developed with SharafAI using 121,000 images from SID_Set. The model achieved 94.24% accuracy on the local test set.",
    contribution:
      "Contributed to data collection and ConvNeXt training in PyTorch, implemented the FastAPI backend, and deployed model inference. Collaborated with a teammate who built the Streamlit UI, then integrated and validated the full workflow.",
    features: [
      "ConvNeXt training in PyTorch",
      "121,000-image SID_Set dataset",
      "94.24% local test accuracy",
      "FastAPI model inference and deployment",
      "Integration with a teammate-built Streamlit interface",
    ],
    technologies: ["Python", "PyTorch", "Computer Vision", "FastAPI", "Model Deployment"],
  },
  {
    slug: "nahd",
    title: "Nahd AI Coaching Platform",
    eyebrow: "Flagship academic case study",
    visibility: "public",
    sourceUrl: "https://github.com/mike-elio/Nahd-AI-Coaching-Platform",
    featured: true,
    summary:
      "A collaborative AI coaching platform combining guidance, diagnosis, visual verification, and voice interaction.",
    description:
      "Nahd is an AI coaching platform that combines FastAPI, LLMs, NLP, Computer Vision, Machine Learning, and Expert Systems to deliver guided, validated learning workflows.",
    contribution:
      "Contributed to the AI layer across recommendation, diagnostic, image-verification, and voice-agent capabilities within the collaborative project.",
    features: [
      "Explainable path recommendation",
      "Technical fault diagnosis",
      "Image-based task-proof verification",
      "Voice Agent API integration",
      "ModernBERT fault classification: F1 0.8880 and Recall@3 0.9648",
      "Proof verification: accuracy 0.7628 and Macro-F1 0.7621",
      "GoalPath validation: 71/71 pytest tests passed; Pydantic and JSON Schema response contracts",
    ],
    technologies: [
      "Python",
      "JavaScript",
      "FastAPI",
      "Large Language Models (LLM)",
      "Computer Vision",
      "Natural Language Processing (NLP)",
      "HTML5",
      "Ollama",
      "Software Development Life Cycle (SDLC)",
      "Machine Learning",
      "Expert Systems",
      "Validation Processing",
    ],
  },
  {
    slug: "tool-guide",
    title: "Adaptive AI Tool Guide",
    eyebrow: "Public AI recommendation system",
    visibility: "public",
    sourceUrl: "https://github.com/mike-elio/toolguide",
    summary:
      "An evidence-backed bilingual AI tool recommendation system with adaptive questions and explainable Top-3 results.",
    description:
      "The system scopes decisions across Analysis, Design, Implementation, and Testing for Software, Artificial Intelligence, and Cybersecurity. It uses deterministic stateless questionnaire sessions, source-backed knowledge, CLIPS-backed rule inference, and optional local Ollama classification for unresolved free-text answers.",
    contribution:
      "Built the end-to-end recommendation workflow, FastAPI backend, bilingual interface, validated knowledge catalog, rule inference, automated tests, audits, and questionnaire simulation tooling.",
    features: [
      "48 curated tools across 12 stage/domain pools",
      "6–10 adaptive source-backed questions",
      "Top-3 explainable recommendations with match scores, limitations, confidence, and official sources",
      "Arabic and English responsive interface",
      "Deterministic stateless questionnaire sessions",
      "Local-first intent classification with curated aliases and optional Ollama fallback",
      "250/250 simulated FastAPI sessions completed with 0 failures across all 12 pools",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "JavaScript",
      "HTML5",
      "Expert Systems",
      "CLIPS",
      "Ollama",
      "Gemma 3 1B",
      "REST APIs",
      "Pytest",
      "Node.js",
    ],
  },
  {
    slug: "aquaguard",
    title: "AquaGuard AI",
    eyebrow: "Academic case study",
    visibility: "public",
    sourceUrl: "https://github.com/mike-elio/AquaGuard-AI",
    summary:
      "A water-quality platform combining WQI prediction, rule-based diagnosis, and Top-5 provider recommendations.",
    description:
      "Built an end-to-end WQI pipeline covering data cleaning, preprocessing, feature engineering, training, and evaluation. Benchmarked TensorFlow neural networks and scikit-learn models, selected Random Forest, and deployed the platform to a server.",
    contribution:
      "Worked on water-quality scoring, diagnostic rules, and backend flows that connect citizens with verified providers.",
    features: [
      "Water quality scoring",
      "Condition prediction",
      "Diagnostic reasoning",
      "Top-5 provider recommendations through APIs",
      "Random Forest evaluation: R² 0.9999, MAE 0.0142, RMSE 0.1524",
    ],
    technologies: ["Machine Learning", "Python", "TensorFlow", "scikit-learn", "Random Forest", "REST APIs"],
  },
  {
    slug: "product-task-platform",
    title: "Product & Task Management Platform",
    eyebrow: "Public backend project",
    visibility: "public",
    sourceUrl: "https://github.com/mike-elio/project-part2",
    summary:
      "A Laravel application organizing product, task, and user workflows through structured backend models.",
    description:
      "The project demonstrates server-rendered application structure, relational data workflows, and maintainable product and task operations.",
    contribution:
      "Implemented the application workflows and data relationships with Laravel and Eloquent.",
    features: [
      "Product workflows",
      "Task lifecycle management",
      "User-oriented operations",
      "Relational data modeling",
    ],
    technologies: ["Laravel", "Eloquent", "Vite"],
  },
  {
    slug: "game-discovery",
    title: "Game Discovery Platform",
    eyebrow: "Public frontend project",
    visibility: "public",
    sourceUrl: "https://github.com/mike-elio/game-discovery-platform",
    summary:
      "A responsive game-discovery interface with category browsing, search, filtering, and reusable components.",
    description:
      "The platform focuses on clear discovery flows, responsive interaction, and component-driven frontend composition.",
    contribution:
      "Built the React interface and data-query experience across browsing, searching, and filtering states.",
    features: [
      "Category browsing",
      "Search and filtering",
      "Responsive cards",
      "Query-state handling",
    ],
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "React Query",
    ],
  },
];

export const education: readonly Education[] = [
  {
    slug: "beng-artificial-intelligence",
    title: "Bachelor of Engineering, Artificial Intelligence",
    organization: "Arab International University",
    date: "Sep 2021 – Jun 2026",
    type: "Degree",
    grade: "Grade: 3.23/4.0",
    activities:
      "Academic Project Team Member | AI and Machine Learning Research | Technical Documentation and Presentations",
    summary:
      "Bachelor of Engineering in Informatics Engineering with a focus on artificial intelligence, machine learning, software engineering, databases, and intelligent systems.",
    projects: [
      "Nahd — an intelligent digital coaching and career-guidance platform.",
      "AquaGuard AI — a machine-learning and expert-system platform for water-quality analysis and citizen routing.",
    ],
    details:
      "Gained practical experience with Python, NLP, computer vision, expert systems, large language models, model training and evaluation, system architecture, automated testing, and technical research.",
    skills: [
      "Fine-Tuning",
      "Computer Vision",
      "Python",
      "NLP",
      "Expert Systems",
      "Large Language Models",
      "Model Training & Evaluation",
      "System Architecture",
      "Automated Testing",
      "Technical Research",
    ],
  },
  {
    slug: "rise-miccai-summer-school-2025",
    certificateImage: { thumbnail: "/assets/certificates/rise-miccai-thumb.jpg", original: "/assets/certificates/rise-miccai.jpg", width: 1280, height: 939 },
    title: "RISE-MICCAI Summer School 2025",
    organization: "RISE-MICCAI",
    date: "Issued Jul 2025",
    type: "Professional Certificate",
    summary:
      "Certificate of Completion for attending the RISE-MICCAI Summer School, held from July 14–18, 2025, with 10 hours covering medical imaging, deep learning, computer vision, and AI research.",
    skills: [
      "Artificial Intelligence (AI)",
      "Machine Learning",
      "Computer Vision",
      "Medical Imaging",
    ],
  },
  {
    slug: "ai-coding-cybersecurity-certificate",
    certificateImage: { thumbnail: "/assets/certificates/eartech-thumb.jpg", original: "/assets/certificates/eartech.jpg", width: 802, height: 620 },
    title: "Artificial Intelligence with Coding & Cybersecurity",
    organization: "EARTech Information Technology",
    date: "Issued Sep 2025",
    type: "Professional Certificate",
    credentialId: "6e9ae40f-644f-432e-84de-166fcc490525",
    summary:
      "Certificate of completion awarded by EarTech Information Technology for successfully completing 92 hours of training focused on Python, applied AI, web development, and cybersecurity.",
    skills: [
      "Artificial Intelligence (AI)",
      "Hack the Box",
      "Python (Programming Language)",
      "Microsoft Azure",
    ],
  },
  {
    slug: "ai-fluency-framework-foundations",
    certificateImage: { thumbnail: "/assets/certificates/anthropic-thumb.jpg", original: "/assets/certificates/anthropic.png", width: 1925, height: 1487 },
    title: "AI Fluency: Framework & Foundations",
    organization: "Anthropic",
    date: "Aug 2026",
    type: "Professional Certificate",
    summary: "Completed 4 hours of training in the 4D Framework and responsible AI use.",
    skills: ["AI Fluency", "Responsible AI", "4D Framework"],
  },
  {
    slug: "fake-image-detector-certificate",
    certificateImage: { thumbnail: "/assets/certificates/sharafai-thumb.jpg", original: "/assets/certificates/sharafai.jpg", width: 1286, height: 908 },
    title: "Fake Image Detector — Certificate of Participation",
    organization: "SharafAI",
    date: "Issued Oct 2026",
    type: "Professional Certificate",
    summary: "Certificate of Participation in the Fake Image Detector project at SharafAI.",
    skills: ["Python (Programming Language)", "PyTorch", "Computer Vision", "FastAPI", "Model Deployment"],
  },
];
