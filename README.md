# Mike Eliovits — AI Engineer Portfolio

Animated, accessible React portfolio for Mike Eliovits, focused on practical AI systems, explainable decisions, and reliable backend delivery.

Live site: [mike-elio.github.io](https://mike-elio.github.io/)

## Stack

- Vite, React, TypeScript, and Tailwind CSS
- Zod validation with Formspree delivery and Cloudflare Turnstile
- Vitest and Testing Library unit tests, plus Node build-contract checks
- Playwright browser acceptance against the production preview, including axe-core checks
- A verified GitHub Actions workflow that publishes the built artifact to GitHub Pages

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.example` uses Cloudflare's official always-pass test site key. A production deployment uses repository variables named `VITE_FORMSPREE_FORM_ID` and `VITE_TURNSTILE_SITE_KEY`.

## Verification

The following checks are executable in this commit. The build values below are deliberately non-functional, non-secret placeholders that differ from the official test identifiers rejected by the publishable-artifact contract; never deploy this local artifact.

```bash
npm run lint
npm run typecheck
npm test
VITE_FORMSPREE_FORM_ID=contractformid VITE_TURNSTILE_SITE_KEY=0x0000000000000000000000000000000AA npm run build
npm run test:contract
npm run check:bundle
npx playwright install chromium
npm run test:e2e
```

The browser suite serves the existing `dist/` artifact and mocks Turnstile and Formspree, so it never sends a real contact request. The Pages workflow runs the complete audit, static, build, contract, bundle, and browser verification sequence before it uploads or deploys an artifact. It runs on pushes to `main` and can also be started manually.

## Production contact configuration

Before enabling the redesigned Pages deployment:

1. Activate the Formspree form with the private destination email.
2. Restrict the Formspree project to `mike-elio.github.io`.
3. Create a production Turnstile widget allowing `mike-elio.github.io`.
4. Store the Turnstile secret only in Formspree's CAPTCHA settings.
5. Add the Formspree form ID and Turnstile site key as GitHub repository variables.
6. Send one production test message and confirm delivery.

Keep the `_gotcha` honeypot enabled in the contact payload alongside Turnstile. The destination email, Turnstile secret, and any other private token never belong in this repository or the browser bundle; only the public Formspree form ID and Turnstile site key are exposed to the client.

## Rollback

For a source regression, revert the failing commit on `main` and push the revert; the Pages workflow will verify and redeploy the restored, known-good contents without rewriting repository history. If the source and artifact are known-good and the deployment failed only because of a transient infrastructure error, re-run that workflow in GitHub Actions. Do not copy production variables or secrets into a rollback commit, artifact, or support log.

## Content updates

Edit `src/data/portfolio.ts`. Public projects require a verified source URL. Private academic projects use `visibility: "case-study"` and cannot render a source-code action.

## Structure

- `src/data/portfolio.ts` — verified content and project visibility rules
- `src/components/` — reusable UI, motion, navigation, and timeline behavior
- `src/features/` — project dialog and protected contact flow
- `src/sections/` — page section composition
- `public/` — stable images and GitHub Pages support files
- `tests/` — static and publishable-build contracts
- `e2e/` — responsive, keyboard, reduced-motion, contact, and accessibility browser flows
- `.github/workflows/deploy-pages.yml` — verified GitHub Pages build and deployment pipeline

## License

Portfolio content and personal branding are © Mike Eliovits. Source code may be used as a learning reference; do not reuse the identity, portrait, or copy.
