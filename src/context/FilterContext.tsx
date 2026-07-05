import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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

export type PanelTab = 'commentary' | 'text';
export type PlayMode = 'cumulative' | 'single';

/** A character to spotlight in the network (e.g. from a name in the Text reader). */
export interface Highlight {
  id: string;
  /** true = pin & fly the camera to the node (click); false = transient hover. */
  focus: boolean;
}

const PLAY_STEP_MS = 1900; // dwell per book during playback

interface FilterState {
  /** Inclusive book range [from, to], 1–24. */
  bookRange: [number, number];
  setBookRange: (r: [number, number]) => void;
  enabledGroups: Record<GroupKey, boolean>;
  toggleGroup: (g: GroupKey) => void;
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  /** Sidebar mode: analytical commentary vs. the full Butler text. */
  panelTab: PanelTab;
  setPanelTab: (t: PanelTab) => void;
  /** Book currently open in the Text reader. */
  readerBook: number;
  setReaderBook: (b: number) => void;
  /** Jump the sidebar to the Text tab, opened at a given book. */
  openText: (book: number) => void;
  /** Character spotlighted in the network from the Text reader. */
  highlight: Highlight | null;
  setHighlight: (h: Highlight | null) => void;
  // ——— Playback (lives here so it survives view switches) ———
  playing: boolean;
  playBook: number | null;
  playMode: PlayMode;
  setPlayMode: (m: PlayMode) => void;
  playToggle: () => void;
  playReset: () => void;
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
  const [panelTab, setPanelTab] = useState<PanelTab>('commentary');
  const [readerBook, setReaderBook] = useState(1);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playBook, setPlayBook] = useState<number | null>(null);
  const [playMode, setPlayMode] = useState<PlayMode>('cumulative');

  // Advance the playhead while playing (runs here so playback continues
  // even when the user switches between Network and Map views).
  useEffect(() => {
    if (!playing || playBook === null) return;
    if (playBook >= 24) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setPlayBook((b) => (b ?? 1) + 1), PLAY_STEP_MS);
    return () => clearTimeout(t);
  }, [playing, playBook]);

  // Apply the playhead to the global book window (all views follow).
  useEffect(() => {
    if (playBook === null) return;
    setBookRange(playMode === 'cumulative' ? [1, playBook] : [playBook, playBook]);
  }, [playBook, playMode]);

  const value = useMemo<FilterState>(
    () => ({
      bookRange,
      setBookRange,
      enabledGroups,
      toggleGroup: (g) => setEnabledGroups((prev) => ({ ...prev, [g]: !prev[g] })),
      selection,
      // Selecting something surfaces the Commentary tab so the notes are visible.
      setSelection: (s) => {
        setSelection(s);
        if (s) setPanelTab('commentary');
      },
      panelTab,
      setPanelTab,
      readerBook,
      setReaderBook,
      openText: (book) => {
        setReaderBook(Math.max(1, Math.min(24, book)));
        setPanelTab('text');
      },
      highlight,
      setHighlight,
      playing,
      playBook,
      playMode,
      setPlayMode,
      playToggle: () => {
        if (playing) {
          setPlaying(false);
        } else {
          if (playBook === null || playBook >= 24) setPlayBook(1);
          setPlaying(true);
        }
      },
      playReset: () => {
        setPlaying(false);
        setPlayBook(null);
        setBookRange([1, 24]);
      },
    }),
    [bookRange, enabledGroups, selection, panelTab, readerBook, highlight, playing, playBook, playMode],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FilterState {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
