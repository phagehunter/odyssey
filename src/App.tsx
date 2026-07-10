import { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
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
      <text
        x="32"
        y="40"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="700"
        fontSize="34"
        fill="#d9c19a"
        textAnchor="middle"
      >
        Ω
      </text>
      <path
        d="M10 50 q5.5 -6 11 0 t11 0 t11 0 t11 0"
        stroke="#34d399"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function App() {
  const [view, setView] = useState<View>('network');

  return (
    <FilterProvider>
      <div className="h-full flex flex-col bg-slate-950">
        {/* ——— Branded header ——— */}
        <header className="border-b border-slate-800 px-5 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <h1 className="font-display font-bold text-[20px] leading-none text-sepia-200 uppercase tracking-[0.16em]">
                Odyssey Character Map
              </h1>
              <p className="text-[12px] text-slate-400 mt-1 tracking-wide">
                A visual companion to Homer&apos;s epic
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Project by{' '}
                <a
                  href="https://curtishoffmann.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-300 underline decoration-dotted underline-offset-2"
                >
                  Curtis Hoffmann
                </a>
                {' · '}
                <a
                  href="https://forms.gle/ydBNztwZkeNYaWbc7"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-300 underline decoration-dotted underline-offset-2"
                >
                  Share Your Feedback ↗
                </a>
              </p>
            </div>
          </div>
          <nav className="flex gap-1 ml-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                title={t.sub}
                className={`px-3.5 py-1.5 rounded-md text-[15px] transition-colors border ${
                  view === t.id
                    ? 'bg-emerald-900/40 border-emerald-600/60 text-emerald-200'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        {/* ——— Global controls: book window + group toggles ——— */}
        <div className="border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center gap-x-8 gap-y-2 bg-slate-900/40">
          <BookSlider />
          <GroupFilters />
        </div>

        {/* ——— Main: active view + Commentary/Text sidebar ——— */}
        <main className="flex-1 flex min-h-0">
          <section className="flex-1 min-w-0 min-h-0">
            {view === 'network' && <NetworkGraph />}
            {view === 'map' && <MapView />}
            {view === 'stream' && <StreamGraph />}
          </section>
          <SidePanel />
        </main>
      </div>
    </FilterProvider>
  );
}
