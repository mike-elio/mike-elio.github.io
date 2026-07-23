import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { basename, extname } from "node:path";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const productionUrl = "https://mike-elio.github.io/";
const readRoot = (path, encoding = "utf8") =>
  readFile(new URL(path, root), encoding);
const readDist = (path, encoding = "utf8") =>
  readFile(new URL(path, dist), encoding);

const approvedJsonLd =
  '{"@context":"https://schema.org","@type":"Person","name":"Mike Eliovits","url":"https://mike-elio.github.io/","jobTitle":"AI Engineer","alumniOf":{"@type":"CollegeOrUniversity","name":"Arab International University"},"sameAs":["https://github.com/mike-elio","https://www.linkedin.com/in/mike-eliovits-4861b3379/"],"knowsAbout":["LLM Applications","Natural Language Processing","Computer Vision","Backend AI Development"]}';
const approvedCsp =
  "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'sha256-SVYAOca/ZymxLHJqsO2O5BjJjISPKCDbzb8lQD7OEH4=' https://challenges.cloudflare.com; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://formspree.io https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; form-action https://formspree.io; manifest-src 'self'; upgrade-insecure-requests";
const approvedPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mike Eliovits",
  url: productionUrl,
  jobTitle: "AI Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Arab International University",
  },
  sameAs: [
    "https://github.com/mike-elio",
    "https://www.linkedin.com/in/mike-eliovits-4861b3379/",
  ],
  knowsAbout: [
    "LLM Applications",
    "Natural Language Processing",
    "Computer Vision",
    "Backend AI Development",
  ],
};
const approvedPalette = new Set([
  "#080d14",
  "#05090f",
  "#101823",
  "#151f2c",
  "#0d141e",
  "#f6f3ee",
  "#9eabb9",
  "#c2cad3",
  "#ff7a1a",
  "#ffb276",
  "#b94b00",
  "#70df9b",
]);
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".csv",
  ".htm",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
  ".yaml",
  ".yml",
]);
const binaryExtensions = new Set([
  ".avif",
  ".br",
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".otf",
  ".pdf",
  ".png",
  ".ttf",
  ".wasm",
  ".webp",
  ".woff",
  ".woff2",
  ".zip",
]);

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1].toLowerCase(),
      match[2],
    ]),
  );
}

function openingTags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(
    ([tag]) => ({ tag, attributes: parseAttributes(tag) }),
  );
}

function singleton(items, description) {
  assert.equal(items.length, 1, `Expected one ${description}`);
  return items[0];
}

function exactMeta(html, key, value) {
  const meta = singleton(
    openingTags(html, "meta").filter(
      ({ attributes }) => attributes[key] === value,
    ),
    `meta[${key}="${value}"]`,
  );
  return meta.attributes;
}

async function collectFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = `${prefix}${entry.name}`;
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) files.push(...(await collectFiles(url, `${path}/`)));
    else files.push({ path, url });
  }
  return files;
}

function deployableFileType(path) {
  const extension = extname(path).toLowerCase();
  if (textExtensions.has(extension) || extension === "") return "text";
  if (binaryExtensions.has(extension)) return "binary";
  return "unknown";
}

function xmlValue(xml, element) {
  const matches = [
    ...xml.matchAll(new RegExp(`<${element}>([^<]*)</${element}>`, "g")),
  ];
  return singleton(matches, `<${element}>`)[1];
}

