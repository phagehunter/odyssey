/**
 * Split the Project Gutenberg edition of Samuel Butler's Odyssey (1900)
 * into per-book JSON for the in-app reader and the static book pages.
 *
 *   node scripts/build-text.mjs
 *
 * Input:  text/pg1727.txt  (Project Gutenberg ebook #1727, plain text UTF-8,
 *         https://www.gutenberg.org/ebooks/1727, release of April 1999,
 *         most recently updated by Gutenberg in 2024; public domain)
 * Output: public/text/book-1.json … book-24.json   {book, argument, paragraphs}
 *         public/text/notes.json                    Butler's 187 footnotes
 *         public/text/source.json                   provenance record
 *
 * Butler's own one-line argument heads each book in capitals; it is kept
 * as "argument". His footnotes sit in a block at the end of the file and
 * are not anchored in the body text of this edition, so they are shipped
 * as a numbered appendix rather than inline.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'text', 'pg1727.txt');
const raw = readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
const lines = raw.split('\n');

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV'];

// Real headings are "BOOK I" alone on a line; the table of contents uses "BOOK I." with a period.
const heads = [];
lines.forEach((l, i) => {
  const m = /^BOOK ([IVX]+)$/.exec(l.trim());
  if (m && ROMAN.includes(m[1])) heads.push({ num: ROMAN.indexOf(m[1]) + 1, line: i });
});
if (heads.length !== 24 || heads.some((h, i) => h.num !== i + 1)) {
  throw new Error(`Expected BOOK I…XXIV in order, found ${heads.map((h) => h.num).join(',')}`);
}
// The table of contents also lists "FOOTNOTES:", so take the last occurrence.
const footStart = lines.length - 1 - [...lines].reverse().findIndex((l) => l.trim() === 'FOOTNOTES:');
const end = lines.findIndex((l) => l.startsWith('*** END OF THE PROJECT GUTENBERG EBOOK'));
if (footStart < 0 || end < 0) throw new Error('Footnotes or end marker not found');

const outDir = join(root, 'public', 'text');
mkdirSync(outDir, { recursive: true });

function paragraphs(block) {
  return block
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

let words = 0;
const summary = [];
for (let i = 0; i < 24; i++) {
  const from = heads[i].line + 1;
  const to = i + 1 < 24 ? heads[i + 1].line : footStart;
  const paras = paragraphs(lines.slice(from, to));
  // Butler's argument: the first paragraph, set in capitals.
  const argument = paras.shift().replace(/\.$/, '');
  if (argument !== argument.toUpperCase()) throw new Error(`Book ${i + 1}: argument not found (${argument.slice(0, 40)})`);
  const w = paras.reduce((n, p) => n + p.split(' ').length, 0);
  words += w;
  writeFileSync(join(outDir, `book-${i + 1}.json`), JSON.stringify({ book: i + 1, argument, paragraphs: paras }));
  summary.push(`book-${i + 1}.json: ${paras.length} paragraphs, ${w} words`);
}

// Footnotes: "[n] [ text ... ]" possibly spanning lines, blank-line separated.
const notes = [];
for (const p of paragraphs(lines.slice(footStart + 1, end))) {
  // One note in the Gutenberg file is typed "29[] [" instead of "[29] [".
  const m = /^\[?(\d+)\]?\s*\[?\]?\s*\[?\s*([\s\S]*?)\]?$/.exec(p);
  if (m) notes.push({ n: Number(m[1]), text: m[2].trim() });
}
writeFileSync(join(outDir, 'notes.json'), JSON.stringify({ translator: 'Samuel Butler', count: notes.length, notes }));

const sha = createHash('sha256').update(raw).digest('hex');
writeFileSync(join(outDir, 'source.json'), JSON.stringify({
  title: 'The Odyssey', author: 'Homer', translator: 'Samuel Butler (1900)',
  source: 'Project Gutenberg ebook #1727', url: 'https://www.gutenberg.org/ebooks/1727',
  file: 'text/pg1727.txt', bytes: statSync(src).size, sha256: sha, license: 'Public domain in the United States; Project Gutenberg License for the ebook file',
  books: 24, words, footnotes: notes.length, built: new Date().toISOString().slice(0, 10),
}, null, 1));
console.log(summary.join('\n'));
console.log(`notes.json: ${notes.length} footnotes · ${words} words of text · source.json written`);
