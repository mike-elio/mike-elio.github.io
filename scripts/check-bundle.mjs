import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const defaultOutput = fileURLToPath(new URL("../dist/", import.meta.url));
const output = resolve(process.argv[2] ?? defaultOutput);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    else files.push(path);
  }
  return files;
}

async function gzipTotal(files) {
  const buffers = await Promise.all(files.map((path) => readFile(path)));
  return buffers.reduce(
    (total, buffer) => total + gzipSync(buffer).byteLength,
    0,
  );
}

const files = await collectFiles(output);
const javascript = files.filter((path) => extname(path).toLowerCase() === ".js");
const stylesheets = files.filter((path) => extname(path).toLowerCase() === ".css");

if (javascript.length === 0) {
  throw new Error(`No JavaScript bundles found in ${output}`);
}
if (stylesheets.length === 0) {
  throw new Error(`No CSS bundles found in ${output}`);
}

const jsBytes = await gzipTotal(javascript);
const cssBytes = await gzipTotal(stylesheets);
const budgets = { js: 160 * 1024, css: 50 * 1024 };

if (jsBytes > budgets.js || cssBytes > budgets.css) {
  throw new Error(
    `Bundle budget exceeded: JS ${jsBytes}/${budgets.js} bytes; CSS ${cssBytes}/${budgets.css} bytes`,
  );
}

process.stdout.write(
  `Bundle budget OK: JS ${jsBytes} bytes gzip; CSS ${cssBytes} bytes gzip\n`,
);
