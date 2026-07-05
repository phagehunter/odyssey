/**
 * Preprocess odyssey.mb.txt (Samuel Butler translation, Internet Classics
 * Archive) into per-book JSON files consumed by the in-app Text reader.
 *
 * Usage:  node scripts/build-text.mjs
 * Output: public/text/book-1.json … book-24.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = readFileSync(join(root, 'odyssey.mb.txt'), 'utf8');

const ROMAN = [
  'I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII',
  'XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV',
];

// Locate each "BOOK <roman>" heading line.
const markers = [];
const re = /^BOOK ([IVX]+)\s*$/gm;
let m;
while ((m = re.exec(raw)) !== null) {
  const num = ROMAN.indexOf(m[1]) + 1;
  if (num > 0) markers.push({ num, start: m.index + m[0].length });
}
if (markers.length !== 24) {
  throw new Error(`Expected 24 book markers, found ${markers.length}`);
}

const endIdx = raw.indexOf('\nTHE END');
mkdirSync(join(root, 'public', 'text'), { recursive: true });

for (let i = 0; i < markers.length; i++) {
  const { num, start } = markers[i];
  const stop = i + 1 < markers.length ? raw.lastIndexOf('BOOK', markers[i + 1].start) : endIdx;
  const body = raw.slice(start, stop);
  // Paragraphs are blank-line separated; unwrap hard line breaks within each.
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').replace(/\s*-{5,}\s*$/, '').trim())
    .filter((p) => p.length > 0 && !/^-+$/.test(p));
  writeFileSync(
    join(root, 'public', 'text', `book-${num}.json`),
    JSON.stringify({ book: num, paragraphs }),
  );
  console.log(`book-${num}.json: ${paragraphs.length} paragraphs`);
}
console.log('Done.');
