import { CHARACTER_BY_ID } from '../data/characters';
import { LOCATION_BY_ID } from '../data/locations';
import { INTERACTIONS } from '../data/interactions';
import { ALIGNMENT_COLORS, useFilters } from '../context/FilterContext';
import { ITINERARY_COLORS, ITINERARY_LABELS } from './MapView';
import type { Interaction, InteractionType } from '../types';

/** Thematic tags inferred from interaction type — the DH close-reading vocabulary. */
const TYPE_THEMES: Record<InteractionType, string[]> = {
  conversation: ['Dialogue'],
  divine_intervention: ['Divine Machinery'],
  combat: ['Bia (Force)'],
  hospitality: ['Xenia (Guest-friendship)'],
  deception: ['Metis · Dolos (Cunning)'],
  recognition: ['Anagnorisis', 'Nostos'],
  prophecy: ['Fate & Foreknowledge'],
  lament: ['Penthos (Grief)'],
  judgment: ['Dikē (Justice)'],
  transgression: ['Hubris · Atasthalia'],
};

function ThemeChips({ themes }: { themes: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {themes.map((t) => (
        <span
          key={t}
          className="text-[10px] px-1.5 py-0.5 rounded-full bg-sepia-700/30 text-sepia-300 border border-sepia-600/40"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function InteractionCard({ i }: { i: Interaction }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-emerald-300">Book {i.book}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400">
          {i.type.replace('_', ' ')} · weight {i.weight}
        </span>
      </div>
      {i.nested_narrative && (
        <div className="text-[10px] text-amber-300 border border-amber-700/50 rounded px-1.5 py-0.5 inline-block">
          Nested narration (Apologoi flashback)
        </div>
      )}
      <p className="text-sm text-slate-200 leading-snug">{i.summary}</p>
      {i.insight && (
        <p className="text-xs italic text-sepia-300 leading-snug border-l-2 border-sepia-600/60 pl-2">
          {i.insight}
        </p>
      )}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <ThemeChips themes={TYPE_THEMES[i.type]} />
        {i.citation && <span className="text-[10px] font-mono text-slate-500">{i.citation}</span>}
      </div>
    </div>
  );
}

/**
 * Sidebar: close-reading commentary for whatever is selected —
 * a network edge, a map path segment, a waypoint, or a character.
 */
export default function CloseReadingPanel() {
  const { selection, setSelection } = useFilters();

  return (
    <aside className="w-[360px] shrink-0 border-l border-slate-800 bg-slate-950/70 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <h2 className="font-display text-sm text-sepia-200 tracking-wide">Close Reading</h2>
        {selection && (
          <button
            onClick={() => setSelection(null)}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            clear ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!selection && (
          <div className="text-sm text-slate-400 leading-relaxed space-y-3">
            <p>
              Select an <b className="text-slate-200">edge</b> in the network graph, a{' '}
              <b className="text-slate-200">path segment</b> or{' '}
              <b className="text-slate-200">waypoint</b> on the map, or a{' '}
              <b className="text-slate-200">node</b> to populate this panel with textual summaries,
              thematic analysis, and line citations.
            </p>
            <p className="text-xs text-slate-500 italic">
              Distant reading finds the pattern; close reading gives it a voice. — the two halves of
              this dashboard are meant to be read against each other.
            </p>
          </div>
        )}

        {selection?.kind === 'edge' && (
          <>
            <div className="font-display text-base text-slate-100">
              {CHARACTER_BY_ID[selection.a]?.name} ↔ {CHARACTER_BY_ID[selection.b]?.name}
            </div>
            <div className="text-xs text-slate-500 -mt-2">
              {selection.interactions.length} interaction
              {selection.interactions.length === 1 ? '' : 's'} in the selected window · combined
              weight {selection.interactions.reduce((s, i) => s + i.weight, 0)}
            </div>
            {selection.interactions
              .slice()
              .sort((a, b) => a.book - b.book)
              .map((i, idx) => (
                <InteractionCard key={idx} i={i} />
              ))}
          </>
        )}

        {selection?.kind === 'segment' && (() => {
          const seg = selection.segment;
          const o = LOCATION_BY_ID[seg.origin];
          const d = LOCATION_BY_ID[seg.destination];
          return (
            <>
              <div className="font-display text-base text-slate-100">
                {o?.name} → {d?.name}
              </div>
              <div className="flex items-center gap-2 text-xs -mt-1">
                <span
                  className="px-1.5 py-0.5 rounded-full border"
                  style={{ color: ITINERARY_COLORS[seg.character], borderColor: ITINERARY_COLORS[seg.character] }}
                >
                  {ITINERARY_LABELS[seg.character]} · leg {seg.segment}
                </span>
                <span className="text-emerald-300 font-semibold">Book {seg.book}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {seg.inferred
                  ? 'Inferred / speculative route through the mythic seas — Homer suspends verifiable geography here.'
                  : 'Explicitly narrated, geographically plausible route.'}
                {seg.nested && ' Narrated inside the Apologoi flashback (chronologically prior to Book 5).'}
              </div>
              <p className="text-sm text-slate-200 leading-snug">{seg.summary}</p>
              <ThemeChips themes={seg.themes} />
              {seg.citation && (
                <div className="text-[10px] font-mono text-slate-500">{seg.citation}</div>
              )}
            </>
          );
        })()}

        {selection?.kind === 'location' && (() => {
          const loc = selection.location;
          return (
            <>
              <div className="font-display text-base text-slate-100">{loc.name}</div>
              <div className="text-xs text-slate-500 -mt-2">
                {loc.status} · Books {loc.books.join(', ')}
              </div>
              {loc.note && <p className="text-xs italic text-sepia-300">{loc.note}</p>}
              <div className="space-y-2">
                {loc.events.map((e, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-700 bg-slate-900/70 p-2.5 text-sm">
                    <span className="text-emerald-300 font-semibold text-xs">Book {e.book}. </span>
                    <span className="text-slate-200">{e.description}</span>
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {selection?.kind === 'character' && (() => {
          const c = CHARACTER_BY_ID[selection.id];
          if (!c) return null;
          const involved = INTERACTIONS.filter(
            (i) => i.source === c.id || i.target === c.id,
          ).sort((a, b) => a.book - b.book);
          return (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-base text-slate-100">{c.name}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full border"
                  style={{ color: ALIGNMENT_COLORS[c.alignment], borderColor: ALIGNMENT_COLORS[c.alignment] }}
                >
                  {c.type} · {c.alignment}
                </span>
              </div>
              {c.epithets.length > 0 && (
                <div className="italic text-xs text-sepia-400 -mt-1">{c.epithets.join(' · ')}</div>
              )}
              {c.group_size > 1 && (
                <div className="text-xs text-slate-400">
                  Aggregate node representing <b className="text-slate-200">{c.group_size}</b>{' '}
                  individuals.
                </div>
              )}
              {c.note && <p className="text-xs text-slate-400">{c.note}</p>}
              <div className="text-[10px] uppercase tracking-widest text-slate-500 pt-1">
                All recorded interactions ({involved.length})
              </div>
              {involved.map((i, idx) => (
                <InteractionCard key={idx} i={i} />
              ))}
            </>
          );
        })()}
      </div>
    </aside>
  );
}
