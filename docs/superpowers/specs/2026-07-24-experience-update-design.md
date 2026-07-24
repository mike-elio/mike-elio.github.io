# Experience Section Update Design

Date: 2026-07-24
Repository: mike-elio/mike-elio.github.io
Target branch: main

## Goal

Replace the two academic-project entries currently displayed in the Experience section with one professional internship entry for EARTech Information Technology. Keep the separate Projects section unchanged.

## Approved content

- Role: Artificial Intelligence with Coding & Cybersecurity
- Organization: EARTech Information Technology
- Employment type: Internship
- Dates: Aug 2025 – Sep 2025
- Duration: 2 mos
- Location: Syria
- Work arrangement: Remote
- Description: Completed a professional training program in Artificial Intelligence, Coding, and Cybersecurity. Built practical skills in Python, network security, secure software development, and hands-on cybersecurity exercises using Hack The Box, while exploring real-world AI applications.
- Skills: Python (Programming Language), Front-End Web Development, Laravel, Hack The Box, Artificial Intelligence (AI), Network Security

The entry must contain no external links and no logo.

## Design

Generalize the Experience data model from academic-project-specific fields to professional-experience fields. The Experience section will render a single timeline card using the existing visual language and responsive layout.

The card hierarchy will be:

1. Role title
2. Organization and employment type
3. Date range and duration
4. Location and work arrangement
5. Description
6. Skill tags

Academic-only labels such as project name, academic context, collaboration, and project feature bullets will not appear in Experience.

## Components and data flow

The source of truth remains `src/data/portfolio.ts`. The `Experience` interface and `experiences` array will be updated there. `src/sections/Experience.tsx` will consume the generalized fields without embedding portfolio copy in the component.

No changes are required to the Projects data or `src/sections/Projects.tsx`.

## Compatibility and error handling

All new fields are required strings or a required readonly skills array, preventing partially rendered experience cards at compile time. No remote content, image, or link loading is introduced, so the section has no new runtime failure mode.

## Verification

- Add or update a focused component test confirming the EARTech role, organization, internship metadata, dates, location, description, and skill tags render.
- Confirm the two former academic project entries no longer render inside Experience.
- Confirm the Projects section still renders its existing projects.
- Run lint, typecheck, unit tests, build, contract checks, bundle checks, and browser tests using the repository verification scripts.
