import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

function rule(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `Missing ${selector} CSS rule`);
  return css.slice(start, css.indexOf("}", start) + 1);
}

test("desktop data stream is twice the original width without affecting smaller screens", () => {
  assert.match(rule(styles, ".hero-data-flow"), /width:\s*100%/);
  const desktop = styles.match(/@media \(min-width:\s*1280px\)\s*\{([\s\S]*?)\n\}/)?.[1];
  assert.ok(desktop, "Desktop-specific hero positioning must exist");
  const flow = rule(desktop, ".hero-data-flow");
  assert.match(flow, /width:\s*200%/);
  assert.match(flow, /max-width:\s*1040px/);
  assert.match(flow, /justify-self:\s*start/);
});

test("desktop portrait shifts up and right while keeping the data stream beneath it", () => {
  const desktop = styles.match(/@media \(min-width:\s*1280px\)\s*\{([\s\S]*?)\n\}/)?.[1];
  assert.ok(desktop);
  const portrait = rule(desktop, ".hero-visual .portrait-orbit-wrap");
  assert.match(portrait, /transform:\s*translate\(3\.5rem,\s*-3\.5rem\)/);
  assert.match(portrait, /margin-bottom:\s*-3\.5rem/);
});
