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
  }, [width, collapsed, isMobile]);

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
      <aside className="w-full h-[46%] shrink-0 border-t border-slate-800 bg-slate-950/95 flex flex-col min-h-0">
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-800">
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
