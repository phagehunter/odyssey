import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFilters } from '../context/FilterContext';
import { NAME_REGEX, NAME_TO_ID } from '../data/nameMap';

/** In-memory cache: each book is fetched at most once per session. */
const bookCache = new Map<number, string[]>();

/** Character names become live links: hover spotlights the node in the
 *  network view; click flies the camera to it. */
function LinkedText({ text }: { text: string }) {
  const { setHighlight } = useFilters();
  const parts = text.split(NAME_REGEX);
  return (
    <>
      {parts.map((part, idx): ReactNode => {
        const id = NAME_TO_ID[part];
        if (!id) return part;
        return (
          <span
            key={idx}
            role="button"
            tabIndex={0}
            className="text-emerald-300 border-b border-dotted border-emerald-500/50 cursor-pointer rounded-sm hover:text-emerald-200 hover:bg-emerald-900/30 transition-colors"
            title="Hover: highlight in network · Click: fly to node"
            onMouseEnter={() => setHighlight({ id, focus: false })}
            onMouseLeave={() => setHighlight(null)}
            onClick={() => setHighlight({ id, focus: true })}
            onKeyDown={(e) => e.key === 'Enter' && setHighlight({ id, focus: true })}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

/**
 * Full-text reader for the Samuel Butler translation (1900), served as
 * static per-book JSON from public/text/ — no external requests.
 */
export default function TextReader() {
  const { readerBook, setReaderBook } = useFilters();
  const [paragraphs, setParagraphs] = useState<string[] | null>(
    bookCache.get(readerBook) ?? null,
  );
  const [failed, setFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    scrollRef.current?.scrollTo({ top: 0 });
    if (bookCache.has(readerBook)) {
      setParagraphs(bookCache.get(readerBook)!);
      setFailed(false);
      return;
    }
    setParagraphs(null);
    setFailed(false);
    fetch(`${import.meta.env.BASE_URL}text/book-${readerBook}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: { paragraphs: string[] }) => {
        bookCache.set(readerBook, d.paragraphs);
        if (alive) setParagraphs(d.paragraphs);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [readerBook]);

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Book navigation */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/40">
        <button
          onClick={() => setReaderBook(Math.max(1, readerBook - 1))}
          disabled={readerBook <= 1}
          className="px-2 py-0.5 rounded text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous book"
        >
          ‹
        </button>
        <select
          value={readerBook}
          onChange={(e) => setReaderBook(Number(e.target.value))}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
          aria-label="Select book"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((b) => (
            <option key={b} value={b}>
              Book {b}
            </option>
          ))}
        </select>
        <button
          onClick={() => setReaderBook(Math.min(24, readerBook + 1))}
          disabled={readerBook >= 24}
          className="px-2 py-0.5 rounded text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next book"
        >
          ›
        </button>
      </div>

      {/* Text body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        <h3 className="font-display text-2xl text-sepia-200 mb-3 tracking-wide">
          Book {readerBook}
        </h3>

        {failed && (
          <p className="text-sm text-rose-300">
            Could not load the text for this book. Try reloading the page.
          </p>
        )}
        {!failed && !paragraphs && <p className="text-sm text-slate-500 italic">Loading…</p>}

        {paragraphs && (
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`font-reading text-[16px] leading-[1.8] text-slate-100 ${
                  i === 0 ? 'drop-cap' : ''
                }`}
              >
                <LinkedText text={p} />
              </p>
            ))}
          </div>
        )}

        {/* Attribution & name key */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <span className="text-emerald-400/80">Names are linked</span> — hover one to spotlight
            that character in the network view; click to fly the camera to their node.
          </p>
          <p>
            Translation: Samuel Butler (1900), via the{' '}
            <a
              href="http://classics.mit.edu/Homer/odyssey.html"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 underline hover:text-slate-300"
            >
              Internet Classics Archive
            </a>
            .
          </p>
          <p>
            Butler uses Roman names: <b className="text-slate-400">Ulysses</b> = Odysseus ·{' '}
            <b className="text-slate-400">Minerva</b> = Athena ·{' '}
            <b className="text-slate-400">Jove</b> = Zeus ·{' '}
            <b className="text-slate-400">Neptune</b> = Poseidon ·{' '}
            <b className="text-slate-400">Mercury</b> = Hermes ·{' '}
            <b className="text-slate-400">Telemachus</b> and{' '}
            <b className="text-slate-400">Penelope</b> are unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}
