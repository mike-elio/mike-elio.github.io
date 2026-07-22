import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { gzipSync } from "node:zlib";

const execFileAsync = promisify(execFile);
const checker = new URL("../scripts/check-bundle.mjs", import.meta.url);

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-bundle-"));
  t.after(() => rm(directory, { force: true, recursive: true }));
  return directory;
}

async function runChecker(directory) {
  return execFileAsync(process.execPath, [checker.pathname, directory]);
}

function deterministicBytes(length) {
  const chunks = [];
  let size = 0;
  for (let index = 0; size < length; index += 1) {
    const chunk = createHash("sha256").update(String(index)).digest("hex");
    chunks.push(chunk);
    size += chunk.length;
  }
  return Buffer.from(chunks.join("").slice(0, length));
}

test("recursively sums nested JavaScript and CSS bundles", async (t) => {
  const directory = await fixture(t);
  const nested = join(directory, "chunks", "deep");
  await mkdir(nested, { recursive: true });
  const javascript = Buffer.from("console.log('nested bundle');\n");
  const css = Buffer.from("body{color:#f6f3ee}\n");
  await Promise.all([
    writeFile(join(nested, "app.js"), javascript),
    writeFile(join(nested, "app.css"), css),
  ]);

  const { stdout } = await runChecker(directory);
  assert.equal(
    stdout,
    `Bundle budget OK: JS ${gzipSync(javascript).byteLength} bytes gzip; CSS ${gzipSync(css).byteLength} bytes gzip\n`,
  );
});

test("fails when no JavaScript or no CSS bundle is emitted", async (t) => {
  const noJavascript = await fixture(t);
  const noCss = await fixture(t);
  await writeFile(join(noJavascript, "app.css"), "body{}\n");
  await writeFile(join(noCss, "app.js"), "export {};\n");

  await assert.rejects(runChecker(noJavascript), /No JavaScript bundles found/);
  await assert.rejects(runChecker(noCss), /No CSS bundles found/);
});

test("includes an over-budget nested bundle in enforcement", async (t) => {
  const directory = await fixture(t);
  const nested = join(directory, "chunks");
  await mkdir(nested, { recursive: true });
  await Promise.all([
    writeFile(join(nested, "oversized.js"), deterministicBytes(400 * 1024)),
    writeFile(join(directory, "app.css"), "body{}\n"),
  ]);

  await assert.rejects(runChecker(directory), /Bundle budget exceeded/);
});
