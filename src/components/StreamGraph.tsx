import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { FOCALIZATION } from '../data/focalization';
import { useFilters } from '../context/FilterContext';
import { useElementSize } from '../hooks/useElementSize';

const KEYS = ['telemachus', 'odysseus', 'penelope', 'gods', 'other'] as const;
type StreamKey = (typeof KEYS)[number];

const STREAM_COLORS: Record<StreamKey, string> = {
  telemachus: '#38bdf8',
  odysseus: '#fbbf24',
  penelope: '#fb7185',
  gods: '#a78bfa',
  other: '#64748b',
};

const STREAM_LABELS: Record<StreamKey, string> = {
  telemachus: 'Telemachus',
  odysseus: 'Odysseus',
  penelope: 'Penelope',
  gods: 'Divine apparatus',
  other: 'Hosts, shades & others',
};

/** One-word diegesis labels for Books 9–12 (full detail lives in the hover tooltip). */
const DIEGESIS_SHORT: Record<number, string> = {
  9: 'Cyclops',
  10: 'Circe',
  11: 'Nekyia',
  12: 'Sirens',
};

/** Chronological frame location per book (for the dual-timeline strip). */
function frameLabel(book: number): string {
  if (book <= 2) return 'Ithaca';
  if (book === 3) return 'Pylos';
  if (book === 4) return 'Sparta';
  if (book === 5) return 'Ogygia → sea';
  if (book <= 8) return 'Scheria';
  if (book <= 12) return 'Scheria (Phaeacian court)';
  return 'Ithaca';
}

const MARGIN = { top: 34, right: 18, bottom: 118, left: 46 };

