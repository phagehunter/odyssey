import { useFilters, type PlayMode } from '../context/FilterContext';
import { BOOK_TITLES } from '../data/bookTitles';

/**
 * Play-through control: animates the global book window across Books 1–24.
 * State lives in FilterContext, so playback continues across view switches —
 * this component is a pure control surface, rendered in both the Network
 * and Map views.
 */
export default function PlaybackControls() {
  const { playing, playBook, playMode, setPlayMode, playToggle, playReset } = useFilters();
  const active = playBook !== null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 bg-slate-900/90 border border-slate-700 rounded-full pl-2 pr-4 py-1.5 shadow-xl backdrop-blur-sm">
      {/* Play / pause */}
      <button
        onClick={playToggle}
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
            {active ? `Book ${playBook}` : 'Play the epic'}
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            {active ? BOOK_TITLES[playBook!] : 'watch it unfold book by book'}
          </span>
        </div>
        <div className="mt-1 h-1 rounded bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-[width] duration-500 ease-out"
            style={{ width: `${((playBook ?? 0) / 24) * 100}%` }}
          />
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-md overflow-hidden border border-slate-700 text-[11px]">
        {(
          [
            ['cumulative', 'Growing'],
            ['single', 'By book'],
          ] as [PlayMode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setPlayMode(m)}
            className={`px-2 py-1 transition-colors ${
              playMode === m
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
          onClick={playReset}
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