test("production HTML contains exact canonical, social, schema, and CSP metadata", async () => {
  const html = await readDist("index.html");
  const title = singleton(
    [...html.matchAll(/<title>([^<]*)<\/title>/g)],
    "document title",
  )[1];
  assert.equal(title, "Mike Eliovits — AI Engineer");

  const canonical = singleton(
    openingTags(html, "link").filter(
      ({ attributes }) => attributes.rel === "canonical",
    ),
    "canonical link",
  );
  assert.deepEqual(canonical.attributes, {
    rel: "canonical",
    href: productionUrl,
  });

  const expectedNamedMeta = {
    description:
      "AI Engineer building practical LLM, NLP, computer vision, and backend AI applications. Explore projects and academic case studies by Mike Eliovits.",
    referrer: "strict-origin-when-cross-origin",
    "twitter:card": "summary_large_image",
    "twitter:title": "Mike Eliovits — AI Engineer",
    "twitter:description":
      "Practical AI systems, explainable decisions, and reliable backend delivery.",
    "twitter:image": `${productionUrl}assets/og-card.png`,
  };
  for (const [name, content] of Object.entries(expectedNamedMeta)) {
    assert.deepEqual(exactMeta(html, "name", name), { name, content });
  }

  const expectedPropertyMeta = {
    "og:type": "website",
    "og:site_name": "Mike Eliovits Portfolio",
    "og:title": "Mike Eliovits — AI Engineer",
    "og:description":
      "Practical AI systems, explainable decisions, and reliable backend delivery.",
    "og:url": productionUrl,
    "og:image": `${productionUrl}assets/og-card.png`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "Mike Eliovits, AI Engineer",
  };
  for (const [property, content] of Object.entries(expectedPropertyMeta)) {
    assert.deepEqual(exactMeta(html, "property", property), {
      property,
      content,
    });
  }

  const cspMeta = exactMeta(html, "http-equiv", "Content-Security-Policy");
  assert.deepEqual(cspMeta, {
    "http-equiv": "Content-Security-Policy",
    content: approvedCsp,
  });
  assert.doesNotMatch(cspMeta.content, /\*|unsafe-inline|unsafe-eval/i);
  const directives = Object.fromEntries(
    cspMeta.content.split("; ").map((directive) => {
      const [name, ...values] = directive.split(" ");
      return [name, values];
    }),
  );
  assert.deepEqual(Object.keys(directives), [
    "default-src",
    "base-uri",
    "object-src",
    "script-src",
    "style-src",
    "img-src",
    "font-src",
    "connect-src",
    "frame-src",
    "form-action",
    "manifest-src",
    "upgrade-insecure-requests",
  ]);
  assert.doesNotMatch(directives["script-src"].join(" "), /data:|blob:/i);
  const approvedOrigins = new Set([
    "https://formspree.io",
    "https://challenges.cloudflare.com",
  ]);
  const cspOrigins = cspMeta.content.match(/https:\/\/[^\s;]+/g) ?? [];
  assert.deepEqual(new Set(cspOrigins), approvedOrigins);

  const structuredScripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ].filter((match) => parseAttributes(match[1]).type === "application/ld+json");
  const structured = singleton(structuredScripts, "Person JSON-LD script");
  assert.deepEqual(parseAttributes(structured[1]), {
    type: "application/ld+json",
  });
  assert.equal(structured[2], approvedJsonLd);
  assert.deepEqual(JSON.parse(structured[2]), approvedPerson);
  const calculatedHash = `sha256-${createHash("sha256")
    .update(structured[2], "utf8")
    .digest("base64")}`;
  assert.equal(
    calculatedHash,
    "sha256-SVYAOca/ZymxLHJqsO2O5BjJjISPKCDbzb8lQD7OEH4=",
  );
  assert.ok(directives["script-src"].includes(`'${calculatedHash}'`));
});

