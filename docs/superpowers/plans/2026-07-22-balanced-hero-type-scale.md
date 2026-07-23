# Balanced Hero Type Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge the hero greeting and reduce the name while preserving a clear, responsive hierarchy.

**Architecture:** Keep the existing Hero markup unchanged and express the approved hierarchy entirely through the shared stylesheet. Protect the exact responsive ranges with the existing CSS contract suite.

**Tech Stack:** React, TypeScript, CSS, Node test runner, Vitest, Playwright

## Global Constraints

- Change font sizes only.
- Preserve all hero copy, colors, spacing, animation, and layout.
- Keep `Mike Eliovits` larger than `Hello, I'm` at desktop and mobile sizes.

---

### Task 1: Responsive hero type scale

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: Existing `.hero-eyebrow` and `.hero h1` selectors.
- Produces: Responsive greeting and name font-size contracts.

- [ ] **Step 1: Write the failing contract test**

Assert `.hero-eyebrow` uses `clamp(1.15rem, 2.2vw, 1.55rem)`, the default `.hero h1` uses `clamp(2.9rem, 6.5vw, 5.8rem)`, and the mobile override uses `clamp(2.65rem, 14vw, 4.25rem)`.

- [ ] **Step 2: Verify the new test fails**

Run: `node --test --test-name-pattern="hero greeting" tests/site-contract.test.mjs`

Expected: FAIL because the approved font-size declarations are absent.

- [ ] **Step 3: Implement the approved CSS values**

Add the eyebrow override and replace the desktop/mobile heading sizes with the exact values from Step 1.

- [ ] **Step 4: Verify the focused test passes**

Run: `node --test --test-name-pattern="hero greeting" tests/site-contract.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run the complete project verification**

Run: `npm run verify`

Expected: All checks exit successfully.

- [ ] **Step 6: Commit and deploy**

Commit the spec, plan, test, and CSS change, then push `main` so the existing protected GitHub Pages workflow can verify and deploy it.

