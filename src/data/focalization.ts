import type { FocalizationRow } from '../types';

/**
 * Narrative-gravity table: editorial estimates of the share of each book
 * focalized through the three protagonists, the divine apparatus, and other
 * characters (hosts, shades, herdsmen…). Values are percentages summing to 100.
 *
 * Books 9–12 carry the `nested` dual-timeline annotation: the chronological
 * frame remains the Phaeacian court (Scheria), while the diegetic focus is
 * Odysseus' first-person retrospective of past locations.
 */
export const FOCALIZATION: FocalizationRow[] = [
  { book: 1, telemachus: 45, odysseus: 0, penelope: 12, gods: 33, other: 10 },
  { book: 2, telemachus: 68, odysseus: 0, penelope: 14, gods: 10, other: 8 },
  { book: 3, telemachus: 60, odysseus: 0, penelope: 0, gods: 14, other: 26 },
  { book: 4, telemachus: 48, odysseus: 0, penelope: 22, gods: 6, other: 24 },
  { book: 5, telemachus: 0, odysseus: 62, penelope: 0, gods: 32, other: 6 },
  { book: 6, telemachus: 0, odysseus: 55, penelope: 0, gods: 15, other: 30 },
  { book: 7, telemachus: 0, odysseus: 62, penelope: 0, gods: 8, other: 30 },
  { book: 8, telemachus: 0, odysseus: 52, penelope: 0, gods: 6, other: 42 },
  { book: 9, telemachus: 0, odysseus: 88, penelope: 0, gods: 4, other: 8,
    nested: { frame: 'Phaeacian court (Scheria)', diegetic: 'Cicones · Lotus-Eaters · Cyclops\' Cave' } },
  { book: 10, telemachus: 0, odysseus: 84, penelope: 0, gods: 6, other: 10,
    nested: { frame: 'Phaeacian court (Scheria)', diegetic: 'Aeolia · Laestrygonia · Aeaea' } },
  { book: 11, telemachus: 0, odysseus: 82, penelope: 0, gods: 4, other: 14,
    nested: { frame: 'Phaeacian court (Scheria)', diegetic: 'Land of the Dead (Nekyia)' } },
  { book: 12, telemachus: 0, odysseus: 80, penelope: 0, gods: 12, other: 8,
    nested: { frame: 'Phaeacian court (Scheria)', diegetic: 'Sirens · Scylla · Thrinacia' } },
  { book: 13, telemachus: 0, odysseus: 62, penelope: 0, gods: 30, other: 8 },
  { book: 14, telemachus: 0, odysseus: 68, penelope: 0, gods: 2, other: 30 },
  { book: 15, telemachus: 52, odysseus: 28, penelope: 0, gods: 12, other: 8 },
  { book: 16, telemachus: 32, odysseus: 48, penelope: 6, gods: 6, other: 8 },
  { book: 17, telemachus: 18, odysseus: 42, penelope: 22, gods: 4, other: 14 },
  { book: 18, telemachus: 4, odysseus: 42, penelope: 28, gods: 8, other: 18 },
  { book: 19, telemachus: 2, odysseus: 40, penelope: 42, gods: 4, other: 12 },
  { book: 20, telemachus: 8, odysseus: 44, penelope: 20, gods: 16, other: 12 },
  { book: 21, telemachus: 14, odysseus: 38, penelope: 30, gods: 4, other: 14 },
  { book: 22, telemachus: 14, odysseus: 66, penelope: 2, gods: 8, other: 10 },
  { book: 23, telemachus: 6, odysseus: 38, penelope: 46, gods: 6, other: 4 },
  { book: 24, telemachus: 6, odysseus: 44, penelope: 2, gods: 18, other: 30 },
];
