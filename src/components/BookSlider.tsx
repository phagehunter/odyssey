import { useFilters } from '../context/FilterContext';

/**
 * Global dual-thumb book-range slider (Books 1–24).
 * Drives the network graph, map highlighting, and stream-graph emphasis.
 */
export default function BookSlider() {
  const { bookRange, setBookRange } = useFilters();
  const [from, to] = bookRange;

  const pct = (v: number) => ((v - 1) / 23) * 100;

  return (
    <div className="flex items-center gap-4 min-w-[280px] flex-1 max-w-xl">
      <span className="text-xs uppercase tracking-widest text-slate-400 whitespace-nowrap">
        Books
      </span>
      <div className="relative flex-1 h-8">
        {/* track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded bg-slate-700" />
        {/* active window */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-emerald-500/80"
          style={{ left: `${pct(from)}%`, right: `${100 - pct(to)}%` }}
        />
        <input
          type="range"
          min={1}
          max={24}
          value={from}
          onChange={(e) => setBookRange([Math.min(Number(e.target.value), to), to])}
          className="book-thumb absolute inset-0 w-full h-full z-20"
          aria-label="First book"
        />
        <input
          type="range"
          min={1}
          max={24}
          value={to}
          onChange={(e) => setBookRange([from, Math.max(Number(e.target.value), from)])}
          className="book-thumb absolute inset-0 w-full h-full z-30"
          aria-label="Last book"
        />
        {/* tick labels */}
        <div className="absolute -bottom-1.5 left-0 right-0 flex justify-between text-[9px] text-slate-500 pointer-events-none">
          {[1, 6, 12, 18, 24].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>
      <span className="font-display text-sm text-sepia-300 whitespace-nowrap tabular-nums">
        {from === to ? `Book ${from}` : `Books ${from}–${to}`}
      </span>
    </div>
  );
}
