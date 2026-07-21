# Professional Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a polished, accessible English portfolio for Mike Eliovits at `https://mike-elio.github.io/`.

**Architecture:** Use semantic static HTML, a focused CSS design system, and a small ES module with progressive enhancement. Critical content remains local; an optional GitHub API request adds future public repositories tagged `portfolio` without compromising the featured-project experience.

**Tech Stack:** HTML5, CSS3, dependency-free JavaScript ES modules, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Publish from the public repository `mike-elio/mike-elio.github.io`, branch `main`, root `/`.
- Use English copy throughout the public site.
- Use midnight navy surfaces with professional orange accents and warm-white text.
- Store the authenticated LinkedIn portrait locally; never publish its expiring media URL.
- Publish only LinkedIn and GitHub contact links; never publish an email address.
- Feature only `senior`, `project-part2`, and `game-discovery-platform` as original projects.
- Do not present `task-manager-laravel` as an original featured project because it is a fork.
- Display only the approved skills: Python, JavaScript, FastAPI, Node.js, Laravel, AI/ML topics, Git, GitHub, REST APIs, Docker, and advancing Azure study.
- Respect `prefers-reduced-motion`, keyboard access, semantic headings, focus visibility, and mobile layouts.
- Keep the first release dependency-free in production; no analytics, contact form, blog, CMS, or package manager runtime.

## File Map

- `index.html`: semantic page content, SEO metadata, JSON-LD, and critical featured-project copy.
- `styles.css`: tokens, responsive layout, accessibility states, component styles, and reduced-motion overrides.
- `script.js`: mobile navigation, scroll state, reveal enhancement, and filtered GitHub repository loading.
- `assets/profile.jpg`: stable local copy of the authenticated LinkedIn portrait.
- `assets/favicon.svg`: orange `ME` monogram favicon.
- `assets/og-card.png`: 1200×630 LinkedIn/Open Graph preview.
- `404.html`: branded recovery page linking home.
- `robots.txt`: public crawl rule and sitemap location.
- `sitemap.xml`: canonical page location.
- `.nojekyll`: direct GitHub Pages static serving marker.
- `README.md`: maintenance, project-topic workflow, local preview, and deployment notes.
- `tests/site-contract.test.mjs`: content, privacy, accessibility, metadata, filtering, and asset contract tests.
- `scripts/generate-og-card.sh`: deterministic ImageMagick social-card generator, used only during development.

---

### Task 1: Site Contract and Semantic Shell

**Files:**
- Create: `tests/site-contract.test.mjs`
- Create: `index.html`

**Interfaces:**
- Consumes: approved copy and links from the design specification.
- Produces: stable DOM IDs `main`, `about`, `projects`, `skills`, `contact`, `mobile-menu-button`, `site-nav`, and `more-projects` for CSS and JavaScript.

- [ ] **Step 1: Write the failing semantic and privacy contract**