test("published artifact contains exact support-file and image contracts", async () => {
  await Promise.all(
    [
      "404.html",
      "robots.txt",
      "sitemap.xml",
      ".nojekyll",
      "assets/profile.jpg",
      "assets/og-card.png",
      "assets/favicon.svg",
    ].map((path) => access(new URL(path, dist))),
  );

  const [profile, social, favicon, robots, sitemap, notFound] =
    await Promise.all([
      readDist("assets/profile.jpg", null),
      readDist("assets/og-card.png", null),
      readDist("assets/favicon.svg"),
      readDist("robots.txt"),
      readDist("sitemap.xml"),
      readDist("404.html"),
    ]);
  assert.deepEqual([...profile.subarray(0, 3)], [0xff, 0xd8, 0xff]);
  assert.deepEqual(
    [...social.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(social.readUInt32BE(16), 1200);
  assert.equal(social.readUInt32BE(20), 630);
  assert.equal((await readDist(".nojekyll")).length, 0);
  assert.match(favicon, /#ff7a1a/i);

  const robotLines = robots
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  assert.deepEqual(robotLines, [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${productionUrl}sitemap.xml`,
  ]);

  const urlEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  const urlEntry = singleton(urlEntries, "sitemap URL entry")[1];
  assert.equal(xmlValue(urlEntry, "loc"), productionUrl);
  assert.equal(xmlValue(urlEntry, "lastmod"), "2026-07-22");
  assert.equal(xmlValue(urlEntry, "changefreq"), "monthly");
  assert.equal(xmlValue(urlEntry, "priority"), "1.0");

  const anchors = [...notFound.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  const backLink = singleton(anchors, "404 back link");
  assert.deepEqual(parseAttributes(backLink[1]), { href: "/" });
  assert.equal(backLink[2].trim(), "Back to portfolio");
});

test("published files are recursively classified and contain no private data", async () => {
  const files = await collectFiles(dist);
  const chunks = [];
  for (const file of files) {
    const name = basename(file.path);
    assert.doesNotMatch(
      name,
      /^\.?env(?:ironment)?(?:[._-].*)?$/i,
      `Forbidden environment filename: ${file.path}`,
    );
    assert.doesNotMatch(name, /\.map$/i, `Source map: ${file.path}`);
    const type = deployableFileType(file.path);
    assert.notEqual(type, "unknown", `Unclassified artifact: ${file.path}`);
    if (type === "text") chunks.push(await readFile(file.url, "utf8"));
  }

  const published = chunks.join("\n");
  const forbidden = [
    ["email address", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
    ["mailto link", /mailto:/i],
    ["source map directive", /sourceMappingURL/i],
    ["Formspree public test ID", /\btestformid\b/i],
    ["Turnstile public test ID", /1x00000000000000000000AA/i],
    [
      "secret or token marker",
      /\b(?:access[_-]?token|api[_-]?key|client[_-]?secret|github[_-]?token|private[_-]?key|turnstile[_-]?secret)\b/i,
    ],
    [
      "generic credential assignment",
      /\b(?:credential|password|passwd|secret|token)\s*[:=]\s*(?:["'`][^"'`\r\n]{4,}["'`]|[A-Za-z0-9+/_=-]{8,})/i,
    ],
    [
      "credential environment marker",
      /\b[A-Z][A-Z0-9_]*(?:API_KEY|PASSWORD|PRIVATE_KEY|SECRET|TOKEN)\b/,
    ],
    ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/i],
    ["GitHub token value", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
    ["AWS access key", /\bAKIA[A-Z0-9]{16}\b/],
    [
      "runtime or private GitHub URL",
      /(?:api\.github\.com|gist\.github\.com|raw\.githubusercontent\.com)/i,
    ],
    ["temporary LinkedIn media URL", /media\.licdn\.com/i],
    [
      "local or private-network URL",
      /https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)/i,
    ],
  ];
  for (const [description, pattern] of forbidden) {
    assert.doesNotMatch(published, pattern, `Published ${description}`);
  }

  const approvedGithubUrls = new Set([
    "https://github.com/mike-elio",
    "https://github.com/mike-elio/senior",
    "https://github.com/mike-elio/project-part2",
    "https://github.com/mike-elio/game-discovery-platform",
  ]);
  const githubUrls = new Set(
    published.match(/https:\/\/github\.com\/[\w./-]+/g) ?? [],
  );
  assert.deepEqual(githubUrls, approvedGithubUrls);
});

test("source relationships, palette, dependencies, and legacy removal are closed contracts", async () => {
  const [portfolio, packageJson, styles, index, generator] = await Promise.all([
    readRoot("src/data/portfolio.ts"),
    readRoot("package.json").then(JSON.parse),
    readRoot("src/styles.css"),
    readRoot("index.html"),
    readRoot("scripts/generate-og-card.sh"),
  ]);
  const publicFiles = await collectFiles(new URL("../public/", import.meta.url));
  const publicTextSources = await Promise.all(
    publicFiles
      .filter((file) => deployableFileType(file.path) === "text")
      .map((file) => readFile(file.url, "utf8")),
  );
  const paletteSources = [styles, index, generator, ...publicTextSources];

  const projectSection = portfolio
    .split("export const projects: readonly Project[] = [")[1]
    .split("export const education:")[0];
  const projectBlocks = projectSection.match(/\n {2}\{[\s\S]*?\n {2}\},/g) ?? [];
  const projectFields = projectBlocks.map((block) =>
    Object.fromEntries(
      [...block.matchAll(/\n {4}(slug|visibility|sourceUrl): "([^"]+)"/g)].map(
        (match) => [match[1], match[2]],
      ),
    ),
  );
  assert.deepEqual(
    projectFields
      .filter((project) => project.visibility === "public")
      .map(({ slug, sourceUrl }) => ({ slug, sourceUrl })),
    [
      {
        slug: "goalpath",
        sourceUrl: "https://github.com/mike-elio/senior",
      },
      {
        slug: "product-task-platform",
        sourceUrl: "https://github.com/mike-elio/project-part2",
      },
      {
        slug: "game-discovery",
        sourceUrl:
          "https://github.com/mike-elio/game-discovery-platform",
      },
    ],
  );
  assert.ok(
    projectFields
      .filter((project) => project.visibility === "case-study")
      .every((project) => project.sourceUrl === undefined),
  );

  const colors = paletteSources.flatMap((source) =>
    (source.match(/#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})\b/gi) ?? []).map(
      (color) => color.toLowerCase(),
    ),
  );
  for (const color of colors) {
    assert.ok(approvedPalette.has(color), `Unapproved palette color: ${color}`);
  }
  const cssColors = new Set(
    (styles.match(/#[\da-f]{6}\b/gi) ?? []).map((color) =>
      color.toLowerCase(),
    ),
  );
  assert.deepEqual(cssColors, approvedPalette);

  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), [
    "react",
    "react-dom",
    "zod",
  ]);
  await assert.rejects(access(new URL("../script.js", import.meta.url)));
  await assert.rejects(access(new URL("../styles.css", import.meta.url)));
  await access(new URL("../src/main.tsx", import.meta.url));
  await access(new URL("../package-lock.json", import.meta.url));
});

test("hero social links glow and numbered section kickers are larger", async () => {
  const styles = await readRoot("src/styles.css");

  assert.match(
    styles,
    /\.hero-socials a\s*\{[^}]*color:\s*var\(--accent-light\);[^}]*text-shadow:\s*0 0 18px rgb\(255 122 26 \/ 38%\);[^}]*\}/s,
  );
  assert.match(
    styles,
    /\.section-kicker\s*\{[^}]*font-size:\s*clamp\(\.95rem,\s*1\.4vw,\s*1\.1rem\);[^}]*\}/s,
  );
});

