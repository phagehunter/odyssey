import type { ItinerarySegment } from '../types';
import raw from '../../data/itineraries.json';

/** Journey segments for Odysseus, Telemachus and the divine messengers, from data/itineraries.json. */
export const ITINERARIES: ItinerarySegment[] = raw as ItinerarySegment[];
