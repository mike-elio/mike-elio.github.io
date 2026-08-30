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
    qualifier?: "Advancing";
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
  grade?: string;
  activities?: string;
  summary?: string;
  details?: string;
  projects?: readonly string[];
  skills?: readonly string[];
}

export const profile: Profile = {
  name: "Mike Eliovits",
  title: "AI Engineer",
  eyebrow: "Hello, I'm",
  positioning:
    "I build practical AI systems that explain their decisions and ship as usable products.",
  summary:
    "I work across LLM applications, natural language processing, computer vision, and reliable backend delivery.",
  availability: "Open to AI/ML & Backend AI opportunities",
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
    ],
  },
  {
    title: "Backend",
    icon: "server",
    items: [
      { label: "FastAPI" },
      { label: "Node.js" },
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
      { label: "Microsoft Azure", qualifier: "Advancing" },
      { label: "Ollama" },
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
    duration: "1 mo",
    location: "New York City Metropolitan Area",
    workArrangement: "Remote",
    summary:
      "Currently interning at FlyRank AI as an AI intern, focusing on Backend AI Engineering.",
    skills: ["Backend AI Engineering", "Artificial Intelligence (AI)"],
  },
  {
    title: "Artificial Intelligence with Coding & Cybersecurity",
    organization: "EARTech Information Technology",
    employmentType: "Internship",
    date: "Aug 2025 – Sep 2025",
    duration: "2 mos",
    location: "Syria",
    workArrangement: "Remote",
    summary:
      "Completed a two-month internship spanning five technical areas: Python, Front-End Web Development, Hack The Box, Artificial Intelligence, and Microsoft Azure, strengthening my knowledge and practical skills in these technologies by an estimated 20%.",
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
      "A water-quality decision-support concept combining prediction, diagnostic reasoning, and provider routing.",
    description:
      "AquaGuard explored how AI and backend logic can organize reported water conditions into understandable guidance and verified next steps.",
    contribution:
      "Worked on water-quality scoring, diagnostic rules, and backend flows that connect citizens with verified providers.",
    features: [
      "Water quality scoring",
      "Condition prediction",
      "Diagnostic reasoning",
      "Verified provider routing",
    ],
    technologies: ["Machine Learning", "Python", "Backend AI", "REST APIs"],
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
    title: "RISE-MICCAI Summer School 2025",
    organization: "RISE-MICCAI",
    date: "Issued Jul 2025",
    type: "Professional Certificate",
    summary:
      "Certificate of Completion for attending the RISE-MICCAI Summer School, held from July 14–18, 2025.",
    skills: [
      "Artificial Intelligence (AI)",
      "Machine Learning",
      "Computer Vision",
      "Medical Imaging",
    ],
  },
  {
    slug: "ai-coding-cybersecurity-certificate",
    title: "Artificial Intelligence with Coding & Cybersecurity",
    organization: "EARTech Information Technology",
    date: "Issued Sep 2025",
    type: "Professional Certificate",
    credentialId: "6e9ae40f-644f-432e-84de-166fcc490525",
    summary:
      "Certificate of completion awarded by EarTech Information Technology for successfully completing a training program focused on artificial intelligence, coding, and cybersecurity.",
    skills: [
      "Artificial Intelligence (AI)",
      "Hack the Box",
      "Python (Programming Language)",
      "Microsoft Azure",
    ],
  },
];
