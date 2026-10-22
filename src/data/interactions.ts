import type { Interaction } from '../types';
import raw from '../../data/interactions.json';

/** Interaction ledger (edges), loaded from data/interactions.json. Every entry carries an Od. book.line citation. */
export const INTERACTIONS: Interaction[] = raw as Interaction[];
