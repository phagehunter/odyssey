# Odyssey Atlas

A single-page digital-humanities dashboard for the visual literary analysis of Homer's *Odyssey*, combining **distant reading** (computational visualization) with **close reading** (textual commentary with line citations).

## Three analytical dimensions

| View | Technique | What it shows |
|---|---|---|
| **Network Dynamics** | Force-directed graph (react-force-graph-2d) | Character interactions & divine interventions. Node size ∝ degree centrality; edge width ∝ interaction frequency; color = group/focal alignment. The 108 suitors are flattened into leader nodes (Antinous, Eurymachus) + regional aggregates (Dulichium 52, Same 24, Zacynthus 20, Ithaca 12, per *Od.* 16.245–253); the 50 palace maids aggregate with the 12 unfaithful maids split out. |
| **Spatial Topography** | Leaflet + CartoDB Dark Matter (keyless tiles) | Itineraries of Odysseus, Telemachus, and divine messengers. Solid lines = explicit, plausible routes; dashed = inferred/mythic-sea routes. Waypoints distinguish Historical / Contested / Mythological locations. |
| **Narrative Gravity** | D3 stream/area graph | Focalization share per book across Telemachus, Odysseus, Penelope, gods, and others. Books 9–12 carry a dual-timeline overlay: chronological frame (Phaeacian court) vs. diegetic flashback (the *Apologoi*). |

A **global book slider** (1–24) and **group toggles** (Ithacan loyalists, suitors coalition, divine entities, external civilizations/monsters) re-render every view in real time. Clicking any edge, path, waypoint, or node populates the **Close Reading panel** with summaries, thematic tags (xenia, nostos, metis…), and Greek-text line citations.

All data is embedded as TypeScript constants (`src/data/`) — no backend, no API keys.

## Develop & build

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Deploy to GitHub Pages

`vite.config.ts` uses `base: './'`, so the built `dist/` works from any subdirectory. Either:

- push `dist/` to a `gh-pages` branch (e.g. `npx gh-pages -d dist`), or
- use a GitHub Actions Pages workflow that runs `npm ci && npm run build` and uploads `dist/`.

No router is used (state-driven single view), so no 404/hash-routing workarounds are needed.

## Caveats

- Coordinates of mythological realms (Ogygia, Aeaea, the Underworld…) follow post-Alexandrian scholarly tradition and are **speculative by design** — the map encodes that uncertainty in its symbology.
- Focalization percentages and interaction weights are editorial estimates for visualization, not token counts.
