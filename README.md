# Mike Eliovits — Professional Portfolio

A fast, accessible, single-page portfolio for Mike Eliovits, an AI Engineer
focused on practical AI systems and reliable software engineering.

Live site: [mike-elio.github.io](https://mike-elio.github.io/)

## Highlights

- Responsive midnight-navy interface with a professional orange accent
- Selected AI, backend, and web engineering projects
- Local profile and social-preview assets with no expiring image URLs
- Keyboard-friendly navigation, visible focus states, and reduced-motion support
- Open Graph, structured data, canonical metadata, sitemap, and custom 404 page
- Progressive loading for future GitHub projects

## Adding a future project

The featured cards in `index.html` are curated manually. The additional-projects
section discovers eligible repositories from the public GitHub API automatically.
To publish a new project there:

1. Finish and review the project before making the repository public.
2. Add a meaningful description in the repository settings.
3. Add the `portfolio` topic to the repository.
4. Keep the repository original, active, and unarchived.

The site will then include it automatically, without a deployment, unless it is
already one of the three manually featured repositories.

## Local preview

No build step is required. Start any static file server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Verification

Run the contract tests and JavaScript syntax check before publishing:

```bash
node --test tests/site-contract.test.mjs
node --check script.js
```

The Open Graph image can be regenerated after changing the headline or visual
identity:

```bash
bash scripts/generate-og-card.sh
```

## Structure

- `index.html` — semantic content, metadata, and featured projects
- `styles.css` — responsive visual system and accessibility states
- `script.js` — navigation, progressive effects, and project discovery
- `assets/` — stable profile, favicon, and social-preview images
- `404.html`, `robots.txt`, `sitemap.xml` — GitHub Pages support files
- `tests/` — zero-dependency site contract tests

## License

Portfolio content and personal branding are © Mike Eliovits. Source code may be
used as a learning reference; please do not reuse the identity, portrait, or copy.
