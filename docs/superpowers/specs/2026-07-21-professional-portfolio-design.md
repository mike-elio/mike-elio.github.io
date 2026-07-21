# Mike Eliovits Professional Portfolio — Design Specification

**Date:** 2026-07-21  
**Target repository:** `mike-elio/mike-elio.github.io`  
**Production URL:** `https://mike-elio.github.io/`

## 1. Purpose

Build a polished English-language portfolio that presents Mike Eliovits as an AI Engineer to recruiters, hiring managers, and professional contacts arriving from LinkedIn or GitHub. The first release must make the current work credible and easy to scan while remaining simple to extend as new projects become public.

The site is a focused professional portfolio, not a blog, dashboard, or résumé replacement.

## 2. Success Criteria

- A visitor understands Mike's role, focus, and strongest work within the first screen.
- The three featured projects are clearly described and link to original public repositories.
- The site works well on mobile, tablet, and desktop.
- It loads quickly on GitHub Pages without a framework runtime or external JavaScript dependency.
- LinkedIn and GitHub are the only published contact methods; no email address appears in the source or UI.
- A future public repository can appear in the additional-projects area after it receives a designated portfolio topic.
- The page remains useful if the GitHub API is unavailable.

## 3. Audience and Voice

Primary audience: technical recruiters and junior-to-midlevel AI/backend hiring teams.  
Secondary audience: engineers reviewing project quality.

Copy will be concise, confident, and factual. It will avoid inflated seniority claims, unsupported metrics, generic buzzwords, and skill claims that the user removed from the profile.

## 4. Visual Identity

The selected direction is **Midnight Intelligence with Orange Accent**.

- Background: deep midnight navy, not pure black.
- Primary accent: warm professional orange for calls to action, active states, small highlights, and project numbering.
- Text: warm white with muted blue-gray secondary copy.
- Surfaces: subtly lighter navy cards with restrained borders and shadows.
- Motion: short reveal and hover transitions only; all motion respects `prefers-reduced-motion`.
- Typography: a clean system-first sans-serif stack so the site remains fast and reliable.
- Portrait: the authenticated LinkedIn profile image, stored locally in the repository so the site does not depend on an expiring LinkedIn media URL. It appears once in the hero with a subtle orange ring.

The design must feel like an engineered product, not a neon terminal, gaming page, or generic portfolio template.

## 5. Information Architecture

### 5.1 Header

- Compact `ME` monogram and full-name accessible label.
- Links: About, Projects, Skills, Contact.
- Sticky behavior with a translucent background after scrolling.
- Mobile menu with keyboard and screen-reader support.

### 5.2 Hero

- Portrait, name, and role: `Mike Eliovits — AI Engineer`.
- Short positioning statement focused on practical AI systems and reliable backend delivery.
- Availability indicator for AI/ML and backend AI opportunities.
- Primary action: `View Projects`.
- Secondary action: `Connect on LinkedIn`.
- A small focus strip: LLM Applications, NLP, Computer Vision, Backend AI.

### 5.3 About

- Brief narrative covering end-to-end AI work, explainability, API integration, and cloud growth.
- No long biography, timeline, education claim beyond already verified public wording, or unverifiable performance numbers.

### 5.4 Featured Projects

The initial order is deliberate:

1. **GoalPath Expert System** — `mike-elio/senior`
   - Lead with explainable career-track recommendations, interview flow, fit scoring, strengths, and gap planning.
   - Technologies shown: Python, FastAPI, Pydantic, pytest.
2. **Product & Task Management Platform** — `mike-elio/project-part2`
   - Describe product, task, and user workflows in a Laravel web application.
   - Technologies shown: Laravel, Eloquent, Vite.
3. **Game Discovery Platform** — `mike-elio/game-discovery-platform`
   - Describe responsive discovery, category browsing, search, filtering, and the component-driven interface.
   - Technologies shown: React, Vite, Tailwind CSS, shadcn/ui, React Query.

Each card includes a project number, status, concise problem/solution copy, technology tags, and a GitHub source link. No live-demo link is shown unless a working deployment is verified.

The forked `task-manager-laravel` repository is not presented as an original featured project.

### 5.5 More Projects

- Fetch public repositories from the GitHub REST API at runtime.
- Include only non-fork, non-archived repositories with the topic `portfolio`.
- Exclude the profile repository, portfolio-site repository, and the three featured repositories.
- Render at most six additional projects, sorted by most recently pushed.
- If the request fails, hide this section cleanly; featured projects remain fully available from local content.

