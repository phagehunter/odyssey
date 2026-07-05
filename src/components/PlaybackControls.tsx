import { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { BOOK_TITLES } from '../data/bookTitles';

type Mode = 'cumulative' | 'single';

const STEP_MS = 1900; // dwell per book — long enough for the force layout to settle

/**
 * Play-through control for the network view: animates the global book window
 * across Books 1–24 so the interaction network can be watched evolving.
 * Two modes: the network growing cumulatively, or each book's cast in isolation.
 */
export default function PlaybackControls() {
  const { setBookRange } = useFilters();
  const [playing, setPlaying] = useState(false);
  const [book, setBook] = useState<number | null>(null); // playhead; null = idle
  const [mode, setMode] = useState<Mode>('cumulative');

  // Apply the playhead to the global book window (all views follow).
  useEffect(() => {
    if (book === null) return;
    setBookRange(mode === 'cumulative' ? [1, book] : [book, book]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, mode]);

  // Advance the playhead while playing.
  useEffect(() => {
    if (!playing || book === null) return;
    if (book >= 24) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setBook((b) => (b ?? 1) + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, book]);

  const toggle = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (book === null || book >= 24) setBook(1);
      setPlaying(true);
    }
  };

  const reset = () => {
    setPlaying(false);
    setBook(null);
    setBookRange([1, 24]);
  };

  const active = book !== null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-slate-900/90 border border-slate-700 rounded-full pl-2 pr-4 py-1.5 shadow-xl backdrop-blur-sm">
      {/* Play / pause */}
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 flex items-center justify-center text-sm transition-colors"
        title={playing ? 'Pause' : 'Play through the books'}
        aria-label={playing ? 'Pause playback' : 'Play through the books'}
      >
        {playing ? '❚❚' : '▶'}
      </button>

      {/* Playhead readout + progress */}
      <div className="w-56">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm text-slate-100 font-semibold whitespace-nowrap">
            {active ? `Book ${book}` : 'Play the epic'}
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            {active ? BOOK_TITLES[book!] : 'watch the network evolve'}
          </span>
        </div>
        <div className="mt-1 h-1 rounded bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-[width] duration-500 ease-out"
            style={{ width: `${((book ?? 0) / 24) * 100}%` }}
          />
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-md overflow-hidden border border-slate-700 text-[11px]">
        {(
          [
            ['cumulative', 'Growing'],
            ['single', 'By book'],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-2 py-1 transition-colors ${
              mode === m
                ? 'bg-emerald-900/60 text-emerald-200'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title={
              m === 'cumulative'
                ? 'Network accumulates from Book 1'
                : "Each book's cast in isolation"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Reset */}
      {active && (
        <button
          onClick={reset}
          className="text-slate-400 hover:text-slate-200 text-sm"
          title="Reset to Books 1–24"
          aria-label="Reset playback"
        >
          ↺
        </button>
      )}
    </div>
  );
}
