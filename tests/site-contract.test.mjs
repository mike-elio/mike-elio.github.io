import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path, encoding = "utf8") =>
  readFile(new URL(path, root), encoding);

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    '<link rel="canonical" href="https://mike-elio.github.io/">',
  ]) {
    assert.match(html, new RegExp(escapeRegExp(value)));
  }

  assert.doesNotMatch(html, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  assert.doesNotMatch(html, /media\.licdn\.com/i);
  assert.doesNotMatch(html, /task-manager-laravel/i);
});

test("index exposes essential accessibility hooks", async () => {
  const html = await read("index.html");

  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-controls="site-nav"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /alt="Mike Eliovits"/);
  assert.match(html, /aria-label="Primary focus areas"/);
  assert.doesNotMatch(html, /<dl[^>]+aria-label=/);
});

test("styles implement the approved responsive orange identity", async () => {
  const css = await read("styles.css");

  assert.match(css, /--accent:\s*#ff7a1a/i);
  assert.match(css, /--background:\s*#080d14/i);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.project-grid/);
  assert.match(css, /\.portrait-fallback/);
  assert.match(css, /\.reveal-ready/);
});

test("repository filtering keeps only future portfolio-ready originals", async () => {
  const { filterPortfolioRepositories, formatRepositoryName } = await import(
    "../script.js"
  );
  const input = [
    {
      name: "new-ai-app",
      fork: false,
      archived: false,
      description: "Useful AI application",
      topics: ["portfolio", "artificial-intelligence"],
      pushed_at: "2026-07-20T10:00:00Z",
    },
    {
      name: "older-nlp-tool",
      fork: false,
      archived: false,
      description: "NLP utility",
      topics: ["portfolio"],
      pushed_at: "2026-07-18T10:00:00Z",
    },
    {
      name: "task-manager-laravel",
      fork: true,
      archived: false,
      description: "Fork",
      topics: ["portfolio"],
      pushed_at: "2026-07-21T10:00:00Z",
    },
    {
      name: "learngit",
      fork: false,
      archived: false,
      description: null,
      topics: [],
      pushed_at: "2026-07-19T10:00:00Z",
    },
    {
      name: "senior",
      fork: false,
      archived: false,
      description: "Featured project",
      topics: ["portfolio"],
      pushed_at: "2026-07-17T10:00:00Z",
    },
  ];

  assert.deepEqual(
    filterPortfolioRepositories(input).map((repository) => repository.name),
    ["new-ai-app", "older-nlp-tool"],
  );
  assert.equal(formatRepositoryName("new-ai-app"), "New AI App");
  assert.equal(formatRepositoryName("llm-api-starter"), "LLM API Starter");
});

test("browser enhancement includes resilient navigation, portrait, and reveal behavior", async () => {
  const script = await read("script.js");

  assert.match(script, /IntersectionObserver/);
  assert.match(script, /is-fallback/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /api\.github\.com\/users\/mike-elio\/repos/);
  assert.match(script, /textContent/);
});

test("local brand assets exist and use stable web formats", async () => {
  const [profile, social, favicon] = await Promise.all([
    read("assets/profile.jpg", null),
    read("assets/og-card.png", null),
    read("assets/favicon.svg"),
  ]);

  assert.deepEqual([...profile.subarray(0, 3)], [0xff, 0xd8, 0xff]);
  assert.equal(profile.length > 8_000, true);

  assert.deepEqual([...social.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(social.readUInt32BE(16), 1200);
  assert.equal(social.readUInt32BE(20), 630);
  assert.equal(social.length > 10_000, true);

  assert.match(favicon, /<svg/);
  assert.match(favicon, /#ff7a1a/i);
});

test("deployment and maintenance files describe a complete GitHub Pages site", async () => {
  const [notFound, robots, sitemap, readme, noJekyll] = await Promise.all([
    read("404.html"),
    read("robots.txt"),
    read("sitemap.xml"),
    read("README.md"),
    read(".nojekyll"),
  ]);

  assert.match(notFound, /Page not found/i);
  assert.match(notFound, /^<!DOCTYPE html>/);
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /#ff7a1a/i);

  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(
    robots,
    /Sitemap:\s*https:\/\/mike-elio\.github\.io\/sitemap\.xml/i,
  );

  assert.match(sitemap, /<loc>https:\/\/mike-elio\.github\.io\/<\/loc>/i);
  assert.match(sitemap, /<lastmod>2026-07-21<\/lastmod>/i);

  assert.match(readme, /professional portfolio/i);
  assert.match(readme, /`portfolio` topic/i);
  assert.match(readme, /meaningful description/i);
  assert.doesNotMatch(readme, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  assert.equal(noJekyll, "");
});

test("metadata, internal navigation, and local assets resolve safely", async () => {
  const html = await read("index.html");
  const structuredDataMatch = html.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
  );
  assert.ok(structuredDataMatch, "Person structured data should exist");

  const structuredData = JSON.parse(structuredDataMatch[1]);
  assert.equal(structuredData["@type"], "Person");
  assert.equal(structuredData.name, "Mike Eliovits");
  assert.equal(structuredData.jobTitle, "AI Engineer");

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(fragment), `Missing fragment target: #${fragment}`);
  }

  const localPaths = [
    ...html.matchAll(/(?:href|src)="((?!https?:|#|\/)[^"]+)"/g),
  ].map((match) => match[1]);
  for (const path of localPaths) await access(new URL(path, root));

  for (const [link] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(link, /rel="noopener noreferrer"/);
  }
});