For future updates, Mike makes a finished repository public and adds the `portfolio` topic. No code edit is required for that repository to appear in More Projects.

### 5.6 Skills and Current Focus

Display only the approved profile stack:

- Languages: Python, JavaScript.
- Backend: FastAPI, Node.js, Laravel.
- AI/ML: Machine Learning, Deep Learning, NLP, Computer Vision, LLM Applications.
- Tools: Git, GitHub, REST APIs, Docker.
- Cloud: Microsoft Azure, clearly marked as an advancing focus rather than an expert claim.

Technologies omitted from the skills section may still appear on a project card when they factually describe that project's implementation.

### 5.7 Contact and Footer

- Closing call to discuss AI, ML, or backend AI opportunities.
- LinkedIn and GitHub links only.
- No contact form and no public email address.
- Footer includes Mike Eliovits, the current year, and a small `Built for the web` statement.

## 6. Technical Architecture

The site will use static, dependency-free HTML, CSS, and JavaScript so GitHub Pages can publish directly from `main` at the repository root.

Planned files:

- `index.html` — semantic content, metadata, and document structure.
- `styles.css` — responsive tokens, layout, components, and motion.
- `script.js` — navigation, reveal behavior, mobile menu, and optional GitHub project loading.
- `assets/profile.jpg` — locally stored LinkedIn portrait.
- `assets/favicon.svg` — monogram favicon.
- `assets/og-card.png` — 1200×630 social-sharing image for LinkedIn and other platforms.
- `404.html` — branded recovery page.
- `robots.txt` and `sitemap.xml` — crawl guidance.
- `README.md` — project purpose, local preview, structure, and update instructions.
- `.nojekyll` — ensures direct static-file serving.

No framework build pipeline, analytics tracker, contact backend, cookie banner, or package manager is required for the first release.

## 7. Content and Data Flow

All critical content is embedded locally in semantic HTML, including the three featured projects. JavaScript enhances the experience but is not required to read the portfolio.

The optional More Projects flow is:

1. Browser requests public repositories for `mike-elio` from GitHub.
2. Script filters by visibility, fork/archive state, exclusion list, and `portfolio` topic.
3. Script sorts and renders valid entries.
4. On rate limiting, network failure, or malformed data, it removes the empty section without showing an error to visitors.

## 8. Accessibility and Resilience

- Semantic landmarks, ordered heading hierarchy, visible focus states, and a skip-to-content link.
- Accessible labels for icon-only controls and the mobile menu.
- Sufficient text/background contrast, including orange states.
- Portrait includes meaningful alternative text; decorative effects are hidden from assistive technology.
- Keyboard navigation works for every control.
- Layout remains readable with JavaScript disabled.
- External links use safe new-tab attributes.
- Missing portrait falls back to an initials treatment without breaking the hero layout.

## 9. Search and Social Presentation

- Unique title and concise meta description.
- Canonical URL set to `https://mike-elio.github.io/`.
- Open Graph and Twitter card metadata using the local PNG social card.
- Structured Person data that includes only already-public professional links and no email address.
- Descriptive link text and clean project headings.
- `sitemap.xml` references the canonical root page.

## 10. Repository and Deployment Configuration

- Repository remains public.
- GitHub Pages publishes from `main` and `/` using the legacy branch source.
- HTTPS is enforced.
- Repository homepage points to the production site.
- Repository description and topics identify it as an AI Engineer portfolio.
- The site is verified after deployment through the public URL, not only through repository state.

## 11. Verification Plan

- Validate that required files and metadata exist.
- Validate HTML structure and check JavaScript syntax.
- Check every internal anchor and external project/contact URL.
- Confirm no email address, secret, placeholder, or expiring LinkedIn media URL appears in published source.
- Check desktop and mobile layout behavior with width-based inspection.
- Check focus styles, reduced-motion behavior, alt text, and heading order.
- Confirm GitHub Pages reports the intended source and the public URL returns the portfolio.
- Confirm the three featured repositories are public, original, and reachable.

## 12. Deferred Enhancements

The first release intentionally excludes a résumé download, blog, custom domain, contact form, analytics, project detail pages, and CMS. These can be added later when real content or a verified asset is available.