Create a Node test that reads `index.html` and asserts the required landmarks, project URLs, canonical URL, LinkedIn URL, local portrait, and absence of private or temporary data:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("index contains the professional portfolio contract", async () => {
  const html = await read("index.html");
  for (const value of [
    "Mike Eliovits",
    "AI Engineer",
    'id="about"',
    'id="projects"',
    'id="skills"',
    'id="contact"',
    "https://github.com/mike-elio/senior",
    "https://github.com/mike-elio/project-part2",
    "https://github.com/mike-elio/game-discovery-platform",
    "https://www.linkedin.com/in/mike-eliovits-4861b3379/",
    'src="assets/profile.jpg"',
    'type="application/ld+json"',
    'class="focus-strip"',
    'class="project-number"',
    'class="tag-list"',
    'class="portrait-fallback"',
    '<link rel="canonical" href="https://mike-elio.github.io/">'
  ]) assert.match(html, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.doesNotMatch(html, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  assert.doesNotMatch(html, /media\.licdn\.com/i);
  assert.doesNotMatch(html, /task-manager-laravel/i);
});

test("index exposes essential accessibility hooks", async () => {
  const html = await read("index.html");
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-controls="site-nav"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /alt="Mike Eliovits"/);
});
```

- [ ] **Step 2: Run the test and confirm it fails because `index.html` is missing**

Run: `node --test tests/site-contract.test.mjs`  
Expected: FAIL with an `ENOENT` error for `index.html`.

- [ ] **Step 3: Create the complete semantic shell and local critical content**

Create `index.html` with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mike Eliovits — AI Engineer</title>
  <meta name="description" content="AI Engineer building practical LLM, NLP, computer vision, and backend AI applications.">
  <link rel="canonical" href="https://mike-elio.github.io/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Mike Eliovits — AI Engineer">
  <meta property="og:description" content="Practical AI systems, explainable recommendations, and reliable backend engineering.">
  <meta property="og:url" content="https://mike-elio.github.io/">
  <meta property="og:image" content="https://mike-elio.github.io/assets/og-card.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Mike Eliovits","url":"https://mike-elio.github.io/","jobTitle":"AI Engineer","sameAs":["https://github.com/mike-elio","https://www.linkedin.com/in/mike-eliovits-4861b3379/"],"knowsAbout":["LLM Applications","Natural Language Processing","Computer Vision","Backend AI Development"]}</script>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <script type="module" src="script.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <a class="brand" href="#main" aria-label="Mike Eliovits, home">ME<span>.</span></a>
    <button id="mobile-menu-button" class="menu-button" aria-controls="site-nav" aria-expanded="false" aria-label="Open navigation">Menu</button>
    <nav id="site-nav" aria-label="Primary navigation">
      <a href="#about">About</a><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#contact">Contact</a>
    </nav>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow">AI Engineer · Damascus, Syria</p><h1 id="hero-title">I build intelligent systems that turn ideas into <span>practical products.</span></h1><p>I'm Mike Eliovits, focused on LLM applications, NLP, computer vision, and reliable backend AI development.</p><div class="actions"><a class="button primary" href="#projects">View Projects</a><a class="button secondary" href="https://www.linkedin.com/in/mike-eliovits-4861b3379/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div><ul class="focus-strip" aria-label="Primary focus areas"><li>LLM Applications</li><li>NLP</li><li>Computer Vision</li><li>Backend AI</li></ul></div>
      <div class="portrait-frame"><span class="portrait-fallback" aria-hidden="true">ME</span><img src="assets/profile.jpg" alt="Mike Eliovits" width="400" height="400"><span class="availability">Open to opportunities</span></div>
    </section>
    <section id="about" class="section"><p class="section-kicker">01 / About</p><h2>Engineering useful AI, end to end.</h2><p>I build practical AI systems from experimentation and model evaluation through explainable product logic and backend API integration.</p></section>
    <section id="projects" class="section"><p class="section-kicker">02 / Selected Work</p><h2>Featured projects</h2><div class="project-grid"><article data-project="senior"><span class="project-number">01 · Featured</span><h3>GoalPath Expert System</h3><p>An interview-driven expert system for explainable career-track recommendations, fit scoring, strengths, and gap planning.</p><ul class="tag-list"><li>Python</li><li>FastAPI</li><li>Pydantic</li><li>pytest</li></ul><a href="https://github.com/mike-elio/senior">View source</a></article><article data-project="project-part2"><span class="project-number">02 · Featured</span><h3>Product &amp; Task Management Platform</h3><p>A Laravel application organizing product, task, and user workflows with a structured MVC backend.</p><ul class="tag-list"><li>Laravel</li><li>Eloquent</li><li>Vite</li></ul><a href="https://github.com/mike-elio/project-part2">View source</a></article><article data-project="game-discovery-platform"><span class="project-number">03 · Featured</span><h3>Game Discovery Platform</h3><p>A responsive discovery experience with category browsing, search, filtering, and a component-driven interface.</p><ul class="tag-list"><li>React</li><li>Vite</li><li>Tailwind CSS</li><li>shadcn/ui</li><li>React Query</li></ul><a href="https://github.com/mike-elio/game-discovery-platform">View source</a></article></div><div id="more-projects" hidden><h3>More projects</h3><div data-more-projects></div></div></section>
    <section id="skills" class="section"><p class="section-kicker">03 / Capabilities</p><h2>Technology with purpose.</h2><div class="skills-grid"><article><h3>Languages</h3><p>Python · JavaScript</p></article><article><h3>Backend</h3><p>FastAPI · Node.js · Laravel</p></article><article><h3>AI &amp; ML</h3><p>LLM Applications · NLP · Computer Vision · Machine Learning · Deep Learning</p></article><article><h3>Delivery</h3><p>Git · GitHub · REST APIs · Docker · Microsoft Azure (advancing)</p></article></div></section>
    <section id="contact" class="section contact"><p class="section-kicker">04 / Contact</p><h2>Let's build something useful.</h2><p>I'm open to AI/ML and backend AI opportunities where thoughtful engineering creates real-world value.</p><div class="actions"><a class="button primary" href="https://www.linkedin.com/in/mike-eliovits-4861b3379/">LinkedIn</a><a class="button secondary" href="https://github.com/mike-elio">GitHub</a></div></section>
  </main>
  <footer><span>© 2026 Mike Eliovits</span><span>Built for the web.</span></footer>
</body>
</html>
```

- [ ] **Step 4: Run the contract**

Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS for semantic content and privacy checks.

- [ ] **Step 5: Commit**

Run: `git add index.html tests/site-contract.test.mjs && git commit -m "feat: add semantic portfolio shell"`  
Expected: one commit containing the content shell and its contract.

### Task 2: Midnight-and-Orange Responsive Design

**Files:**
- Create: `styles.css`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: DOM classes and IDs from Task 1.
- Produces: CSS custom properties `--bg`, `--surface`, `--text`, `--muted`, `--accent`, responsive breakpoint at 760px, and reduced-motion behavior.

- [ ] **Step 1: Add failing CSS design tests**

```js
test("styles implement the approved responsive orange identity", async () => {
  const css = await read("styles.css");
  assert.match(css, /--accent:\s*#ff7a1a/i);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.project-grid/);
});
```

- [ ] **Step 2: Run the test and confirm it fails because `styles.css` is missing**

Run: `node --test tests/site-contract.test.mjs`  
Expected: FAIL with `ENOENT` for `styles.css`.

- [ ] **Step 3: Implement the responsive design system**

Create `styles.css` with exact tokens and component rules:

```css
:root{--bg:#080d14;--surface:#101823;--surface-2:#151f2c;--text:#f6f3ee;--muted:#9eabb9;--accent:#ff7a1a;--accent-soft:#ffb276;--line:rgba(255,255,255,.1);--max:1180px;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 80% 5%,rgba(255,122,26,.13),transparent 28%),var(--bg);color:var(--text);font:400 16px/1.7 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}img{display:block;max-width:100%}.skip-link{position:fixed;left:1rem;top:-4rem;z-index:100;background:var(--accent);color:#111;padding:.7rem 1rem}.skip-link:focus{top:1rem}.site-header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;max-width:var(--max);margin:auto;padding:1.2rem 2rem;background:rgba(8,13,20,.76);backdrop-filter:blur(18px);border-bottom:1px solid transparent}.site-header.is-scrolled{border-color:var(--line)}.brand{font-size:1.25rem;font-weight:900;text-decoration:none}.brand span,.hero h1 span,.section-kicker,.project-number{color:var(--accent)}nav{display:flex;gap:1.5rem}nav a{text-decoration:none;color:var(--muted);font-weight:650}nav a:hover{color:var(--text)}.menu-button{display:none}.hero,.section,footer{width:min(calc(100% - 4rem),var(--max));margin-inline:auto}.hero{min-height:82vh;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,.6fr);align-items:center;gap:5rem;padding:5rem 0}.eyebrow,.section-kicker,.project-number{font-size:.78rem;font-weight:850;text-transform:uppercase;letter-spacing:.14em}.hero h1{max-width:850px;margin:.6rem 0 1.4rem;font-size:clamp(3rem,7vw,6.8rem);line-height:.95;letter-spacing:-.065em}.hero-copy>p:not(.eyebrow){max-width:670px;color:var(--muted);font-size:1.1rem}.actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:2rem}.button{display:inline-flex;align-items:center;justify-content:center;padding:.86rem 1.15rem;border:1px solid var(--line);border-radius:.65rem;text-decoration:none;font-weight:800}.button.primary{background:var(--accent);border-color:var(--accent);color:#15100c}.button:hover{transform:translateY(-2px)}.focus-strip,.tag-list{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.5rem 0 0;padding:0;list-style:none}.focus-strip li,.tag-list li{padding:.35rem .6rem;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:.76rem}.portrait-frame{position:relative;min-height:280px;padding:10px;border:1px solid rgba(255,122,26,.45);border-radius:2rem;background:linear-gradient(145deg,rgba(255,122,26,.18),transparent)}.portrait-frame img{position:relative;z-index:1;aspect-ratio:1;object-fit:cover;border-radius:1.45rem}.portrait-fallback{position:absolute;inset:10px;display:grid;place-items:center;border-radius:1.45rem;background:var(--surface-2);color:var(--accent);font-size:5rem;font-weight:900}.portrait-frame.is-fallback img{display:none}.availability{z-index:2;position:absolute;right:-.7rem;bottom:1rem;padding:.55rem .75rem;border-radius:999px;background:var(--surface-2);border:1px solid var(--line);font-size:.75rem;font-weight:800}.section{padding:6rem 0;border-top:1px solid var(--line)}.reveal-ready .section{opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease}.reveal-ready .section.is-visible{opacity:1;transform:none}.section h2{max-width:800px;margin:.5rem 0 2rem;font-size:clamp(2.2rem,5vw,4.8rem);line-height:1.02;letter-spacing:-.045em}.section>p:not(.section-kicker){max-width:760px;color:var(--muted);font-size:1.08rem}.project-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.project-grid article,.skills-grid article{padding:1.5rem;border:1px solid var(--line);border-radius:1rem;background:linear-gradient(155deg,var(--surface-2),var(--surface))}.project-grid article:hover{border-color:rgba(255,122,26,.55);transform:translateY(-4px)}.project-grid p,.skills-grid p{color:var(--muted)}.project-grid a{font-weight:850;text-decoration-color:var(--accent);text-underline-offset:.3rem}.skills-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}.contact{text-align:center}.contact h2,.contact p,.contact .actions{margin-inline:auto;justify-content:center}footer{display:flex;justify-content:space-between;padding:2rem 0 3rem;color:var(--muted);border-top:1px solid var(--line)}:focus-visible{outline:3px solid var(--accent-soft);outline-offset:4px}.button,.project-grid article{transition:transform .2s ease,border-color .2s ease}
@media(max-width:760px){.site-header{padding:1rem}.hero,.section,footer{width:min(calc(100% - 2rem),var(--max))}.menu-button{display:block;background:transparent;color:var(--text);border:1px solid var(--line);border-radius:.5rem;padding:.55rem .7rem}nav{display:none;position:absolute;top:100%;left:1rem;right:1rem;flex-direction:column;padding:1rem;background:var(--surface-2);border:1px solid var(--line);border-radius:.8rem}nav.is-open{display:flex}.hero{grid-template-columns:1fr;min-height:auto;padding:4rem 0;gap:2.5rem}.hero h1{font-size:clamp(2.8rem,14vw,4.5rem)}.portrait-frame{width:min(78vw,340px);margin:auto}.project-grid,.skills-grid{grid-template-columns:1fr}.section{padding:4.5rem 0}footer{flex-direction:column;gap:.35rem}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
```

- [ ] **Step 4: Run the full test suite**

Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add styles.css tests/site-contract.test.mjs && git commit -m "feat: add responsive midnight portfolio design"`.

### Task 3: Progressive Enhancement and Future Projects

**Files:**
- Create: `script.js`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Produces: `filterPortfolioRepositories(repositories)` and `formatRepositoryName(name)` exports for deterministic tests.
- Consumes: `[data-header]`, `#mobile-menu-button`, `#site-nav`, `#more-projects`, and `[data-more-projects]`.

- [ ] **Step 1: Write failing behavior tests**

```js
test("repository filtering keeps only future portfolio-ready originals", async () => {
  const { filterPortfolioRepositories, formatRepositoryName } = await import("../script.js");
  const input = [
    { name:"new-ai-app", fork:false, archived:false, description:"Useful AI app", topics:["portfolio"], pushed_at:"2026-07-20" },
    { name:"task-manager-laravel", fork:true, archived:false, description:"Fork", topics:["portfolio"], pushed_at:"2026-07-21" },
    { name:"learngit", fork:false, archived:false, description:null, topics:[], pushed_at:"2026-07-19" },
    { name:"senior", fork:false, archived:false, description:"Featured", topics:["portfolio"], pushed_at:"2026-07-18" }
  ];
  assert.deepEqual(filterPortfolioRepositories(input).map((repo) => repo.name), ["new-ai-app"]);
  assert.equal(formatRepositoryName("new-ai-app"), "New AI App");
});

test("browser enhancement includes resilient portrait and reveal behavior", async () => {
  const script = await read("script.js");
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /is-fallback/);
});
```

- [ ] **Step 2: Run tests and confirm the missing module failure**

Run: `node --test tests/site-contract.test.mjs`  
Expected: FAIL because `script.js` is missing.

- [ ] **Step 3: Implement deterministic filtering and browser enhancement**

```js
const FEATURED = new Set(["senior", "project-part2", "game-discovery-platform"]);
const EXCLUDED = new Set(["mike-elio", "mike-elio.github.io", "learngit"]);

export function formatRepositoryName(name) {
  return name.split("-").map((part) => part.toLowerCase() === "ai" ? "AI" : part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function filterPortfolioRepositories(repositories) {
  return repositories.filter((repo) => !repo.fork && !repo.archived && repo.description && repo.topics?.includes("portfolio") && !FEATURED.has(repo.name) && !EXCLUDED.has(repo.name)).sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0,6);
}

function setupNavigation() {
  const button = document.querySelector("#mobile-menu-button");
  const nav = document.querySelector("#site-nav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
    }
  });
}

async function loadMoreProjects() {
  const section = document.querySelector("#more-projects");
  const grid = document.querySelector("[data-more-projects]");
  if (!section || !grid) return;
  try {
    const response = await fetch("https://api.github.com/users/mike-elio/repos?per_page=100&sort=pushed", { headers:{ Accept:"application/vnd.github+json" } });
    if (!response.ok) return;
    const repositories = filterPortfolioRepositories(await response.json());
    if (!repositories.length) return;
    grid.className = "project-grid";
    for (const repo of repositories) {
      const article = document.createElement("article");
      const title = document.createElement("h4");
      const copy = document.createElement("p");
      const link = document.createElement("a");
      title.textContent = formatRepositoryName(repo.name);
      copy.textContent = repo.description;
      link.href = repo.html_url;
      link.textContent = "View source";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      article.append(title, copy, link);
      grid.append(article);
    }
    section.hidden = false;
  } catch { section.hidden = true; }
}

function setupPortraitFallback() {
  const image = document.querySelector(".portrait-frame img");
  const frame = document.querySelector(".portrait-frame");
  if (!image || !frame) return;
  const showFallback = () => frame.classList.add("is-fallback");
  image.addEventListener("error", showFallback, { once:true });
  if (image.complete && image.naturalWidth === 0) showFallback();
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold:.12 });
  document.querySelectorAll(".section").forEach((section) => observer.observe(section));
}

if (typeof document !== "undefined") {
  setupNavigation();
  setupPortraitFallback();
  setupReveal();
  loadMoreProjects();
  const header = document.querySelector("[data-header]");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive:true });
}
```

- [ ] **Step 4: Verify JavaScript and behavior**

Run: `node --check script.js`  
Expected: no output and exit code 0.  
Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add script.js tests/site-contract.test.mjs && git commit -m "feat: add progressive portfolio project loading"`.

### Task 4: Portrait, Social Card, and Brand Assets

**Files:**
- Create: `assets/profile.jpg`
- Create: `assets/favicon.svg`
- Create: `assets/og-card.png`
- Create: `scripts/generate-og-card.sh`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: authenticated LinkedIn portrait bytes.
- Produces: stable local JPG and PNG assets referenced by `index.html`.

- [ ] **Step 1: Add failing binary asset tests**

```js
test("local brand assets exist and use expected formats", async () => {
  const profile = await readFile(new URL("../assets/profile.jpg", import.meta.url));
  const social = await readFile(new URL("../assets/og-card.png", import.meta.url));
  assert.deepEqual([...profile.subarray(0,3)], [0xff,0xd8,0xff]);
  assert.equal(profile.length > 10000, true);
  assert.deepEqual([...social.subarray(0,8)], [137,80,78,71,13,10,26,10]);
  assert.equal(social.length > 20000, true);
});
```

- [ ] **Step 2: Confirm the asset test fails**

Run: `node --test tests/site-contract.test.mjs`  
Expected: FAIL because `assets/profile.jpg` does not exist.

- [ ] **Step 3: Save the authenticated LinkedIn portrait locally**

Fetch the URL returned by `LINKEDIN_GET_MY_INFO` in an authenticated connector sandbox, verify `Content-Type: image/jpeg`, and write the bytes to `assets/profile.jpg`. Do not write the expiring source URL into any repository file.

- [ ] **Step 4: Create the favicon and deterministic Open Graph card**

Create `assets/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#080d14"/><path d="M14 44V20h7l11 15 11-15h7v24h-7V31L32 46 21 31v13z" fill="#ff7a1a"/></svg>
```

Create `scripts/generate-og-card.sh` with the installed ImageMagick executable:

```bash
#!/usr/bin/env bash
set -euo pipefail
mkdir -p assets
convert -size 1200x630 xc:'#080d14' \
  -fill '#ff7a1a' -draw 'rectangle 0,0 18,630' \
  -fill '#ff7a1a' -font DejaVu-Sans-Bold -pointsize 28 -gravity northwest -annotate +90+105 'AI ENGINEER' \
  -fill '#f6f3ee' -font DejaVu-Sans-Bold -pointsize 78 -gravity northwest -annotate +84+205 'Mike Eliovits' \
  -fill '#9eabb9' -font DejaVu-Sans -pointsize 36 -gravity northwest -annotate +90+340 'Practical AI systems. Reliable engineering.' \
  -fill '#ff7a1a' -draw 'circle 1040,320 1040,230' \
  -fill '#080d14' -font DejaVu-Sans-Bold -pointsize 54 -gravity northwest -annotate +990+303 'ME' \
  assets/og-card.png
```

- [ ] **Step 5: Run asset generation and tests**

Run: `bash scripts/generate-og-card.sh`  
Expected: `assets/og-card.png` is created.  
Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS.

- [ ] **Step 6: Commit**

Run: `git add assets scripts tests/site-contract.test.mjs && git commit -m "feat: add portfolio brand and social assets"`.

### Task 5: Recovery, Crawling, and Maintenance Documentation

**Files:**
- Create: `404.html`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `.nojekyll`
- Create: `README.md`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Produces: crawlable canonical metadata, a recovery route, and exact future project update instructions.

- [ ] **Step 1: Add failing support-file tests**

```js
test("support and maintenance files target the canonical site", async () => {
  const [notFound, robots, sitemap, readme] = await Promise.all([read("404.html"), read("robots.txt"), read("sitemap.xml"), read("README.md")]);
  assert.match(notFound, /Back to portfolio/);
  assert.match(robots, /Sitemap: https:\/\/mike-elio\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/mike-elio\.github\.io\/<\/loc>/);
  assert.match(readme, /topic `portfolio`/);
  assert.doesNotMatch(readme, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
});
```

- [ ] **Step 2: Confirm the new contract fails**

Run: `node --test tests/site-contract.test.mjs`  
Expected: FAIL because the support files are missing.

- [ ] **Step 3: Create the support files**

`robots.txt` must contain:

```text
User-agent: *
Allow: /
Sitemap: https://mike-elio.github.io/sitemap.xml
```

`sitemap.xml` must contain one canonical URL with a valid XML declaration. `404.html` must reuse the palette, identify the missing page, and link to `/`. `.nojekyll` must be empty. `README.md` must document `python3 -m http.server 8000`, project structure, GitHub Pages deployment, and the future workflow: finish a repository, make it public, add the topic `portfolio`, and provide a meaningful description.

- [ ] **Step 4: Run tests**

Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add 404.html robots.txt sitemap.xml .nojekyll README.md tests/site-contract.test.mjs && git commit -m "docs: add portfolio recovery and maintenance files"`.

### Task 6: Local Quality Gate

**Files:**
- Modify only files implicated by a failing check.

**Interfaces:**
- Consumes: the complete local site.
- Produces: a verified commit ready for remote publication.

- [ ] **Step 1: Run the deterministic suite**

Run: `node --test tests/site-contract.test.mjs`  
Expected: all tests PASS.

- [ ] **Step 2: Run syntax and placeholder scans**

Run: `node --check script.js`  
Expected: exit code 0.  
Run: `rg -n "T[O]DO|T[B]D|F[I]XME|[[:alnum:]._%+-]+@[[:alnum:].-]+\\.[A-Za-z]{2,}|media.licdn.com" --glob '!docs/**' .`
Expected: no matches.

- [ ] **Step 3: Validate internal files and external destinations**

Confirm every local `href`/`src` resolves to an existing file or anchor. Confirm the three featured repositories and the two contact destinations are reachable through authenticated GitHub/LinkedIn reads.

- [ ] **Step 4: Inspect the diff**

Run: `git status --short` and `git diff --check`  
Expected: only intended files are present and `git diff --check` has no output.

- [ ] **Step 5: Commit any quality corrections**

If the quality gate required a correction, commit only those corrections with `git commit -m "fix: complete portfolio quality gate"`. If no correction was required, record the passing commands without creating an empty commit.

### Task 7: Publish and Configure GitHub Pages

**Files:**
- Remote repository: `mike-elio/mike-elio.github.io`

**Interfaces:**
- Consumes: exact tested local files from Tasks 1–6.
- Produces: public site `https://mike-elio.github.io/` and configured repository metadata.

- [ ] **Step 1: Reconfirm the empty remote and public visibility**

Read repository metadata and root contents. Expected: public repository, default branch `main`, no user-created site files.

- [ ] **Step 2: Seed the empty repository**

Create `index.html` on the default branch with commit message `feat: initialize professional portfolio`. This initializes `main` in the empty repository.

- [ ] **Step 3: Publish the complete tested tree atomically**

Use one multi-file commit to upsert every production file, documentation file, test file, and binary asset. Encode JPG and PNG inputs as Base64 and text inputs as UTF-8. Commit message: `feat: publish professional AI portfolio`.

- [ ] **Step 4: Configure repository metadata and topics**

Set description to `Professional AI Engineer portfolio featuring practical AI systems, backend engineering, and selected projects.` Set homepage to `https://mike-elio.github.io/`. Disable wiki and projects, retain issues, and replace topics with `ai-engineer`, `artificial-intelligence`, `github-pages`, `portfolio`, `web-development`.

- [ ] **Step 5: Enable GitHub Pages**

Configure legacy Pages deployment from `main` and `/`, with HTTPS enforcement enabled.

- [ ] **Step 6: Verify the remote tree and deployment**

Re-read repository metadata and root contents, then fetch `index.html` from `main`. Confirm Pages is enabled, the homepage is correct, all expected files exist, and the remote HTML contains the three featured repository URLs without email or expiring LinkedIn media URLs.

- [ ] **Step 7: Verify the public site**

Open `https://mike-elio.github.io/` after deployment completes. Confirm HTTP success, title `Mike Eliovits — AI Engineer`, portrait and social image responses, navigation anchors, and project/contact links. If GitHub reports a pending build, poll status at short intervals until success or a concrete failure is returned.
