import { useState } from 'react';
import { useFilters, type PanelTab } from '../context/FilterContext';
import CloseReadingPanel from './CloseReadingPanel';
import TextReader from './TextReader';

const TABS: { id: PanelTab; label: string }[] = [
  { id: 'commentary', label: 'Commentary' },
  { id: 'text', label: 'Text' },
];

/**
 * Right sidebar: switchable between analytical Commentary (close reading)
 * and the full Butler Text, so the poem can be read alongside every view.
 * Collapsible to give the visualizations the full width.
 */
export default function SidePanel() {
  const { panelTab, setPanelTab } = useFilters();
  const [collapsed, setCollapsed] = useState(false);

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
    <aside className="w-[400px] max-w-[44vw] shrink-0 border-l border-slate-800 bg-slate-950/70 flex flex-col min-h-0">
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