export default function StreamGraph() {
  const { bookRange } = useFilters();
  const { ref, width } = useElementSize<HTMLDivElement>();
  const [hoverBook, setHoverBook] = useState<number | null>(null);

  const height = 520;
  const innerW = Math.max(width - MARGIN.left - MARGIN.right, 50);
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const x = useMemo(
    () => d3.scaleLinear().domain([1, 24]).range([0, innerW]),
    [innerW],
  );
  const y = useMemo(() => d3.scaleLinear().domain([0, 100]).range([innerH, 0]), [innerH]);

  const series = useMemo(() => {
    const stack = d3
      .stack<(typeof FOCALIZATION)[number]>()
      .keys(KEYS as unknown as string[])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
    return stack(FOCALIZATION);
  }, []);

  const area = useMemo(
    () =>
      d3
        .area<d3.SeriesPoint<(typeof FOCALIZATION)[number]>>()
        .x((d) => x(d.data.book))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.6)),
    [x, y],
  );

  const hoverRow = hoverBook ? FOCALIZATION[hoverBook - 1] : null;
  const [from, to] = bookRange;

  return (
    <div ref={ref} className="relative w-full h-full overflow-y-auto p-4">
      <div className="mb-2">
        <h2 className="font-display text-lg text-sepia-200">
          Narrative Gravity — focalization across the 24 books
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl">
          Share of each book focalized through the protagonists (editorial estimates). The hatched
          band marks the <i>Apologoi</i> (Books 9–12): the <b>chronological frame</b> stays at the
          Phaeacian court while the <b>diegetic focus</b> is Odysseus&apos; first-person flashback —
          the poem&apos;s nested timeline.
        </p>
      </div>

      {width > 0 && (
        <svg
          width={width - 32}
          height={height}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = e.clientX - rect.left - MARGIN.left;
            const book = Math.round(x.invert(Math.max(0, Math.min(px, innerW))));
            setHoverBook(Math.max(1, Math.min(24, book)));
          }}
          onMouseLeave={() => setHoverBook(null)}
        >
          <defs>
            <pattern id="apologoi-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" stroke="#d9c19a" strokeWidth="0.7" opacity="0.5" />
            </pattern>
          </defs>

          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {/* y grid + axis */}
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1={0} x2={innerW} y1={y(v)} y2={y(v)} stroke="#1e293b" strokeWidth={1} />
                <text x={-8} y={y(v)} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-[10px]">
                  {v}%
                </text>
              </g>
            ))}

            {/* streams */}
            {series.map((s, idx) => (
              <path
                key={KEYS[idx]}
                d={area(s) ?? undefined}
                fill={STREAM_COLORS[KEYS[idx]]}
                fillOpacity={0.72}
                stroke="#020617"
                strokeWidth={0.75}
              />
            ))}

            {/* Apologoi nested-timeline overlay (Books 9–12) */}
            <rect x={x(8.5)} y={0} width={x(12.5) - x(8.5)} height={innerH} fill="url(#apologoi-hatch)" pointerEvents="none" />
            <rect x={x(8.5)} y={0} width={x(12.5) - x(8.5)} height={innerH} fill="none" stroke="#d9c19a" strokeDasharray="5 4" strokeWidth={1} pointerEvents="none" />
            <text x={(x(8.5) + x(12.5)) / 2} y={-10} textAnchor="middle" className="fill-sepia-300 text-[11px] italic">
              Apologoi — nested first-person narration
            </text>

            {/* book-range dimmers */}
            {from > 1 && <rect x={0} y={0} width={x(from) - x(1)} height={innerH} fill="#020617" opacity={0.62} pointerEvents="none" />}
            {to < 24 && <rect x={x(to)} y={0} width={x(24) - x(to)} height={innerH} fill="#020617" opacity={0.62} pointerEvents="none" />}

            {/* hover guide */}
            {hoverBook && (
              <line x1={x(hoverBook)} x2={x(hoverBook)} y1={0} y2={innerH} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} pointerEvents="none" />
            )}

            {/* x axis */}
            {FOCALIZATION.map((r) => (
              <text
                key={r.book}
                x={x(r.book)}
                y={innerH + 14}
                textAnchor="middle"
                className={r.nested ? 'fill-sepia-300 text-[10px]' : 'fill-slate-500 text-[10px]'}
              >
                {r.book}
              </text>
            ))}
            <text x={innerW / 2} y={innerH + 30} textAnchor="middle" className="fill-slate-400 text-[11px]">
              Book
            </text>

            {/* ——— Dual-timeline strips ——— */}
            <g transform={`translate(0, ${innerH + 42})`}>
              <text x={-8} y={9} textAnchor="end" className="fill-slate-400 text-[9px]">
                FRAME
              </text>
              {FOCALIZATION.map((r) => (
                <rect
                  key={r.book}
                  x={x(r.book - 0.5) < 0 ? 0 : x(r.book - 0.5)}
                  y={0}
                  width={x(Math.min(r.book + 0.5, 24.0)) - x(Math.max(r.book - 0.5, 1))}
                  height={13}
                  fill={r.nested ? '#065f46' : '#1e293b'}
                  stroke="#020617"
                />
              ))}
              {/* frame labels at region midpoints */}
              {[
                { mid: 1.5, label: 'Ithaca' },
                { mid: 3, label: 'Pylos' },
                { mid: 4, label: 'Sparta' },
                { mid: 5, label: 'Ogygia' },
                { mid: 7, label: 'Scheria' },
                { mid: 10.5, label: 'Scheria — Odysseus narrates' },
                { mid: 18.5, label: 'Ithaca' },
              ].map((m) => (
                <text key={m.mid} x={x(m.mid)} y={9.5} textAnchor="middle" className="fill-slate-300 text-[8.5px]">
                  {m.label}
                </text>
              ))}

              <text x={-8} y={28} textAnchor="end" className="fill-slate-400 text-[9px]">
                DIEGESIS
              </text>
              {FOCALIZATION.map((r) => (
                <rect
                  key={r.book}
                  x={x(Math.max(r.book - 0.5, 1))}
                  y={19}
                  width={x(Math.min(r.book + 0.5, 24)) - x(Math.max(r.book - 0.5, 1))}
                  height={13}
                  fill={r.nested ? '#78350f' : '#1e293b'}
                  stroke={r.nested ? '#d9c19a' : '#020617'}
                  strokeDasharray={r.nested ? '3 2' : undefined}
                />
              ))}
              {FOCALIZATION.filter((r) => r.nested).map((r) => (
                <text key={r.book} x={x(r.book)} y={28.5} textAnchor="middle" className="fill-sepia-200 text-[7.5px]">
                  {DIEGESIS_SHORT[r.book]}
                </text>
              ))}
              <text x={x(18.5)} y={28.5} textAnchor="middle" className="fill-slate-400 text-[8.5px]">
                = frame (no flashback)
              </text>
            </g>
          </g>
        </svg>
      )}

      {/* legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-xs">
        {KEYS.map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-sm" style={{ background: STREAM_COLORS[k] }} />
            {STREAM_LABELS[k]}
          </span>
        ))}
      </div>

      {/* hover tooltip */}
      {hoverRow && (
        <div className="absolute top-24 right-8 z-30 w-64 bg-slate-900/95 border border-slate-600 rounded-lg p-3 shadow-2xl pointer-events-none">
          <div className="font-display text-sepia-200 text-sm mb-1">Book {hoverRow.book}</div>
          {hoverRow.nested && (
            <div className="text-[11px] mb-2 space-y-0.5 border-b border-slate-700 pb-1.5">
              <div className="text-emerald-300">Frame: {hoverRow.nested.frame}</div>
              <div className="text-amber-300">Diegesis: {hoverRow.nested.diegetic}</div>
              <div className="text-slate-500 italic">Retrospective flashback — nested timeline</div>
            </div>
          )}
          <ul className="text-xs space-y-0.5">
            {KEYS.map((k) => (
              <li key={k} className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-sm" style={{ background: STREAM_COLORS[k] }} />
                  {STREAM_LABELS[k]}
                </span>
                <span className="tabular-nums text-slate-400">{hoverRow[k]}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
