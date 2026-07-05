import { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
import BookSlider from './components/BookSlider';
import GroupFilters from './components/GroupFilters';
import NetworkGraph from './components/NetworkGraph';
import MapView from './components/MapView';
import StreamGraph from './components/StreamGraph';
import CloseReadingPanel from './components/CloseReadingPanel';

type View = 'network' | 'map' | 'stream';

const TABS: { id: View; label: string; sub: string }[] = [
  { id: 'network', label: 'Network Dynamics', sub: 'force-directed interaction graph' },
  { id: 'map', label: 'Spatial Topography', sub: 'itineraries: real & mythic seas' },
  { id: 'stream', label: 'Narrative Gravity', sub: 'focalization stream, Books 1–24' },
];

export default function App() {
  const [view, setView] = useState<View>('network');

  return (
    <FilterProvider>
      <div className="h-full flex flex-col bg-slate-950">
        {/* ——— Header ——— */}
        <header className="border-b border-slate-800 px-5 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <h1 className="font-display text-xl text-sepia-200 tracking-wide">
              Odyssey Atlas
              <span className="text-slate-500 text-sm font-body ml-3">
                network · topography · focalization
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              A distant-reading dashboard for Homer&apos;s <i>Odyssey</i> — with close-reading
              commentary on demand
            </p>
          </div>
          <nav className="flex gap-1 ml-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                title={t.sub}
                className={`px-3.5 py-1.5 rounded-md text-sm transition-colors border ${
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

        {/* ——— Main: active view + close-reading sidebar ——— */}
        <main className="flex-1 flex min-h-0">
          <section className="flex-1 min-w-0 min-h-0">
            {view === 'network' && <NetworkGraph />}
            {view === 'map' && <MapView />}
            {view === 'stream' && <StreamGraph />}
          </section>
          <CloseReadingPanel />
        </main>
      </div>
    </FilterProvider>
  );
}
