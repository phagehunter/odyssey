import type { FocalizationRow } from '../types';
import raw from '../../data/focalization.json';

/**
 * Focalization share per book (editorial estimates, not token counts), from data/focalization.json.
 * Books 9–12 carry a "nested" record: the chronological frame stays at the
 * Phaeacian court while the diegesis is Odysseus' first-person flashback.
 */
export const FOCALIZATION: FocalizationRow[] = raw as FocalizationRow[];
