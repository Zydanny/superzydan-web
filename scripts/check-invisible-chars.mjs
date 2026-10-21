#!/usr/bin/env node
/*
 * Flags invisible or filler Unicode in site copy: zero-width characters,
 * non-breaking spaces, soft hyphens, bidi controls and the BOM.
 *
 *   node scripts/check-invisible-chars.mjs [files or folders...]
 *
 * Defaults to content/, app/, components/ and lib/. Exits 1 if anything is found.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const INVISIBLE_RANGES = [
  [0x00a0, 0x00a0], // no-break space
  [0x00ad, 0x00ad], // soft hyphen
  [0x180e, 0x180e], // Mongolian vowel separator
  [0x2000, 0x200f], // typographic spaces, zero-width, LTR/RTL marks
  [0x2028, 0x202f], // line/paragraph separators, bidi embeds, narrow no-break space
  [0x205f, 0x2064], // math space, word joiner, invisible operators
  [0x2066, 0x206f], // bidi isolates and deprecated format characters
  [0x3000, 0x3000], // ideographic space
  [0xfeff, 0xfeff], // byte order mark / zero-width no-break space
];
const isInvisible = (code) => INVISIBLE_RANGES.some(([low, high]) => code >= low && code <= high);
const EXTENSIONS = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".mjs", ".json", ".css"]);

const roots = process.argv.slice(2);
const targets = roots.length > 0 ? roots : ["content", "app", "components", "lib"];

function* walk(entry) {
  let stats;
  try {
    stats = statSync(entry);
  } catch {
    return;
  }
  if (stats.isDirectory()) {
    for (const name of readdirSync(entry)) yield* walk(path.join(entry, name));
  } else if (EXTENSIONS.has(path.extname(entry))) {
    yield entry;
  }
}

let found = 0;
for (const target of targets) {
  for (const file of walk(target)) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        [...line].forEach((char, column) => {
          const code = char.codePointAt(0);
          if (!isInvisible(code)) return;
          found += 1;
          const hex = code.toString(16).toUpperCase().padStart(4, "0");
          console.log(`${file}:${index + 1}:${column + 1}  U+${hex}`);
        });
      });
  }
}

if (found > 0) {
  console.log(`\n${found} invisible character(s) found.`);
  process.exit(1);
}
console.log("No invisible characters found.");
