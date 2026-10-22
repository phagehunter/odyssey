import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { FilterProvider, useFilters } from './context/FilterContext';
import { LOCATION_BY_ID } from './data/locations';
import { CHARACTER_BY_ID } from './data/characters';
import BookSlider from './components/BookSlider';
import GroupFilters from './components/GroupFilters';
import NetworkGraph from './components/NetworkGraph';
import MapView from './components/MapView';
import StreamGraph from './components/StreamGraph';
import SidePanel from './components/SidePanel';

type View = 'network' | 'map' | 'stream';

const TABS: { id: View; label: string; sub: string }[] = [
  { id: 'network', label: 'Network Dynamics', sub: 'force-directed interaction graph' },
  { id: 'map', label: 'Spatial Topography', sub: 'itineraries: real & mythic seas' },
  { id: 'stream', label: 'Narrative Gravity', sub: 'focalization stream, Books 1–24' },
];

/** Brand mark: omega over the wine-dark wave. */
function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 shrink-0" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <text x="32" y="40" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="700" fontSize="34" fill="#d9c19a" textAnchor="middle">
        Ω
      </text>
      <path d="M10 50 q5.5 -6 11 0 t11 0 t11 0 t11 0" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Read a deep link from the URL hash: #character=odysseus · #place=troy · #book=9 · #view=map */
function parseHash(): { view?: View; character?: string; place?: string; book?: number } {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const out: ReturnType<typeof parseHash> = {};
  const v = params.get('view');
  if (v === 'network' || v === 'map' || v === 'stream') out.view = v;
  const c = params.get('character');
  if (c && CHARACTER_BY_ID[c]) out.character = c;
  const p = params.get('place');
  if (p && LOCATION_BY_ID[p]) out.place = p;
  const b = Number(params.get('book'));
  if (b >= 1 && b <= 24) out.book = b;
  return out;
}

function AppShell() {
  const [view, setView] = useState<View>(() => parseHash().view ?? 'network');
  const { setSelection, setHighlight, setBookRange, openText } = useFilters();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Deep links: the static pages (books/, characters/, places/) open the app here.
  useEffect(() => {
    const apply = () => {
      const h = parseHash();
      if (h.view) setView(h.view);
      if (h.character) {
        setView(h.view ?? 'network');
        setSelection({ kind: 'character', id: h.character });
        setHighlight({ id: h.character, focus: true });
      } else if (h.place) {
        setView(h.view ?? 'map');
        setSelection({ kind: 'location', location: LOCATION_BY_ID[h.place] });
      } else if (h.book) {
        setBookRange([h.book, h.book]);
        openText(h.book);
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const n = TABS.length;
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % n;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setView(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* ——— Branded header ——— */}
      <header className="border-b border-slate-800 px-4 sm:px-5 py-2 sm:py-3 flex flex-wrap items-center gap-x-8 gap-y-1.5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <BrandMark />
          <div>
            <h1 className="font-display font-bold text-[15px] sm:text-[20px] leading-none text-sepia-200 uppercase tracking-[0.1em] sm:tracking-[0.16em]">
              Odyssey Character Map
            </h1>
            <p className="text-[12px] text-slate-400 mt-1 tracking-wide">A visual companion to Homer&apos;s epic</p>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Project by{' '}
              <a href="https://curtishoffmann.com" className="text-slate-300 hover:text-emerald-300 underline decoration-dotted underline-offset-2">
                Curtis Hoffmann
              </a>
              {' · '}
              <a href="books/" className="text-slate-300 hover:text-emerald-300 underline decoration-dotted underline-offset-2">
                Books
              </a>
              {' · '}
              <a href="characters/" className="text-slate-300 hover:text-emerald-300 underline decoration-dotted underline-offset-2">
                Characters
              </a>
              {' · '}
              <a href="places/" className="text-slate-300 hover:text-emerald-300 underline decoration-dotted underline-offset-2">
                Places
              </a>
              {' · '}
              <a
                href="https://forms.gle/ydBNztwZkeNYaWbc7"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-emerald-300 underline decoration-dotted underline-offset-2"
              >
                Feedback form (Google Forms) ↗
              </a>
            </p>
          </div>
        </div>
        <div role="tablist" aria-label="Views" className="flex flex-wrap gap-1 ml-auto">
          {TABS.map((t, idx) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[idx] = el)}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={view === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={view === t.id ? 0 : -1}
              onClick={() => setView(t.id)}
              onKeyDown={(e) => onTabKey(e, idx)}
              title={t.sub}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 min-h-[40px] rounded-md text-[13px] sm:text-[15px] transition-colors duration-150 border ${
                view === t.id
                  ? 'bg-emerald-900/40 border-emerald-600/60 text-emerald-200'
                  : 'border-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ——— Global controls: book window + group toggles ——— */}
      <div className="border-b border-slate-800 px-4 sm:px-5 py-2 sm:py-2.5 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-1.5 bg-slate-900/40">
        <BookSlider />
        <GroupFilters />
      </div>

      {/* ——— Main: view + reading panel (side-by-side on desktop, stacked on mobile) ——— */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0">
        <section
          id={`panel-${view}`}
          role="tabpanel"
          aria-labelledby={`tab-${view}`}
          className="flex-1 min-w-0 min-h-0"
        >
          {view === 'network' && <NetworkGraph />}
          {view === 'map' && <MapView />}
          {view === 'stream' && <StreamGraph />}
        </section>
        <SidePanel />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <AppShell />
    </FilterProvider>
  );
}
