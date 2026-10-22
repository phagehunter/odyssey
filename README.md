# Odyssey Character Map

**Live site: [curtishoffmann.com/odyssey](https://curtishoffmann.com/odyssey/)**

A companion for reading Homer's *Odyssey* two ways at once. At a distance, through three visualizations built from the poem's characters, places and the scenes that connect them; and up close, through commentary with line citations and the complete Samuel Butler translation (1900) readable beside every view.

Everything in the app also exists as a plain page that works without JavaScript: [the 24 books](https://curtishoffmann.com/odyssey/books/) with the full text, [53 characters](https://curtishoffmann.com/odyssey/characters/), [17 places](https://curtishoffmann.com/odyssey/places/) and [Butler's footnotes](https://curtishoffmann.com/odyssey/notes/).

## The three views

| View | What it shows |
|---|---|
| **Network Dynamics** | A force-directed graph of who meets, helps or fights whom, including divine interventions. Node size follows degree centrality, edge width follows interaction frequency, color follows alignment. The 108 suitors are drawn as two leaders plus four regional groups (Od. 16.245–253); the 50 palace maids as one household node with the 12 unfaithful maids split out. A playback control animates the network book by book. A "show as table" button gives the same interactions as text. |
| **Spatial Topography** | A Leaflet map (OpenStreetMap tiles darkened with a CSS filter, no key) of the journeys of Odysseus, Telemachus and the divine messengers. Solid lines are explicit routes, dashed lines inferred or mythic. Places are marked historical, contested or mythological. |
| **Narrative Gravity** | A stream graph of whose point of view each book follows (Telemachus, Odysseus, Penelope, the gods, others), with a dual-timeline strip for Books 9 to 12, where Odysseus narrates his own flashback at the Phaeacian court. Also available as a table. |

A book slider (1 to 24) and four group toggles re-draw every view. Clicking a node, edge, route or waypoint opens the commentary panel; each citation there jumps the text reader to the cited passage (approximately, since Butler's prose has no line numbers). Character names in the text are live links back into the network.

Deep links: `#character=odysseus`, `#place=troy`, `#book=9`, `#view=map`. The static pages use them to open the app at the right place.

## Data

All data lives in `data/` as JSON, hand-curated and cited:

| File | Contents |
|---|---|
| `characters.json` | 53 characters and collective nodes: type, alignment, epithets, notes |
| `interactions.json` | 127 scenes between pairs of characters, each with a book, type, weight, summary and an *Od.* book.line citation |
| `locations.json` | 17 places with coordinates, status and the events that happen there |
| `itineraries.json` | 21 journey segments |
| `focalization.json` | focalization share per book (five categories) and the frame/diegesis split for Books 9 to 12 |
| `book-titles.json`, `book-lines.json`, `name-map.json` | editorial book titles, Greek line counts per book, Butler's Roman names mapped to character ids |

Interaction weights and focalization percentages are editorial estimates made for visualization, not counts. Coordinates of mythological realms (Ogygia, Aeaea, the Underworld) follow post-Alexandrian scholarly tradition and are speculative by design; the map encodes that in its symbology.

`node scripts/validate-data.mjs` checks that every id resolves, every book is 1 to 24, every citation parses and lies within the book's line count, and every text file exists. It runs at the start of every build.

## Text

The translation is Samuel Butler's (1900), from Project Gutenberg ebook #1727 (`text/pg1727.txt`, 117,042 words, public domain). `node scripts/build-text.mjs` splits it into `public/text/book-1.json` to `book-24.json` (each with Butler's one-line argument and the paragraphs), collects his 186 footnotes into `notes.json`, and records the source file's checksum in `source.json`. Butler uses Roman names (Ulysses, Minerva, Jove, Neptune, Mercury); `data/name-map.json` maps them to the character ids.

## Develop and build

```bash
npm ci
npm run dev        # Vite dev server
npm run build      # validate data, type-check, build the app, then pre-render the static pages into dist/
npm run preview    # serve dist/ locally
```

`scripts/prerender.mjs` runs after the Vite build and writes `dist/books/<n>/`, `dist/characters/<id>/`, `dist/places/<id>/`, `dist/notes/`, three index pages and a sitemap with all 99 URLs. The pages are plain HTML with their own small stylesheet (`dist/static.css`), so they load without the app bundle.

## Deploy

`.github/workflows/deploy.yml` runs `npm ci && npm run build` on every push to `main` and publishes `dist/` with the GitHub Pages Actions workflow (`actions/deploy-pages`). `vite.config.ts` uses `base: './'`, so the build works from the `/odyssey/` sub-path of curtishoffmann.com.

## Updating the data

1. Edit the JSON in `data/`. Keep the citation format `Od. 9.375–414` (comma-separated ranges and `ff.` are accepted).
2. Run `npm run validate`.
3. Commit; the deploy workflow rebuilds the app and the static pages.

## License

Code: MIT. Data in `data/`: CC BY 4.0. Text: public domain (Project Gutenberg ebook #1727). See `LICENSE`.
