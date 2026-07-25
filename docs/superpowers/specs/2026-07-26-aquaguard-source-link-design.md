# AquaGuard AI Source Link Design

Date: 2026-07-26
Repository: mike-elio/mike-elio.github.io
Target branch: main

## Goal

Connect the existing AquaGuard AI project card to its public GitHub repository.

## Approved content

- Repository URL: `https://github.com/mike-elio/AquaGuard-AI`
- Keep AquaGuard AI's existing title, copy, features, and technology tags.

## Design

Change AquaGuard AI from a `case-study` project to a `public` project in the portfolio data. Add the approved GitHub URL as its `sourceUrl`.

The existing project dialog already renders a `View source code` link for public projects. It opens external source links in a new tab with `rel="noopener noreferrer"`, so no component or styling changes are required.

## Components and data flow

`src/data/portfolio.ts` remains the single source of truth. The existing Projects section passes the AquaGuard data to the existing card and dialog, which then exposes the source link.

## Compatibility and error handling

The discriminated `Project` type requires every public project to have a GitHub URL matching the portfolio owner's namespace. The supplied URL satisfies this constraint. No new runtime dependency or network request is introduced.

## Verification

- Add a focused test that opens AquaGuard AI and confirms the source link has the approved URL, opens in a new tab, and uses `noopener noreferrer`.
- Run the focused project test, lint, typecheck, unit tests, and production build.
