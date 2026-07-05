import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Alignment, GroupKey, Selection } from '../types';

/** Maps fine-grained alignments onto the four coarse checkbox groups. */
export const GROUP_OF_ALIGNMENT: Record<Alignment, GroupKey> = {
  Loyalist: 'loyalists',
  Ally: 'loyalists',
  Suitor: 'suitors',
  Antagonist: 'suitors',
  Divine: 'divine',
  Magical: 'external',
  External: 'external',
  Shade: 'external',
};

export const GROUP_LABELS: Record<GroupKey, string> = {
  loyalists: 'Ithacan Greeks (Mortal Loyalists)',
  suitors: 'The Suitors Coalition',
  divine: 'Divine Entities',
  external: 'External Civilizations / Monsters',
};

/** Node colour per alignment — the "Academic Dark Mode" palette. */
export const ALIGNMENT_COLORS: Record<Alignment, string> = {
  Loyalist: '#34d399', // emerald
  Ally: '#2dd4bf', // teal
  Suitor: '#f59e0b', // amber
  Antagonist: '#fb7185', // rose
  Divine: '#a78bfa', // violet
  Magical: '#e879f9', // fuchsia
  External: '#38bdf8', // sky
  Shade: '#94a3b8', // slate
};

interface FilterState {
  /** Inclusive book range [from, to], 1–24. */
  bookRange: [number, number];
  setBookRange: (r: [number, number]) => void;
  enabledGroups: Record<GroupKey, boolean>;
  toggleGroup: (g: GroupKey) => void;
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
}

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [bookRange, setBookRange] = useState<[number, number]>([1, 24]);
  const [enabledGroups, setEnabledGroups] = useState<Record<GroupKey, boolean>>({
    loyalists: true,
    suitors: true,
    divine: true,
    external: true,
  });
  const [selection, setSelection] = useState<Selection | null>(null);

  const value = useMemo<FilterState>(
    () => ({
      bookRange,
      setBookRange,
      enabledGroups,
      toggleGroup: (g) => setEnabledGroups((prev) => ({ ...prev, [g]: !prev[g] })),
      selection,
      setSelection,
    }),
    [bookRange, enabledGroups, selection],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FilterState {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
