/** Shared domain types for the Odyssey Atlas. */

/**
 * Fine-grained alignment used for node colouring.
 * Alignments are mapped onto the four coarse UI filter groups
 * (see GROUP_OF_ALIGNMENT in src/context/FilterContext.tsx).
 */
export type Alignment =
  | 'Loyalist' // Odysseus' household & Ithacan faithful
  | 'Ally' // Achaean hosts of the Telemachy (Nestor, Menelaus, Helen…)
  | 'Suitor' // the coalition of 108 suitors
  | 'Antagonist' // mortal collaborators of the suitors (Melanthius, unfaithful maids…)
  | 'Divine' // Olympian and chthonic gods
  | 'Magical' // enchantresses, nymphs, monsters of the Apologoi
  | 'External' // external civilizations (Phaeacians, Cicones, Laestrygonians…)
  | 'Shade'; // the dead encountered in the Nekyia (Books 11, 24)

export type CharacterType = 'Mortal' | 'Divine' | 'Monster' | 'Shade' | 'Animal';

export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  alignment: Alignment;
  epithets: string[];
  /** >1 marks an aggregate/collective node (e.g. the 52 suitors of Dulichium). */
  group_size: number;
  note?: string;
}

export type InteractionType =
  | 'conversation'
  | 'divine_intervention'
  | 'combat'
  | 'hospitality'
  | 'deception'
  | 'recognition'
  | 'prophecy'
  | 'lament'
  | 'judgment'
  | 'transgression';

export interface Interaction {
  source: string;
  target: string;
  book: number;
  type: InteractionType;
  weight: number;
  /** true when the event belongs to Odysseus' first-person retrospective (Apologoi, Books 9–12). */
  nested_narrative: boolean;
  summary: string;
  insight?: string;
  citation?: string;
}

export type LocationStatus = 'Historical' | 'Contested' | 'Mythological';

export interface OdysseyLocation {
  id: string;
  name: string;
  status: LocationStatus;
  coordinates: [number, number]; // [lat, lng]
  books: number[];
  note?: string;
  events: { book: number; description: string }[];
}

export type ItineraryCharacter = 'odysseus' | 'telemachus' | 'divine';

export interface ItinerarySegment {
  character: ItineraryCharacter;
  segment: number;
  origin: string;
  destination: string;
  book: number;
  /** true = speculative/mythic route (rendered dashed); false = geographically plausible (solid). */
  inferred: boolean;
  /** true when the voyage is narrated inside the Apologoi flashback. */
  nested: boolean;
  summary: string;
  themes: string[];
  citation?: string;
}

export interface FocalizationRow {
  book: number;
  telemachus: number;
  odysseus: number;
  penelope: number;
  gods: number;
  other: number;
  /** Present only for Books 9–12: the dual-timeline of the Apologoi. */
  nested?: { frame: string; diegetic: string };
}

/** Coarse UI filter groups (checkbox toggles). */
export type GroupKey = 'loyalists' | 'suitors' | 'divine' | 'external';

/** What is currently pinned in the Close Reading panel. */
export type Selection =
  | { kind: 'edge'; a: string; b: string; interactions: Interaction[] }
  | { kind: 'segment'; segment: ItinerarySegment }
  | { kind: 'location'; location: OdysseyLocation }
  | { kind: 'character'; id: string };