test("hero greeting is larger while the name keeps a balanced lead", async () => {
  const styles = await readRoot("src/styles.css");

  assert.match(
    styles,
    /\.hero-eyebrow\s*\{[^}]*font-size:\s*clamp\(1\.15rem,\s*2\.2vw,\s*1\.55rem\);[^}]*\}/s,
  );
  assert.match(
    styles,
    /\.hero h1\s*\{[^}]*font-size:\s*clamp\(2\.9rem,\s*6\.5vw,\s*5\.8rem\);[^}]*\}/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*639px\)[\s\S]*?\.hero h1\s*\{[^}]*font-size:\s*clamp\(2\.65rem,\s*14vw,\s*4\.25rem\);[^}]*\}/,
  );
});

test("deployment workflow uses locked installs, complete verification, pinned actions, and least privilege", async () => {
  const workflow = await readRoot(".github/workflows/deploy-pages.yml");
  const dependabot = await readRoot(".github/dependabot.yml");

  assert.match(workflow, /push:\s*\n\s+branches:\s*\[main\]/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /permissions:\s*\n\s+contents:\s*read/);
  assert.match(workflow, /concurrency:\s*\n\s+group:\s*pages\s*\n\s+cancel-in-progress:\s*true/);

  for (const command of [
    "npm ci",
    "npm audit --audit-level=high",
    "npm run lint",
    "npm run typecheck",
    "npm test",
    "npm run build",
    "npm run test:contract",
    "npm run check:bundle",
    "npx playwright install --with-deps chromium",
    "npm run test:e2e",
  ]) {
    assert.ok(workflow.includes(command), `Missing workflow command: ${command}`);
  }
  assert.match(
    workflow,
    /VITE_FORMSPREE_FORM_ID:\s*\$\{\{ vars\.VITE_FORMSPREE_FORM_ID \}\}/,
  );
  assert.match(
    workflow,
    /VITE_TURNSTILE_SITE_KEY:\s*\$\{\{ vars\.VITE_TURNSTILE_SITE_KEY \}\}/,
  );
  assert.match(
    workflow,
    /EXPECTED_FORMSPREE_FORM_ID:\s*\$\{\{ vars\.VITE_FORMSPREE_FORM_ID \}\}/,
  );

  const actionReferences = [
    ...workflow.matchAll(/^\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm),
  ].map((match) => match[1]);
  assert.equal(actionReferences.length, 5);
  for (const reference of actionReferences) {
    assert.match(
      reference,
      /^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/,
      `Action is not pinned to a full commit SHA: ${reference}`,
    );
  }
  assert.doesNotMatch(workflow, /uses:\s*[^\s]+@v\d+\s*$/m);

  const deployJob = workflow.split(/^\s{2}deploy:\s*$/m)[1];
  assert.ok(deployJob, "Missing deploy job");
  assert.match(deployJob, /needs:\s*build/);
  assert.match(
    deployJob,
    /permissions:\s*\n\s+pages:\s*write\s*\n\s+id-token:\s*write/,
  );
  assert.match(
    deployJob,
    /environment:\s*\n\s+name:\s*github-pages\s*\n\s+url:\s*\$\{\{ steps\.deployment\.outputs\.page_url \}\}/,
  );
  assert.equal((workflow.match(/pages:\s*write/g) ?? []).length, 1);
  assert.equal((workflow.match(/id-token:\s*write/g) ?? []).length, 1);
  assert.match(
    workflow,
    /uses:\s*actions\/upload-pages-artifact@[0-9a-f]{40}[\s\S]*?with:\s*\n\s+path:\s*\.\/dist\s*\n\s+include-hidden-files:\s*true/,
  );
  assert.match(workflow, /actions\/configure-pages@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/deploy-pages@[0-9a-f]{40}/);

  for (const ecosystem of ["npm", "github-actions"]) {
    assert.match(dependabot, new RegExp(`package-ecosystem: "${ecosystem}"`));
  }
  assert.equal((dependabot.match(/interval:\s*"weekly"/g) ?? []).length, 2);
  assert.equal((dependabot.match(/day:\s*"monday"/g) ?? []).length, 2);
  assert.equal(
    (dependabot.match(/timezone:\s*"America\/Toronto"/g) ?? []).length,
    2,
  );
  assert.equal(
    (dependabot.match(/open-pull-requests-limit:\s*5/g) ?? []).length,
    2,
  );
});
