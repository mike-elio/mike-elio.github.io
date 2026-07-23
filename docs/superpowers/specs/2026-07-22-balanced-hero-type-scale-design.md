# Balanced Hero Type Scale Design

## Goal

Improve the hero hierarchy by making `Hello, I'm` noticeably larger and `Mike Eliovits` smaller while keeping the name as the dominant text.

## Design

- Increase `.hero-eyebrow` with a responsive `clamp()` size.
- Reduce the desktop and mobile `.hero h1` responsive ranges.
- Preserve all existing copy, colors, spacing, animation, and layout.
- Keep the heading larger than the eyebrow at every supported viewport.

## Verification

- Add a CSS contract test for the three responsive font-size declarations.
- Run lint, type checking, unit tests, production build, contract tests, bundle-size checks, and browser tests before deployment.

