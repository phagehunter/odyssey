import type { OdysseyLocation } from '../types';

/**
 * Spatial gazetteer. Status encodes the spatial-humanities split:
 *  - Historical: verifiable places of the Telemachy and the frame narrative.
 *  - Contested: identifications debated since antiquity (Eratosthenes vs. Crates).
 *  - Mythological: allegorical realms where Homer suspends real geography;
 *    coordinates follow post-Alexandrian scholarly tradition and are speculative.
 */
export const LOCATIONS: OdysseyLocation[] = [
  {
    id: 'troy', name: 'Troy', status: 'Historical', coordinates: [39.957, 26.239],
    books: [9],
    note: 'Hisarlik, on the Dardanelles. Point of departure for every nostos.',
    events: [{ book: 9, description: 'Departure of the twelve-ship contingent after the sack (recalled in the Apologoi).' }],
  },
  {
    id: 'ismaros', name: 'Ismaros (Cicones)', status: 'Historical', coordinates: [40.85, 25.66],
    books: [9],
    note: 'Thracian coast; a real Ciconian polity known to archaic Greeks.',
    events: [{ book: 9, description: 'The raid: city sacked, then the Ciconian cavalry counterattack — six men lost per ship.' }],
  },
  {
    id: 'lotus_eaters', name: 'Land of the Lotus-Eaters', status: 'Contested', coordinates: [33.8, 10.85],
    books: [9],
    note: 'Traditionally Djerba (Tunisia) since Herodotus 4.177 — contested.',
    events: [{ book: 9, description: 'The flowering food of forgetfulness; scouts dragged weeping back to the ships.' }],
  },
  {
    id: 'cyclopes', name: 'Island of the Cyclopes', status: 'Mythological', coordinates: [37.75, 15.1],
    books: [9],
    note: 'Tradition places it below Etna in eastern Sicily; the text gives an ungeographical "land beyond".',
    events: [
      { book: 9, description: 'The cave of Polyphemus: six men devoured; the Nobody-trick and the blinding.' },
      { book: 9, description: 'The name-boast from the ship and the curse of Poseidon set the plot of the poem.' },
    ],
  },
  {
    id: 'aeolia', name: 'Aeolia', status: 'Mythological', coordinates: [38.79, 15.21],
    books: [10],
    note: 'A floating island ringed in bronze — identified with the Aeolian (Lipari) islands by ancient scholars.',
    events: [{ book: 10, description: 'A month of hospitality; the bag of winds; Ithaca sighted, then lost when the crew open it.' }],
  },
  {
    id: 'laestrygonia', name: 'Telepylos (Laestrygonians)', status: 'Mythological', coordinates: [41.39, 9.16],
    books: [10],
    note: 'The closed harbour suggests Bonifacio (Corsica) to many; the near-nightless sky suggests the far north. Homer alters spatial reality here.',
    events: [{ book: 10, description: 'Giants spear men like fish; eleven of twelve ships destroyed in the harbour.' }],
  },
  {
    id: 'aeaea', name: 'Aeaea (Circe)', status: 'Mythological', coordinates: [41.23, 13.05],
    books: [10, 12],
    note: 'Identified since antiquity with Monte Circeo (Latium) — a promontory, not an island.',
    events: [
      { book: 10, description: 'Crew transformed to swine; moly; Circe\'s oath; a year at her hearth.' },
      { book: 12, description: 'Elpenor\'s burial; Circe\'s sailing directions for Sirens, Scylla, and Thrinacia.' },
    ],
  },
  {
    id: 'underworld', name: 'The Underworld (Nekyia)', status: 'Mythological', coordinates: [36.1, -6.9],
    books: [11],
    note: 'Beyond the stream of Ocean, in the fog-bound land of the Cimmerians — placed here at the Pillars of Heracles only as cartographic convention. No real geography applies.',
    events: [
      { book: 11, description: 'The blood-rite; Elpenor, Tiresias\' prophecy, Anticleia; the catalogue of heroines.' },
      { book: 11, description: 'Agamemnon\'s warning, Achilles\' recantation, Ajax\'s silence.' },
    ],
  },
  {
    id: 'sirens', name: 'Isle of the Sirens', status: 'Mythological', coordinates: [40.58, 14.43],
    books: [12],
    note: 'Tradition: Li Galli islets off the Sorrentine peninsula.',
    events: [{ book: 12, description: 'Wax-stopped ears and the mast-binding; the song that offers total knowledge.' }],
  },
  {
    id: 'scylla_charybdis', name: 'Scylla & Charybdis', status: 'Contested', coordinates: [38.24, 15.63],
    books: [12],
    note: 'The Strait of Messina identification is ancient and durable — a genuinely dangerous passage.',
    events: [{ book: 12, description: 'Six men taken by Scylla; on the return drift, Odysseus survives Charybdis clinging to the fig tree.' }],
  },
  {
    id: 'thrinacia', name: 'Thrinacia (Cattle of the Sun)', status: 'Contested', coordinates: [37.5, 14.0],
    books: [12],
    note: 'Equated with Sicily (Trinacria, "three-cornered") from antiquity.',
    events: [{ book: 12, description: 'Storm-bound and starving, the crew slaughter Helios\' cattle; Zeus\' thunderbolt destroys the ship at sea.' }],
  },
  {
    id: 'ogygia', name: 'Ogygia (Calypso)', status: 'Mythological', coordinates: [36.05, 14.25],
    books: [5],
    note: 'The "navel of the sea." Callimachus proposed Gaudos (Gozo, Malta); a purely speculative anchor based on Alexandrian geography.',
    events: [
      { book: 5, description: 'Seven years of detention; Hermes\' decree; the raft built in four days.' },
      { book: 5, description: 'Chronological start of Odysseus\' on-stage action (Books 5–8 frame).' },
    ],
  },
  {
    id: 'scheria', name: 'Scheria (Phaeacia)', status: 'Contested', coordinates: [39.62, 19.92],
    books: [6, 7, 8, 13],
    note: 'Corcyra/Corfu since Thucydides 1.25 — but the poem paints a liminal utopia at the edge of the known.',
    events: [
      { book: 6, description: 'Nausicaa at the river; the supplication of the castaway.' },
      { book: 7, description: 'Arete and Alcinous receive the stranger.' },
      { book: 8, description: 'Games, gifts, and Demodocus\' songs; the hidden weeping.' },
      { book: 13, description: 'The night-crossing home; the returning ship turned to stone by Poseidon.' },
    ],
  },
  {
    id: 'ithaca', name: 'Ithaca', status: 'Historical', coordinates: [38.36, 20.66],
    books: [1, 2, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    note: 'The goal of nostos. Modern Ithaki (though Dörpfeld argued for Lefkada — even "historical" Homeric geography carries contest).',
    events: [
      { book: 1, description: 'The suitors consume the house; Athena-as-Mentes rouses Telemachus.' },
      { book: 13, description: 'Odysseus, asleep, is laid on his own shore and does not know it.' },
      { book: 14, description: 'Eumaeus\' hut: xenia among the poor.' },
      { book: 22, description: 'The slaying of the 108 suitors in the sealed hall.' },
      { book: 23, description: 'The bed-test; reunion.' },
      { book: 24, description: 'Laertes\' orchard; the feud halted by Athena.' },
    ],
  },
  {
    id: 'pylos', name: 'Pylos', status: 'Historical', coordinates: [36.92, 21.7],
    books: [3, 15],
    note: 'Sandy Pylos — the Bronze Age "Palace of Nestor" at Ano Englianos is an excavated reality.',
    events: [
      { book: 3, description: 'Nestor\'s shore sacrifice; tales of the homecomings.' },
      { book: 15, description: 'Telemachus re-embarks, taking the seer Theoclymenus aboard.' },
    ],
  },
  {
    id: 'sparta', name: 'Sparta', status: 'Historical', coordinates: [37.08, 22.43],
    books: [4, 15],
    note: 'The Eurotas valley; Menelaus\' palace of Lacedaemon.',
    events: [
      { book: 4, description: 'Menelaus and Helen; the Proteus tale — Odysseus lives, on Ogygia.' },
      { book: 15, description: 'Athena stirs Telemachus homeward; the eagle omen at departure.' },
    ],
  },
  {
    id: 'olympus', name: 'Mount Olympus', status: 'Mythological', coordinates: [40.09, 22.36],
    books: [1, 5, 24],
    note: 'A real mountain; an unreal address. Marked mythological as the seat of divine machinery.',
    events: [
      { book: 1, description: 'First divine council: Athena pleads for Odysseus.' },
      { book: 5, description: 'Second council: Hermes dispatched to Ogygia.' },
      { book: 24, description: 'Zeus and Athena decree the peace of Ithaca.' },
    ],
  },
];

export const LOCATION_BY_ID: Record<string, OdysseyLocation> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l]),
);
