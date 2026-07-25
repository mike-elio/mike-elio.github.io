# Remove GoalPath Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove GoalPath Expert System from the portfolio Projects gallery.

**Architecture:** Remove the `goalpath` object from the data-driven `projects` array. Existing components render only that array, so no UI implementation changes are needed. Update data and component tests to assert the four remaining projects and avoid testing the deleted project.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite.

## Global Constraints

- Remove only the `goalpath` entry from the `projects` data collection.
- Keep AquaGuard AI and all other projects unchanged.
- Do not alter any other portfolio section.
- Do not modify unrelated working-tree changes.

---

### Task 1: Remove GoalPath and update gallery contracts

**Files:**
- Modify: `src/data/portfolio.ts` — remove the object whose `slug` is `goalpath`
- Modify: `src/data/portfolio.test.ts` — expect four projects and omit GoalPath from public source URLs
- Modify: `src/features/projects/Projects.test.tsx` — expect four cards and remove the GoalPath dialog test

**Interfaces:**
- Consumes: `projects: readonly Project[]` from `src/data/portfolio.ts`.
- Produces: the existing `Projects` component renders four projects: Nahd AI Coaching Platform, AquaGuard AI, Product & Task Management Platform, and Game Discovery Platform.

- [ ] **Step 1: Write the failing tests**

In `src/data/portfolio.test.ts`, change the project count expectation to four and remove this public-project expectation:

```ts
{
  slug: "goalpath",
  sourceUrl: "https://github.com/mike-elio/senior",
},
```

In `src/features/projects/Projects.test.tsx`, change the article count expectation to four and remove the test named `shows a safe source link for a public project`, which opens GoalPath.

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm.cmd run test -- src/data/portfolio.test.ts src/features/projects/Projects.test.tsx`

Expected: FAIL because the data array still contains GoalPath and the rendered gallery still has five cards.

- [ ] **Step 3: Remove the GoalPath data object**

Delete the entire `projects` array object beginning with:

```ts
{
  slug: "goalpath",
```

and ending immediately before the AquaGuard AI object in `src/data/portfolio.ts`.

- [ ] **Step 4: Run the focused tests to verify they pass**

Run: `npm.cmd run test -- src/data/portfolio.test.ts src/features/projects/Projects.test.tsx`

Expected: PASS; the gallery contains four cards and no GoalPath source-link test remains.

- [ ] **Step 5: Run project verification**

Run:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
$env:VITE_FORMSPREE_FORM_ID='testformid'; $env:VITE_TURNSTILE_SITE_KEY='1x00000000000000000000AA'; npm.cmd run build
```

Expected: all commands exit successfully.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/data/portfolio.ts src/data/portfolio.test.ts src/features/projects/Projects.test.tsx
git commit -m "feat: remove GoalPath project"
```
