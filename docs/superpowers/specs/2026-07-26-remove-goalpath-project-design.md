# Remove GoalPath Project Design

Date: 2026-07-26
Repository: mike-elio/mike-elio.github.io
Target branch: main

## Goal

Remove GoalPath Expert System from the portfolio Projects gallery.

## Approved scope

- Remove only the GoalPath entry from the `projects` data collection.
- Keep AquaGuard AI and all other projects unchanged.
- Do not alter any other portfolio section.

## Design

`src/data/portfolio.ts` is the Projects gallery's source of truth. Removing the object with slug `goalpath` removes its card and dialog automatically through the existing data-driven UI.

Update focused tests to expect four projects and to remove assertions that open GoalPath or validate its GitHub URL. The remaining public project URLs, including AquaGuard AI, remain covered.

## Verification

- Run the projects component test and data test.
- Run lint, typecheck, all unit tests, and a production build with local non-production contact configuration.
