/**
 * Butler-translation name → character-node id.
 * Butler (1900) uses Roman divine names and some variant spellings;
 * this map powers the interactive names in the Text reader.
 */
export const NAME_TO_ID: Record<string, string> = {
  // Roman divine names
  Ulysses: 'odysseus',
  Minerva: 'athena',
  Jove: 'zeus',
  Jupiter: 'zeus',
  Neptune: 'poseidon',
  Mercury: 'hermes',
  // Unchanged / Greek names
  Telemachus: 'telemachus',
  Penelope: 'penelope',
  Laertes: 'laertes',
  Calypso: 'calypso',
  Circe: 'circe',
  Alcinous: 'alcinous',
  Arete: 'arete',
  Nausicaa: 'nausicaa',
  Demodocus: 'demodocus',
  Nestor: 'nestor',
  Menelaus: 'menelaus',
  Helen: 'helen',
  Eumaeus: 'eumaeus',
  // Butler's spellings
  Euryclea: 'eurycleia',
  Eurycleia: 'eurycleia',
  Philoetius: 'philoetius',
  Antinous: 'antinous',
  Eurymachus: 'eurymachus',
  Amphinomus: 'amphinomus',
  Melanthius: 'melanthius',
  Melantho: 'melantho',
  Irus: 'irus',
  Eupeithes: 'eupeithes',
  Theoclymenus: 'theoclymenus',
  Medon: 'medon',
  Phemius: 'phemius',
  Argos: 'argos',
  Eurylochus: 'eurylochus',
  Elpenor: 'elpenor',
  Teiresias: 'tiresias',
  Tiresias: 'tiresias',
  Anticlea: 'anticleia',
  Anticleia: 'anticleia',
  Agamemnon: 'agamemnon',
  Achilles: 'achilles',
  // Monsters, magical & external
  Polyphemus: 'polyphemus',
  Cyclops: 'polyphemus',
  Aeolus: 'aeolus',
  Scylla: 'scylla',
  Sirens: 'sirens',
  Siren: 'sirens',
  Ino: 'leucothea',
  Leucothea: 'leucothea',
  Hyperion: 'helios',
  Laestrygonians: 'laestrygonians',
  Laestrygonian: 'laestrygonians',
  Cicons: 'cicones',
  Cicones: 'cicones',
  // Athena in disguise
  Mentor: 'athena',
  Mentes: 'athena',
};

/** Longest-first alternation so e.g. "Eurycleia" wins over shorter overlaps. */
export const NAME_REGEX = new RegExp(
  `\\b(${Object.keys(NAME_TO_ID)
    .sort((a, b) => b.length - a.length)
    .join('|')})\\b`,
);
