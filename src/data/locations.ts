import type { OdysseyLocation } from '../types';
import raw from '../../data/locations.json';

/**
 * Spatial gazetteer, loaded from data/locations.json. Status encodes the spatial-humanities split:
 *  - Historical: verifiable places of the Telemachy and the frame narrative.
 *  - Contested: identifications debated since antiquity (Eratosthenes vs. Crates).
 *  - Mythological: allegorical realms where Homer suspends real geography;
 *    coordinates follow post-Alexandrian scholarly tradition and are speculative.
 */
export const LOCATIONS: OdysseyLocation[] = raw as OdysseyLocation[];
export const LOCATION_BY_ID: Record<string, OdysseyLocation> = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
