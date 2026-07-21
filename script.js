const FEATURED_REPOSITORIES = new Set([
  "senior",
  "project-part2",
  "game-discovery-platform",
]);

const EXCLUDED_REPOSITORIES = new Set([
  "mike-elio",
  "mike-elio.github.io",
  "learngit",
]);

const ACRONYMS = new Map([
  ["ai", "AI"],
  ["api", "API"],
  ["llm", "LLM"],
  ["ml", "ML"],
  ["nlp", "NLP"],
  ["rag", "RAG"],
  ["ui", "UI"],
  ["ux", "UX"],
]);

export function formatRepositoryName(name) {
  return String(name)
    .split("-")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      return ACRONYMS.get(lower) ?? `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
}

export function filterPortfolioRepositories(repositories) {
  if (!Array.isArray(repositories)) return [];

  return repositories
    .filter((repository) => {
      const topics = Array.isArray(repository?.topics) ? repository.topics : [];
      return (
        repository &&
        repository.fork === false &&
        repository.archived === false &&
        typeof repository.description === "string" &&
        repository.description.trim().length > 0 &&
        topics.includes("portfolio") &&
        !FEATURED_REPOSITORIES.has(repository.name) &&
        !EXCLUDED_REPOSITORIES.has(repository.name)
      );
    })
    .sort(
      (left, right) =>
        new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime(),
    )
    .slice(0, 6);
}

function setupHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupNavigation() {
  const button = document.querySelector("#mobile-menu-button");
  const navigation = document.querySelector("#site-nav");
  if (!(button instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) {
    return;
  }

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", open);
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      button.getAttribute("aria-expanded") === "true" &&
      event.target instanceof Node &&
      !navigation.contains(event.target) &&
      !button.contains(event.target)
    ) {
      setOpen(false);
    }
  });
}

function setupPortraitFallback() {
  const frame = document.querySelector(".portrait-frame");
  const image = frame?.querySelector("img");
  if (!(frame instanceof HTMLElement) || !(image instanceof HTMLImageElement)) return;

  const showFallback = () => frame.classList.add("is-fallback");
  image.addEventListener("error", showFallback, { once: true });
  if (image.complete && image.naturalWidth === 0) showFallback();
}

function setupReveal() {
  const sections = [...document.querySelectorAll(".section")];
  if (!sections.length) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8%", threshold: 0.1 },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupActiveNavigation() {
  if (!("IntersectionObserver" in window)) return;

  const links = [...document.querySelectorAll('#site-nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
        if (isCurrent) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-28% 0px -62%", threshold: [0, 0.15, 0.45] },
  );

  sections.forEach((section) => observer.observe(section));
}

function createProjectCard(repository) {
  const article = document.createElement("article");
  article.className = "project-card";

  const topline = document.createElement("div");
  topline.className = "project-card-topline";

  const label = document.createElement("span");
  label.className = "project-number";
  label.textContent = "Public project";

  const status = document.createElement("span");
  status.className = "project-status";
  const statusDot = document.createElement("i");
  statusDot.setAttribute("aria-hidden", "true");
  status.append(statusDot, " Public");
  topline.append(label, status);

  const body = document.createElement("div");
  body.className = "project-card-body";
  const summary = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = formatRepositoryName(repository.name);
  const description = document.createElement("p");
  description.textContent = repository.description;
  summary.append(title, description);
  body.append(summary);

  const tags = document.createElement("ul");
  tags.className = "tag-list";
  tags.setAttribute("aria-label", `${title.textContent} technologies`);
  const technologyNames = [
    repository.language,
    ...(Array.isArray(repository.topics) ? repository.topics : []),
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 4);
  for (const technology of technologyNames) {
    const item = document.createElement("li");
    item.textContent = formatRepositoryName(technology);
    tags.append(item);
  }

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Explore the repository ";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  link.append(arrow);

  article.append(topline, body, tags, link);
  return article;
}

async function loadMoreProjects() {
  const section = document.querySelector("#more-projects");
  const grid = document.querySelector("[data-more-projects]");
  if (!(section instanceof HTMLElement) || !(grid instanceof HTMLElement)) return;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5500);

  try {
    const response = await fetch(
      "https://api.github.com/users/mike-elio/repos?per_page=100&sort=pushed",
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
      },
    );
    if (!response.ok) return;

    const repositories = filterPortfolioRepositories(await response.json());
    if (!repositories.length) return;

    const fragment = document.createDocumentFragment();
    repositories.forEach((repository) => fragment.append(createProjectCard(repository)));
    grid.replaceChildren(fragment);
    section.hidden = false;
  } catch {
    section.hidden = true;
  } finally {
    window.clearTimeout(timeout);
  }
}

if (typeof document !== "undefined") {
  setupHeader();
  setupNavigation();
  setupPortraitFallback();
  setupReveal();
  setupActiveNavigation();
  loadMoreProjects();
}
