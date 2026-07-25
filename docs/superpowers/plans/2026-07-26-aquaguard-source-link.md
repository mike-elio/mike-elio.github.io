# AquaGuard AI Source Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing AquaGuard AI project expose its public GitHub source link in the project dialog.

**Architecture:** Keep `src/data/portfolio.ts` as the source of truth. Change AquaGuard's discriminated project variant from `case-study` to `public` and add its GitHub URL; the existing `ProjectDialog` will render the source action automatically. Extend the existing project-dialog test to validate the new public project link.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite.

## Global Constraints

- Use exactly `https://github.com/mike-elio/AquaGuard-AI` as the source URL.
- Preserve AquaGuard AI's existing title, copy, features, and technologies.
- The source link must retain the existing secure external-link attributes: `target="_blank"` and `rel="noopener noreferrer"`.
- Do not modify unrelated working-tree changes.

---

### Task 1: AquaGuard project data and dialog test

**Files:**
- Modify: `src/data/portfolio.ts` — AquaGuard AI entry in `projects`
- Modify: `src/features/projects/Projects.test.tsx` — public source-link coverage

**Interfaces:**
- Consumes: `Project` union in `src/data/portfolio.ts`, where `PublicProject` requires `visibility: "public"` and `sourceUrl`.
- Produces: AquaGuard AI renders through the existing `ProjectDialog` source-link branch with the public repository URL.

- [ ] **Step 1: Write the failing test**

Add this test adjacent to the existing public-project source-link test in `src/features/projects/Projects.test.tsx`:

```tsx
it("shows AquaGuard AI's public GitHub source link", async () => {
  const user = userEvent.setup();
  render(<Projects />);
  await user.click(
    screen.getByRole("button", { name: "View case study: AquaGuard AI" }),
  );
  expect(screen.getByRole("link", { name: "View source code" })).toMatchObject({
    href: "https://github.com/mike-elio/AquaGuard-AI",
    target: "_blank",
    rel: "noopener noreferrer",
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run test -- src/features/projects/Projects.test.tsx`

Expected: FAIL because AquaGuard AI is still a case study and the dialog has no source link.

- [ ] **Step 3: Make the minimal data change**

In the AquaGuard entry in `src/data/portfolio.ts`, replace:

```ts
visibility: "case-study",
```

with:

```ts
visibility: "public",
sourceUrl: "https://github.com/mike-elio/AquaGuard-AI",
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm run test -- src/features/projects/Projects.test.tsx`

Expected: PASS, including the new AquaGuard source-link assertion.

- [ ] **Step 5: Run project verification**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: all commands exit successfully.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/data/portfolio.ts src/features/projects/Projects.test.tsx
git commit -m "feat: link AquaGuard AI source"
```
