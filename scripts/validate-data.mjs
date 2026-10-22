/**
 * Validate data/*.json: ids are unique, every reference resolves, books are
 * 1–24, citations parse, and the text files exist. Exits 1 on any problem.
 *
 *   node scripts/validate-data.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = (f) => JSON.parse(readFileSync(join(root, 'data', f), 'utf8'));
const characters = load('characters.json'), interactions = load('interactions.json'), locations = load('locations.json'),
  itineraries = load('itineraries.json'), focalization = load('focalization.json'), titles = load('book-titles.json'),
  lines = load('book-lines.json'), names = load('name-map.json');
const problems = [];
const bad = (m) => problems.push(m);
const ids = new Set();
for (const c of characters) {
  if (ids.has(c.id)) bad(`duplicate character id ${c.id}`); ids.add(c.id);
  if (!c.name || !c.type || !c.alignment || !Array.isArray(c.epithets) || typeof c.group_size !== 'number') bad(`character ${c.id} missing fields`);
}
const locs = new Set();
for (const l of locations) {
  if (locs.has(l.id)) bad(`duplicate location id ${l.id}`); locs.add(l.id);
  if (!Array.isArray(l.coordinates) || l.coordinates.length !== 2) bad(`location ${l.id} coordinates`);
  for (const b of l.books) if (b < 1 || b > 24) bad(`location ${l.id} book ${b}`);
  for (const e of l.events) if (e.book < 1 || e.book > 24) bad(`location ${l.id} event book ${e.book}`);
}
// "Od. 9.375–414", "Od. 22.116 ff." and comma-separated lists such as "Od. 2.267–295, 2.382–406"
const cite = /^Od\. (\d{1,2})\.(\d{1,4})(?:[–-](\d{1,4}))?(?: ff\.)?$/;
const citeParts = (c) => c.split(/,\s*/).map((part, k) => (k === 0 ? part : 'Od. ' + part));
let cited = 0;
interactions.forEach((i, n) => {
  if (!ids.has(i.source)) bad(`interaction ${n}: unknown source ${i.source}`);
  if (!ids.has(i.target)) bad(`interaction ${n}: unknown target ${i.target}`);
  if (i.book < 1 || i.book > 24) bad(`interaction ${n}: book ${i.book}`);
  if (typeof i.weight !== 'number' || i.weight <= 0) bad(`interaction ${n}: weight`);
  if (i.citation) {
    cited++;
    for (const part of citeParts(i.citation)) {
      const m = cite.exec(part);
      if (!m) { bad(`interaction ${n}: citation "${i.citation}" does not parse`); continue; }
      if (Number(m[1]) !== i.book) bad(`interaction ${n}: citation book ${m[1]} vs book ${i.book}`);
      if (Number(m[2]) > lines[m[1]]) bad(`interaction ${n}: line ${m[2]} beyond book ${m[1]} (${lines[m[1]]} lines)`);
    }
  }
});
for (const s of itineraries) {
  if (!locs.has(s.origin)) bad(`itinerary ${s.character} ${s.segment}: unknown origin ${s.origin}`);
  if (!locs.has(s.destination)) bad(`itinerary ${s.character} ${s.segment}: unknown destination ${s.destination}`);
  if (s.book < 1 || s.book > 24) bad(`itinerary ${s.character} ${s.segment}: book ${s.book}`);
}
if (focalization.length !== 24) bad(`focalization has ${focalization.length} rows`);
for (const r of focalization) {
  const sum = r.telemachus + r.odysseus + r.penelope + r.gods + r.other;
  if (Math.abs(sum - 100) > 1) bad(`focalization book ${r.book} sums to ${sum}`);
}
for (let b = 1; b <= 24; b++) {
  if (!titles[b]) bad(`book ${b} has no title`);
  if (!lines[b]) bad(`book ${b} has no line count`);
  if (!existsSync(join(root, 'public', 'text', `book-${b}.json`))) bad(`public/text/book-${b}.json missing (run scripts/build-text.mjs)`);
}
for (const id of Object.values(names)) if (!ids.has(id)) bad(`name-map points at unknown character ${id}`);
console.log(`${characters.length} characters, ${interactions.length} interactions (${cited} with citations), ${locations.length} places, ${itineraries.length} itinerary segments, ${focalization.length} focalization rows, ${Object.keys(names).length} name aliases`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('data valid');
