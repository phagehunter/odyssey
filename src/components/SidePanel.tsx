import { useCallback, useEffect, useRef, useState } from 'react';
import { useFilters, type PanelTab } from '../context/FilterContext';
import { notifyLayoutChange } from '../hooks/useElementSize';
import CloseReadingPanel from './CloseReadingPanel';
import TextReader from './TextReader';

const TABS: { id: PanelTab; label: string }[] = [
  { id: 'commentary', label: 'Commentary' },
  { id: 'text', label: 'Text' },
];

const DEFAULT_WIDTH = 400;
const MIN_WIDTH = 300;
const STORAGE_KEY = 'atlas-panel-width';
const SHEET_KEY = 'atlas-sheet-height';
const DEFAULT_SHEET_PCT = 46;

const maxWidth = () => Math.round(window.innerWidth * 0.72);

/**
 * Reading panel, responsive:
 *  · Desktop (≥768px): right sidebar — drag the left edge to resize
 *    (double-click resets), collapsible to a slim rail.
 *  · Mobile (<768px): bottom sheet — stacks under the visualization,
 *    collapsible to a slim bar so the graphics get the whole screen.
 */
export default function SidePanel() {
  const { panelTab, setPanelTab } = useFilters();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [width, setWidth] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    return saved >= MIN_WIDTH ? Math.min(saved, maxWidth()) : DEFAULT_WIDTH;
  });
  const widthRef = useRef(width);
  widthRef.current = width;
  const [sheetPct, setSheetPct] = useState(() => {
    const s = Number(localStorage.getItem(SHEET_KEY));
    return s >= 25 && s <= 85 ? s : DEFAULT_SHEET_PCT;
  });
  const sheetRef = useRef(sheetPct);
  sheetRef.current = sheetPct;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Announce layout changes after the DOM has committed, so the
  // visualizations re-measure their containers (drag, reset, collapse).
  useEffect(() => {
    notifyLayoutChange();
  }, [width, collapsed, isMobile, sheetPct]);

  /** Mobile: drag the sheet's grab bar up/down to resize (touch + mouse). */
  const startSheetDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const main = target.closest('main');
    const rect = main?.getBoundingClientRect();
    if (!rect) return;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events may lack a capturable pointer */
    }
    const move = (ev: PointerEvent) => {
      const pct = ((rect.bottom - ev.clientY) / rect.height) * 100;
      setSheetPct(Math.min(85, Math.max(25, pct)));
    };
    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      localStorage.setItem(SHEET_KEY, String(Math.round(sheetRef.current)));
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }, []);

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const move = (ev: MouseEvent) => {
      const w = Math.min(Math.max(window.innerWidth - ev.clientX, MIN_WIDTH), maxWidth());
      setWidth(w);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      localStorage.setItem(STORAGE_KEY, String(widthRef.current));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // ——— Mobile: bottom sheet ———
  if (isMobile) {
    if (collapsed) {
      return (
        <aside className="w-full shrink-0 border-t border-slate-800 bg-slate-950/90">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full py-2.5 text-[11px] uppercase tracking-widest text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-2"
            aria-label="Open reading panel"
          >
            <span className="text-sm leading-none">⌃</span> Commentary · Text
          </button>
        </aside>
      );
    }
    return (
      <aside
        className="w-full shrink-0 border-t border-slate-800 bg-slate-950/95 flex flex-col min-h-0"
        style={{ height: `${sheetPct}%` }}
      >
        {/* Grab bar: drag to resize the sheet; double-tap to reset */}
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize reading panel"
          title="Drag to resize · double-tap to reset"
          onPointerDown={startSheetDrag}
          onDoubleClick={() => {
            setSheetPct(DEFAULT_SHEET_PCT);
            localStorage.setItem(SHEET_KEY, String(DEFAULT_SHEET_PCT));
          }}
          className="w-full pt-1.5 pb-1 cursor-row-resize touch-none flex justify-center shrink-0"
        >
          <div className="w-10 h-1 rounded-full bg-slate-600" />
        </div>
        <div className="flex items-center gap-1 px-3 pb-1.5 border-b border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setPanelTab(t.id)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                panelTab === t.id
                  ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-600/50'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto text-slate-500 hover:text-slate-300 px-2 text-sm"
            title="Minimize panel"
            aria-label="Minimize panel"
          >
            ⌄
          </button>
        </div>
        <div className="flex-1 min-h-0">
          {panelTab === 'commentary' ? <CloseReadingPanel /> : <TextReader />}
        </div>
      </aside>
    );
  }

  // ——— Desktop: right sidebar ———
  if (collapsed) {
    return (
      <aside className="w-9 shrink-0 border-l border-slate-800 bg-slate-950/70 flex flex-col items-center pt-3">
        <button
          onClick={() => setCollapsed(false)}
          className="text-slate-400 hover:text-emerald-300 text-lg"
          title="Open reading panel"
          aria-label="Open reading panel"
        >
          ⟨
        </button>
        <span className="mt-4 text-[10px] uppercase tracking-widest text-slate-500 [writing-mode:vertical-rl]">
          Commentary · Text
        </span>
      </aside>
    );
  }

  return (
    <aside
      className="relative shrink-0 border-l border-slate-800 bg-slate-950/70 flex flex-col min-h-0"
      style={{ width }}
    >
      {/* Drag handle: resize the panel; double-click to reset */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize reading panel"
        title="Drag to resize · double-click to reset"
        onMouseDown={startDrag}
        onDoubleClick={() => {
          setWidth(DEFAULT_WIDTH);
          localStorage.setItem(STORAGE_KEY, String(DEFAULT_WIDTH));
        }}
        className="absolute left-0 top-0 bottom-0 w-2 -ml-1 z-20 cursor-col-resize group"
      >
        <div className="absolute left-1 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-emerald-500/60 group-active:bg-emerald-400 transition-colors" />
      </div>

      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setPanelTab(t.id)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              panelTab === t.id
                ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-600/50'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => setCollapsed(true)}
          className="ml-auto text-slate-500 hover:text-slate-300 px-1.5"
          title="Collapse panel"
          aria-label="Collapse panel"
        >
          ⟩
        </button>
      </div>
      <div className="flex-1 min-h-0">
        {panelTab === 'commentary' ? <CloseReadingPanel /> : <TextReader />}
      </div>
    </aside>
  );
}
