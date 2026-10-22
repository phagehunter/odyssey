import type { Character } from '../types';
import raw from '../../data/characters.json';

/**
 * Character and collective-entity catalogue, loaded from data/characters.json.
 *
 * Collective flattening: the 108 suitors appear as two named leader nodes
 * (Antinous, Eurymachus) plus four regional aggregate nodes following the
 * catalogue given by Telemachus at Od. 16.245–253 (Dulichium 52, Same 24,
 * Zacynthus 20, Ithaca 12). The 50 palace maids appear as one aggregate
 * household node, with the 12 unfaithful maids (executed in Book 22) split
 * out so their edges can carry distinct properties.
 */
export const CHARACTERS: Character[] = raw as Character[];
export const CHARACTER_BY_ID: Record<string, Character> = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));
