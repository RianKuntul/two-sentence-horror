// Two-Sentence Horror — make.fun entry (v2)
// Writes one horror story of exactly two sentences, up to 400 characters.
// Output: <MAKEFUN_OUTPUT_DIR or /output>/entry.txt
// Run: node main.ts (Node 22, type stripping — no enums, no namespaces)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORY =
  "In every photo my grandmother took of me as a child, there is a tall man standing behind me, just out of focus. She died before I was born.";

const MIN_CHARS = 1;
const MAX_CHARS = 400;

function countSentences(text: string): number {
  // Exactly two sentences: split on sentence-ending punctuation and
  // count the non-empty fragments.
  const fragments = text.split(/[.!?]+/).filter((f) => f.trim().length > 0);
  return fragments.length;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");

  // Read-back gate: exactly two sentences, 1-400 characters, not only whitespace.
  if (STORY.length < MIN_CHARS || STORY.length > MAX_CHARS) {
    throw new Error(
      `story is ${STORY.length} chars, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (STORY.trim().length === 0) {
    throw new Error("story must not be only whitespace");
  }
  if (countSentences(STORY) !== 2) {
    throw new Error(
      `story has ${countSentences(STORY)} sentences, must be exactly 2`,
    );
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, STORY, "utf8");

  // Read it back and refuse to finish unless what is on disk is exactly the gate-passing story.
  const onDisk = readFileSync(outPath, "utf8");
  if (onDisk !== STORY) {
    throw new Error("read-back mismatch: entry.txt does not match the story");
  }
  if (onDisk.length < MIN_CHARS || onDisk.length > MAX_CHARS) {
    throw new Error(`entry.txt is ${onDisk.length} chars, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (countSentences(onDisk) !== 2) {
    throw new Error("entry.txt does not contain exactly two sentences");
  }

  console.log(`wrote ${outPath} (${onDisk.length} chars, 2 sentences)`);
}

main();
