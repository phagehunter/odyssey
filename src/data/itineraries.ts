import type { ItinerarySegment } from '../types';

/**
 * Travel segments. `inferred: false` = geographically plausible, explicitly
 * narrated coastal routes (solid lines). `inferred: true` = speculative legs
 * through the mythic western seas (dashed lines). `nested` marks voyages
 * narrated inside the Apologoi flashback (Books 9–12) — chronologically these
 * precede Book 5.
 */
export const ITINERARIES: ItinerarySegment[] = [
  // ——— Odysseus: Troy → Ithaca (segments 1–12 narrated in flashback) ———
  { character: 'odysseus', segment: 1, origin: 'troy', destination: 'ismaros', book: 9, inferred: false, nested: true,
    summary: 'The fleet coasts from the Troad to Thrace and sacks Ismaros — a plausible, named, historical route.',
    themes: ['Nostos begins', 'Heroic piracy'], citation: 'Od. 9.39–40' },
  { character: 'odysseus', segment: 2, origin: 'ismaros', destination: 'lotus_eaters', book: 9, inferred: true, nested: true,
    summary: 'Nine days of storm past Cape Malea and Cythera — the moment the fleet is blown off the real map.',
    themes: ['Threshold of the mythic', 'Storm as narrative device'], citation: 'Od. 9.67–84' },
  { character: 'odysseus', segment: 3, origin: 'lotus_eaters', destination: 'cyclopes', book: 9, inferred: true, nested: true,
    summary: 'From the coast of forgetting to the lawless island of the one-eyed shepherds.',
    themes: ['Xenia inverted', 'Civilization vs. savagery'], citation: 'Od. 9.105–110' },
  { character: 'odysseus', segment: 4, origin: 'cyclopes', destination: 'aeolia', book: 10, inferred: true, nested: true,
    summary: 'To the bronze-walled floating island of the wind-king.',
    themes: ['Xenia perfected', 'Divine favour'], citation: 'Od. 10.1–12' },
  { character: 'odysseus', segment: 5, origin: 'aeolia', destination: 'laestrygonia', book: 10, inferred: true, nested: true,
    summary: 'Six days\' rowing after the bag of winds fails — into the trap-harbour of the giants.',
    themes: ['Failed homecoming', 'Annihilation'], citation: 'Od. 10.80–82' },
  { character: 'odysseus', segment: 6, origin: 'laestrygonia', destination: 'aeaea', book: 10, inferred: true, nested: true,
    summary: 'One ship remains. Landfall on Circe\'s island, "where east and west mean nothing."',
    themes: ['Disorientation', 'Enchantment'], citation: 'Od. 10.133–197' },
  { character: 'odysseus', segment: 7, origin: 'aeaea', destination: 'underworld', book: 11, inferred: true, nested: true,
    summary: 'Across the stream of Ocean to the fog-bound Cimmerians and the house of Hades — the most purely allegorical voyage in the poem.',
    themes: ['Katabasis', 'Knowledge from the dead'], citation: 'Od. 11.1–22' },
  { character: 'odysseus', segment: 8, origin: 'underworld', destination: 'aeaea', book: 12, inferred: true, nested: true,
    summary: 'Return to Aeaea to bury Elpenor and receive Circe\'s sailing directions.',
    themes: ['Debt to the dead', 'Prophecy'], citation: 'Od. 12.1–15' },
  { character: 'odysseus', segment: 9, origin: 'aeaea', destination: 'sirens', book: 12, inferred: true, nested: true,
    summary: 'Past the flowering meadow of the Sirens, lashed to the mast.',
    themes: ['Temptation of knowledge', 'Restraint'], citation: 'Od. 12.166–200' },
  { character: 'odysseus', segment: 10, origin: 'sirens', destination: 'scylla_charybdis', book: 12, inferred: true, nested: true,
    summary: 'The strait: six men to Scylla rather than the whole ship to Charybdis.',
    themes: ['Tragic arithmetic of command'], citation: 'Od. 12.234–259' },
  { character: 'odysseus', segment: 11, origin: 'scylla_charybdis', destination: 'thrinacia', book: 12, inferred: true, nested: true,
    summary: 'To the island of the Sun — against the warnings of Tiresias and Circe both.',
    themes: ['Fate & choice', 'Hubris'], citation: 'Od. 12.260–305' },
  { character: 'odysseus', segment: 12, origin: 'thrinacia', destination: 'ogygia', book: 12, inferred: true, nested: true,
    summary: 'Shipwrecked by the thunderbolt, swept back through Charybdis, nine days adrift to Calypso\'s isle — alone.',
    themes: ['Sole survival', 'The proem fulfilled'], citation: 'Od. 12.403–453' },
  { character: 'odysseus', segment: 13, origin: 'ogygia', destination: 'scheria', book: 5, inferred: true, nested: false,
    summary: 'Eighteen days by raft steering by the Bear, wrecked by Poseidon, two days swimming — ashore on Scheria.',
    themes: ['Endurance', 'Divine persecution & rescue'], citation: 'Od. 5.262–493' },
  { character: 'odysseus', segment: 14, origin: 'scheria', destination: 'ithaca', book: 13, inferred: false, nested: false,
    summary: 'The Phaeacian night-crossing: a real, short sea-lane (Corfu → Ithaca) sailed by a magic ship while the hero sleeps.',
    themes: ['Nostos achieved', 'Liminal sleep'], citation: 'Od. 13.70–125' },

  // ——— Telemachus: the Telemachy (all geographically plausible) ———
  { character: 'telemachus', segment: 1, origin: 'ithaca', destination: 'pylos', book: 2, inferred: false, nested: false,
    summary: 'The secret night sailing south to sandy Pylos, Athena-as-Mentor at the helm.',
    themes: ['Coming of age', 'First voyage'], citation: 'Od. 2.413–434' },
  { character: 'telemachus', segment: 2, origin: 'pylos', destination: 'sparta', book: 3, inferred: false, nested: false,
    summary: 'Two days overland by chariot with Pisistratus, through Pherae to Lacedaemon.',
    themes: ['Xenia network', 'Overland travel'], citation: 'Od. 3.478–497' },
  { character: 'telemachus', segment: 3, origin: 'sparta', destination: 'pylos', book: 15, inferred: false, nested: false,
    summary: 'The homeward chariot run, skipping Nestor\'s hospitality to save time.',
    themes: ['Urgency', 'Polite evasion'], citation: 'Od. 15.182–214' },
  { character: 'telemachus', segment: 4, origin: 'pylos', destination: 'ithaca', book: 15, inferred: false, nested: false,
    summary: 'Sailing wide of the strait at Asteris to evade the suitors\' ambush, on Athena\'s warning.',
    themes: ['Ambush evaded', 'Divine guidance'], citation: 'Od. 15.28–42, 15.495–557' },

  // ——— Divine messengers ———
  { character: 'divine', segment: 1, origin: 'olympus', destination: 'ithaca', book: 1, inferred: true, nested: false,
    summary: 'Athena descends from Olympus to Ithaca as Mentes, spear in hand, to set the plot in motion.',
    themes: ['Divine machinery'], citation: 'Od. 1.96–105' },
  { character: 'divine', segment: 2, origin: 'olympus', destination: 'ogygia', book: 5, inferred: true, nested: false,
    summary: 'Hermes skims the waves "like a shearwater" to deliver Zeus\' decree of release.',
    themes: ['Divine machinery', 'Decree of release'], citation: 'Od. 5.43–58' },
  { character: 'divine', segment: 3, origin: 'olympus', destination: 'aeaea', book: 10, inferred: true, nested: true,
    summary: 'Hermes intercepts Odysseus on the path to Circe\'s hall with the herb moly.',
    themes: ['Divine machinery', 'Counter-magic'], citation: 'Od. 10.277–306' },
];
