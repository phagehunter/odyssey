/**
 * Write static, crawlable pages into dist/ after `vite build`:
 *
 *   books/<n>/        the full Butler text of each book with its scenes and places
 *   characters/<id>/  every character with epithets, notes and cited scenes
 *   places/<id>/      every place with status, books and events
 *   notes/            Butler's footnotes
 *   books/, characters/, places/   index pages
 *   sitemap.xml       every page above plus the app
 *
 * Each page links into the app with a hash the app understands
 * (#character=odysseus, #place=troy, #book=9). Pure Node, no dependencies.
 *
 *   node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/index.html not found: run vite build first');
const SITE = 'https://curtishoffmann.com/odyssey/';
const load = (f) => JSON.parse(readFileSync(join(root, 'data', f), 'utf8'));
const characters = load('characters.json'), interactions = load('interactions.json'), locations = load('locations.json'),
  itineraries = load('itineraries.json'), titles = load('book-titles.json'), focal = load('focalization.json');
const text = (b) => JSON.parse(readFileSync(join(root, 'public', 'text', `book-${b}.json`), 'utf8'));
const notes = JSON.parse(readFileSync(join(root, 'public', 'text', 'notes.json'), 'utf8'));
const source = JSON.parse(readFileSync(join(root, 'public', 'text', 'source.json'), 'utf8'));
const byId = Object.fromEntries(characters.map((c) => [c.id, c]));
const locById = Object.fromEntries(locations.map((l) => [l.id, l]));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const today = new Date().toISOString().slice(0, 10);
const urls = [];

const CSS = `
:root{--bg:#020617;--panel:#0f172a;--line:#1e293b;--text:#e2e8f0;--dim:#a8b3c7;--sepia:#d9c19a;--em:#34d399;--amber:#fbbf24}
*{box-sizing:border-box;margin:0;padding:0}html{-webkit-text-size-adjust:100%;scrollbar-color:#334155 transparent}
body{background:var(--bg);color:var(--text);font-family:"Source Serif 4","Iowan Old Style",Georgia,serif;line-height:1.6;font-size:17px}
::selection{background:rgba(16,185,129,.35)}a{color:var(--sepia);text-underline-offset:3px}a:hover{color:#f3ead9}
:focus-visible{outline:2px solid #7cc4ff;outline-offset:3px;border-radius:3px}
.wrap{max-width:46rem;margin:0 auto;padding:0 1.25rem}
header.site{border-bottom:1px solid var(--line);background:rgba(15,23,42,.6)}
header.site .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1.5rem;padding-top:.9rem;padding-bottom:.9rem}
header.site .brand{font-family:"Cormorant Garamond",Georgia,serif;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--sepia);text-decoration:none;font-size:1rem}
header.site nav{display:flex;flex-wrap:wrap;gap:.25rem 1.1rem;margin-left:auto;font-family:"Source Sans 3",system-ui,sans-serif;font-size:.95rem}
header.site nav a{color:var(--dim);text-decoration:none;padding:.35rem 0;min-height:44px;display:inline-flex;align-items:center}header.site nav a:hover,header.site nav a[aria-current]{color:var(--text)}
main{padding:2.2rem 0 3rem}h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:clamp(1.9rem,5vw,2.7rem);line-height:1.15;color:#f8fafc;text-wrap:balance}
h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:1.45rem;color:var(--sepia);margin:2rem 0 .6rem;text-wrap:balance}
.kicker{font-family:"Source Sans 3",system-ui,sans-serif;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);margin-bottom:.5rem}
.lede{color:var(--dim);font-style:italic;margin:.5rem 0 1.2rem;text-wrap:pretty}p{text-wrap:pretty;margin:0 0 1em}
.open{display:inline-flex;align-items:center;gap:.5rem;min-height:44px;padding:.5rem 1.1rem;border:1px solid rgba(52,211,153,.5);border-radius:6px;color:#a7f3d0;text-decoration:none;font-family:"Source Sans 3",system-ui,sans-serif;font-size:.95rem;transition:border-color .15s ease-out,transform .15s ease-out}
.open:hover{border-color:var(--em);color:#d1fae5}.open:active{transform:scale(.96)}
.card{border:1px solid var(--line);border-radius:8px;background:rgba(15,23,42,.6);padding:1rem 1.1rem;margin:0 0 .8rem}
.card .meta{font-family:"Source Sans 3",system-ui,sans-serif;font-size:.85rem;color:var(--dim);display:flex;flex-wrap:wrap;gap:.3rem 1rem;margin-bottom:.35rem}
.card .insight{font-style:italic;color:var(--sepia);border-left:2px solid rgba(217,193,154,.5);padding-left:.7rem;margin-top:.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.5rem .9rem;list-style:none}
.grid a{display:flex;flex-direction:column;gap:.1rem;padding:.6rem .75rem;border-radius:6px;text-decoration:none;color:var(--text);min-height:44px;justify-content:center;transition:background .15s ease-out}
.grid a:hover{background:rgba(217,193,154,.08)}.grid .d{font-family:"Source Sans 3",system-ui,sans-serif;font-size:.8rem;color:var(--dim)}
.tag{display:inline-block;font-family:"Source Sans 3",system-ui,sans-serif;font-size:.8rem;padding:.1rem .55rem;border-radius:999px;border:1px solid var(--line);color:var(--dim);margin-right:.35rem}
.text p{font-size:1.05rem;line-height:1.8;margin-bottom:1.1em}.text p:first-of-type::first-letter{float:left;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.1em;line-height:.82;padding-right:.09em;color:var(--sepia)}
.pager{display:flex;justify-content:space-between;gap:1rem;margin-top:2rem;font-family:"Source Sans 3",system-ui,sans-serif}
footer.site{border-top:1px solid var(--line);padding:1.5rem 0 2.5rem;color:var(--dim);font-family:"Source Sans 3",system-ui,sans-serif;font-size:.85rem}
table{border-collapse:collapse;width:100%;font-family:"Source Sans 3",system-ui,sans-serif;font-size:.95rem}th,td{text-align:left;padding:.45rem .6rem;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--dim);font-weight:600}td.n{font-variant-numeric:tabular-nums;text-align:right}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;
writeFileSync(join(dist, 'static.css'), CSS.trim() + '\n');

function page({ path, title, description, h1, kicker, lede, body, jsonld, depth, current }) {
  const up = '../'.repeat(depth);
  const url = SITE + path;
  const nav = [['books/', 'Books'], ['characters/', 'Characters'], ['places/', 'Places'], ['notes/', "Butler's notes"], ['', 'Open the app']]
    .map(([p, l]) => `<a href="${up}${p}"${current === p ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:site_name" content="Odyssey Character Map"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Odyssey Character Map">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE}og-image.jpg">
<meta name="theme-color" content="#020617">
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${up}apple-touch-icon.png">
<link rel="stylesheet" href="${up}static.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [jsonld, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Curtis Hoffmann', item: 'https://curtishoffmann.com/' }, { '@type': 'ListItem', position: 2, name: 'Odyssey Character Map', item: SITE }, { '@type': 'ListItem', position: 3, name: h1, item: url }] }] })}</script>
</head>
<body>
<header class="site"><div class="wrap"><a class="brand" href="${up}">Odyssey Character Map</a><nav aria-label="Sections">${nav}</nav></div></header>
<main><div class="wrap">
${kicker ? `<div class="kicker">${esc(kicker)}</div>` : ''}
<h1>${esc(h1)}</h1>
${lede ? `<p class="lede">${lede}</p>` : ''}
${body}
</div></main>
<footer class="site"><div class="wrap"><p>Text: Samuel Butler's translation (1900), <a href="${source.url}">Project Gutenberg ebook #1727</a>, public domain. Character, place and scene data by <a href="https://curtishoffmann.com/">Curtis Hoffmann</a>, CC BY 4.0; code MIT, <a href="https://github.com/phagehunter/odyssey">source on GitHub</a>. Interaction weights and focalization shares are editorial estimates, not counts.</p></div></footer>
</body>
</html>
`;
  mkdirSync(join(dist, path), { recursive: true });
  writeFileSync(join(dist, path, 'index.html'), html);
  urls.push(url);
}

const scene = (i) => `<div class="card"><div class="meta"><span>Book ${i.book}</span><span>${esc(i.type.replace('_', ' '))}</span>${i.citation ? `<span>${esc(i.citation)}</span>` : ''}${i.nested_narrative ? '<span>nested narration</span>' : ''}</div><p><a href="../../characters/${i.source}/">${esc(byId[i.source]?.name)}</a> and <a href="../../characters/${i.target}/">${esc(byId[i.target]?.name)}</a>. ${esc(i.summary)}</p>${i.insight ? `<p class="insight">${esc(i.insight)}</p>` : ''}</div>`;

// Characters
const ALIGN = { Loyalist: 'Odysseus’ household and Ithacan loyalists', Ally: 'Achaean hosts of the Telemachy', Suitor: 'the suitors’ coalition', Antagonist: 'mortal collaborators of the suitors', Divine: 'the gods', Magical: 'enchantresses, nymphs and monsters', External: 'foreign peoples', Shade: 'the dead of the Nekyia' };
for (const c of characters) {
  const mine = interactions.filter((i) => i.source === c.id || i.target === c.id).sort((a, b) => a.book - b.book);
  const books = [...new Set(mine.map((i) => i.book))].sort((a, b) => a - b);
  const desc = `${c.name} in Homer's Odyssey: ${c.type.toLowerCase()}, ${ALIGN[c.alignment] || c.alignment}; ${mine.length} cited scene${mine.length === 1 ? '' : 's'} across Book${books.length === 1 ? '' : 's'} ${books.join(', ')}.`;
  page({
    path: `characters/${c.id}/`, depth: 2, current: 'characters/', title: `${c.name} · Odyssey Character Map`, description: desc.slice(0, 300),
    kicker: `${c.type} · ${c.alignment}`, h1: c.name,
    lede: c.epithets.length ? esc(c.epithets.join(' · ')) : '',
    body: `${c.group_size > 1 ? `<p>A collective node standing for ${c.group_size} individuals.</p>` : ''}${c.note ? `<p>${esc(c.note)}</p>` : ''}
<p><a class="open" href="../../#character=${c.id}">Open ${esc(c.name)} in the network view</a></p>
<h2>Cited scenes (${mine.length})</h2>${mine.map(scene).join('') || '<p>No recorded interactions.</p>'}`,
    jsonld: { '@type': 'Person', name: c.name, description: desc, additionalType: 'https://schema.org/CreativeWork', subjectOf: { '@type': 'Book', name: 'The Odyssey', author: { '@type': 'Person', name: 'Homer' } } },
  });
}
page({ path: 'characters/', depth: 1, current: 'characters/', title: 'Characters of the Odyssey · Odyssey Character Map', description: `${characters.length} characters and groups of Homer's Odyssey, each with epithets, alignment and every cited scene.`, kicker: `${characters.length} entries`, h1: 'Characters',
  body: `<ul class="grid">${characters.map((c) => `<li><a href="${c.id}/"><span>${esc(c.name)}</span><span class="d">${esc(c.type)} · ${esc(c.alignment)}</span></a></li>`).join('')}</ul>`,
  jsonld: { '@type': 'ItemList', name: 'Characters of the Odyssey', numberOfItems: characters.length } });

// Places
for (const l of locations) {
  const segs = itineraries.filter((s) => s.origin === l.id || s.destination === l.id);
  const desc = `${l.name}, a ${l.status.toLowerCase()} place in Homer's Odyssey (Books ${l.books.join(', ')}). ${l.note || ''}`.trim();
  page({
    path: `places/${l.id}/`, depth: 2, current: 'places/', title: `${l.name} · Odyssey Character Map`, description: desc.slice(0, 300),
    kicker: `${l.status} · Books ${l.books.join(', ')}`, h1: l.name, lede: l.note ? esc(l.note) : '',
    body: `<p>Coordinates used on the map: ${l.coordinates[0]}, ${l.coordinates[1]}${l.status !== 'Historical' ? ' (speculative, following post-Alexandrian tradition)' : ''}.</p>
<p><a class="open" href="../../#place=${l.id}">Open ${esc(l.name)} on the map</a></p>
<h2>What happens here</h2>${l.events.map((e) => `<div class="card"><div class="meta"><span>Book ${e.book}</span></div><p>${esc(e.description)}</p></div>`).join('')}
${segs.length ? `<h2>Journeys through ${esc(l.name)}</h2>${segs.map((s) => `<div class="card"><div class="meta"><span>${esc(s.character)}</span><span>Book ${s.book}</span><span>${s.inferred ? 'inferred route' : 'explicit route'}</span></div><p><a href="../${s.origin}/">${esc(locById[s.origin]?.name)}</a> to <a href="../${s.destination}/">${esc(locById[s.destination]?.name)}</a>. ${esc(s.summary)}</p></div>`).join('')}` : ''}`,
    jsonld: { '@type': 'Place', name: l.name, description: desc, geo: { '@type': 'GeoCoordinates', latitude: l.coordinates[0], longitude: l.coordinates[1] } },
  });
}
page({ path: 'places/', depth: 1, current: 'places/', title: 'Places of the Odyssey · Odyssey Character Map', description: `${locations.length} real, contested and mythological places of Homer's Odyssey, with the books and events that touch them.`, kicker: `${locations.length} entries`, h1: 'Places',
  body: `<ul class="grid">${locations.map((l) => `<li><a href="${l.id}/"><span>${esc(l.name)}</span><span class="d">${esc(l.status)} · Books ${l.books.join(', ')}</span></a></li>`).join('')}</ul>`,
  jsonld: { '@type': 'ItemList', name: 'Places of the Odyssey', numberOfItems: locations.length } });

// Books
let totalWords = 0;
for (let b = 1; b <= 24; b++) {
  const t = text(b);
  const words = t.paragraphs.reduce((n, p) => n + p.split(' ').length, 0); totalWords += words;
  const scenes = interactions.filter((i) => i.book === b);
  const here = locations.filter((l) => l.books.includes(b));
  const f = focal[b - 1];
  const argument = t.argument.charAt(0) + t.argument.slice(1).toLowerCase();
  const desc = `Book ${b} of Homer's Odyssey in Samuel Butler's translation: ${argument}. With ${scenes.length} cited scene${scenes.length === 1 ? '' : 's'}.`;
  page({
    path: `books/${b}/`, depth: 2, current: 'books/', title: `Book ${b}: ${titles[b]} · Odyssey Character Map`, description: desc.slice(0, 300),
    kicker: `Book ${b} of 24 · ${words.toLocaleString('en-US')} words`, h1: `Book ${b}: ${titles[b]}`, lede: esc(argument),
    body: `<p><a class="open" href="../../#book=${b}">Open Book ${b} in the app</a></p>
<h2>Who the book follows</h2><table><thead><tr><th>Focalization (editorial estimate)</th><th class="n">Share</th></tr></thead><tbody>${[['Telemachus', f.telemachus], ['Odysseus', f.odysseus], ['Penelope', f.penelope], ['The gods', f.gods], ['Others', f.other]].map(([k, v]) => `<tr><td>${k}</td><td class="n">${v}%</td></tr>`).join('')}</tbody></table>${f.nested ? `<p class="lede">Frame: ${esc(f.nested.frame)}. Diegesis: ${esc(f.nested.diegetic)}.</p>` : ''}
${here.length ? `<h2>Places</h2><p>${here.map((l) => `<a href="../../places/${l.id}/">${esc(l.name)}</a>`).join(' · ')}</p>` : ''}
<h2>Cited scenes (${scenes.length})</h2>${scenes.map(scene).join('') || '<p>No scenes recorded for this book.</p>'}
<h2>The text</h2><div class="text">${t.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
<nav class="pager" aria-label="Books">${b > 1 ? `<a href="../${b - 1}/">Book ${b - 1}</a>` : '<span></span>'}${b < 24 ? `<a href="../${b + 1}/">Book ${b + 1}</a>` : '<a href="../../notes/">Butler’s notes</a>'}</nav>`,
    jsonld: { '@type': 'Chapter', name: `Book ${b}: ${titles[b]}`, position: b, description: desc, wordCount: words, inLanguage: 'en', isPartOf: { '@type': 'Book', name: 'The Odyssey', author: { '@type': 'Person', name: 'Homer' }, translator: { '@type': 'Person', name: 'Samuel Butler' }, datePublished: '1900', isBasedOn: source.url } },
  });
}
page({ path: 'books/', depth: 1, current: 'books/', title: 'The 24 books of the Odyssey · Odyssey Character Map', description: `All 24 books of Homer's Odyssey in Samuel Butler's 1900 translation (${totalWords.toLocaleString('en-US')} words), each with its cited scenes, places and focalization.`, kicker: `24 books · ${totalWords.toLocaleString('en-US')} words`, h1: 'The twenty-four books',
  body: `<ul class="grid">${Array.from({ length: 24 }, (_, i) => i + 1).map((b) => `<li><a href="${b}/"><span>Book ${b}</span><span class="d">${esc(titles[b])}</span></a></li>`).join('')}</ul>`,
  jsonld: { '@type': 'Book', name: 'The Odyssey', author: { '@type': 'Person', name: 'Homer' }, translator: { '@type': 'Person', name: 'Samuel Butler' }, numberOfPages: 24, isBasedOn: source.url } });

// Notes
page({ path: 'notes/', depth: 1, current: 'notes/', title: "Samuel Butler's notes on the Odyssey · Odyssey Character Map", description: `The ${notes.count} footnotes Samuel Butler attached to his 1900 translation of the Odyssey, from the Project Gutenberg edition.`, kicker: `${notes.count} footnotes`, h1: "Butler’s notes",
  lede: 'Butler’s own notes to his translation. This edition does not anchor them in the text, so they are given here in his numbering.',
  body: `<ol>${notes.notes.map((n) => `<li id="n${n.n}" value="${n.n}"><p>${esc(n.text)}</p></li>`).join('')}</ol>`,
  jsonld: { '@type': 'CreativeWork', name: "Samuel Butler's notes on the Odyssey", author: { '@type': 'Person', name: 'Samuel Butler' }, isBasedOn: source.url } });

// Sitemap: app first, then every static page
const sm = [SITE, ...urls].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm}\n</urlset>\n`);
console.log(`prerendered ${urls.length} pages (${characters.length} characters, ${locations.length} places, 24 books, notes, 3 indexes) and a ${urls.length + 1}-URL sitemap`);
