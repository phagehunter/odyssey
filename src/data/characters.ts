import type { Character } from '../types';

/**
 * Character & collective-entity catalogue.
 *
 * Collective flattening: the 108 suitors appear as two named leader nodes
 * (Antinous, Eurymachus) plus four regional aggregate nodes following the
 * catalogue given by Telemachus at Od. 16.245–253 — Dulichium 52, Same 24,
 * Zacynthus 20, Ithaca 12. The 50 palace maids appear as one aggregate
 * household node, with the 12 unfaithful maids (executed in Book 22) split
 * out so their edges can carry distinct properties.
 */
export const CHARACTERS: Character[] = [
  // ——— The house of Odysseus & Ithacan loyalists ———
  { id: 'odysseus', name: 'Odysseus', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['polytropos (much-turning)', 'polymetis (of many wiles)', 'sacker of cities'] },
  { id: 'telemachus', name: 'Telemachus', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['pepnymenos (prudent)'] },
  { id: 'penelope', name: 'Penelope', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['periphron (circumspect)', 'daughter of Icarius'] },
  { id: 'laertes', name: 'Laertes', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['old hero', 'orchard-keeper'] },
  { id: 'eumaeus', name: 'Eumaeus', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['dios hyphorbos (noble swineherd)'], note: 'Addressed by the narrator in the second person — a unique intimacy.' },
  { id: 'eurycleia', name: 'Eurycleia', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['dear nurse', 'daughter of Ops'] },
  { id: 'philoetius', name: 'Philoetius', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['loyal cowherd'] },
  { id: 'phemius', name: 'Phemius', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['Terpiades (son of Terpis)', 'singer under duress'] },
  { id: 'medon', name: 'Medon', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['herald of measured words'] },
  { id: 'argos', name: 'Argos', type: 'Animal', alignment: 'Loyalist', group_size: 1, epithets: ['the dog of Odysseus'], note: 'Waits twenty years; dies upon recognizing his master (Book 17).' },
  { id: 'maids_household', name: 'Palace Maids (Household of 50)', type: 'Mortal', alignment: 'Loyalist', group_size: 50, epithets: ['women of the halls'], note: 'Aggregate node for the 50 serving women of the palace (Od. 22.421–422).' },
  { id: 'crew', name: 'Companions of Odysseus', type: 'Mortal', alignment: 'Loyalist', group_size: 600, epithets: ['hetairoi (companions)'], note: 'Aggregate for the twelve-ship contingent; all perish before Book 13 (proem: "he could not save them").' },
  { id: 'eurylochus', name: 'Eurylochus', type: 'Mortal', alignment: 'Loyalist', group_size: 1, epithets: ['second-in-command', 'voice of mutiny'] },

  // ——— Achaean allies of the Telemachy ———
  { id: 'nestor', name: 'Nestor', type: 'Mortal', alignment: 'Ally', group_size: 1, epithets: ['Gerenian horseman', 'sweet-voiced counsellor'] },
  { id: 'menelaus', name: 'Menelaus', type: 'Mortal', alignment: 'Ally', group_size: 1, epithets: ['xanthos (red-haired)', 'war-cry-famed'] },
  { id: 'helen', name: 'Helen', type: 'Mortal', alignment: 'Ally', group_size: 1, epithets: ['Argive Helen', 'daughter of Zeus'] },
  { id: 'theoclymenus', name: 'Theoclymenus', type: 'Mortal', alignment: 'Ally', group_size: 1, epithets: ['fugitive seer of the Melampodidae'] },

  // ——— The suitor coalition (leaders + regional aggregates, Od. 16.245–253) ———
  { id: 'antinous', name: 'Antinous', type: 'Mortal', alignment: 'Suitor', group_size: 1, epithets: ['son of Eupeithes', 'ringleader'] },
  { id: 'eurymachus', name: 'Eurymachus', type: 'Mortal', alignment: 'Suitor', group_size: 1, epithets: ['son of Polybus', 'honey-tongued'] },
  { id: 'amphinomus', name: 'Amphinomus', type: 'Mortal', alignment: 'Suitor', group_size: 1, epithets: ['the decent suitor'], note: 'Warned by Odysseus in Book 18; Athena binds him to his fate regardless.' },
  { id: 'suitors_dulichium', name: 'Suitors of Dulichium (52)', type: 'Mortal', alignment: 'Suitor', group_size: 52, epithets: ['overbearing'], note: 'Regional aggregate per the catalogue at Od. 16.247–248.' },
  { id: 'suitors_same', name: 'Suitors of Same (24)', type: 'Mortal', alignment: 'Suitor', group_size: 24, epithets: ['overbearing'], note: 'Includes Ctesippus, hurler of the ox-hoof (Book 20).' },
  { id: 'suitors_zacynthus', name: 'Suitors of Zacynthus (20)', type: 'Mortal', alignment: 'Suitor', group_size: 20, epithets: ['overbearing'] },
  { id: 'suitors_ithaca', name: 'Suitors of Ithaca (12)', type: 'Mortal', alignment: 'Suitor', group_size: 12, epithets: ['the local twelve'] },
  { id: 'eupeithes', name: 'Eupeithes', type: 'Mortal', alignment: 'Antagonist', group_size: 1, epithets: ['father of Antinous', 'leader of the vendetta'] },
  { id: 'melanthius', name: 'Melanthius', type: 'Mortal', alignment: 'Antagonist', group_size: 1, epithets: ['treacherous goatherd'] },
  { id: 'melantho', name: 'Melantho', type: 'Mortal', alignment: 'Antagonist', group_size: 1, epithets: ['sharp-tongued maid'], note: 'Named exemplar of the unfaithful maids; sister of Melanthius.' },
  { id: 'maids_unfaithful', name: 'Unfaithful Maids (12)', type: 'Mortal', alignment: 'Antagonist', group_size: 12, epithets: ['shameless'], note: 'The twelve of the fifty who consorted with the suitors; executed in Book 22.' },
  { id: 'irus', name: 'Irus (Arnaeus)', type: 'Mortal', alignment: 'Antagonist', group_size: 1, epithets: ['the public beggar'] },

  // ——— Divine entities ———
  { id: 'athena', name: 'Athena', type: 'Divine', alignment: 'Divine', group_size: 1, epithets: ['glaukopis (grey-eyed)', 'Pallas', 'appears as Mentes & Mentor'] },
  { id: 'zeus', name: 'Zeus', type: 'Divine', alignment: 'Divine', group_size: 1, epithets: ['nephelegereta (cloud-gatherer)'] },
  { id: 'poseidon', name: 'Poseidon', type: 'Divine', alignment: 'Divine', group_size: 1, epithets: ['ennosigaios (earth-shaker)'] },
  { id: 'hermes', name: 'Hermes', type: 'Divine', alignment: 'Divine', group_size: 1, epithets: ['argeiphontes (slayer of Argus)', 'diaktoros (guide)'] },
  { id: 'helios', name: 'Helios', type: 'Divine', alignment: 'Divine', group_size: 1, epithets: ['Hyperion', 'who sees all things'] },
  { id: 'leucothea', name: 'Ino / Leucothea', type: 'Divine', alignment: 'Divine', group_size: 1, epithets: ['of the fair ankles', 'once mortal, now sea-goddess'] },

  // ——— Magical entities of the Apologoi ———
  { id: 'calypso', name: 'Calypso', type: 'Divine', alignment: 'Magical', group_size: 1, epithets: ['nymph with braided tresses', 'the concealer'] },
  { id: 'circe', name: 'Circe', type: 'Divine', alignment: 'Magical', group_size: 1, epithets: ['polypharmakos (of many drugs)', 'dread goddess with a human voice'] },
  { id: 'aeolus', name: 'Aeolus', type: 'Mortal', alignment: 'Magical', group_size: 1, epithets: ['keeper of the winds', 'dear to the gods'] },
  { id: 'polyphemus', name: 'Polyphemus', type: 'Monster', alignment: 'Magical', group_size: 1, epithets: ['Cyclops', 'son of Poseidon'] },
  { id: 'sirens', name: 'The Sirens', type: 'Monster', alignment: 'Magical', group_size: 2, epithets: ['singers of all that happens on earth'] },
  { id: 'scylla', name: 'Scylla', type: 'Monster', alignment: 'Magical', group_size: 1, epithets: ['six-headed', 'yelping horror'] },

  // ——— External civilizations ———
  { id: 'alcinous', name: 'Alcinous', type: 'Mortal', alignment: 'External', group_size: 1, epithets: ['king of the Phaeacians'] },
  { id: 'arete', name: 'Arete', type: 'Mortal', alignment: 'External', group_size: 1, epithets: ['queen honoured as no other woman'] },
  { id: 'nausicaa', name: 'Nausicaa', type: 'Mortal', alignment: 'External', group_size: 1, epithets: ['leukolenos (white-armed)'] },
  { id: 'demodocus', name: 'Demodocus', type: 'Mortal', alignment: 'External', group_size: 1, epithets: ['blind singer', 'beloved of the Muse'] },
  { id: 'cicones', name: 'The Cicones', type: 'Mortal', alignment: 'External', group_size: 200, epithets: ['spearmen of Ismaros'], note: 'Aggregate for the Thracian people raided in Book 9.' },
  { id: 'lotus_eaters', name: 'The Lotus-Eaters', type: 'Mortal', alignment: 'External', group_size: 50, epithets: ['eaters of the flowering food'], note: 'Aggregate collective.' },
  { id: 'laestrygonians', name: 'The Laestrygonians', type: 'Monster', alignment: 'External', group_size: 300, epithets: ['giants of Telepylos'], note: 'Aggregate; destroy eleven of the twelve ships (Book 10).' },

  // ——— Shades of the Nekyia (Books 11 & 24) ———
  { id: 'tiresias', name: 'Tiresias', type: 'Shade', alignment: 'Shade', group_size: 1, epithets: ['Theban seer', 'mind intact among the dead'] },
  { id: 'anticleia', name: 'Anticleia', type: 'Shade', alignment: 'Shade', group_size: 1, epithets: ['mother of Odysseus'] },
  { id: 'agamemnon', name: 'Agamemnon', type: 'Shade', alignment: 'Shade', group_size: 1, epithets: ['Atreides', 'lord of men'] },
  { id: 'achilles', name: 'Achilles', type: 'Shade', alignment: 'Shade', group_size: 1, epithets: ['swift-footed', 'best of the Achaeans'] },
  { id: 'elpenor', name: 'Elpenor', type: 'Shade', alignment: 'Shade', group_size: 1, epithets: ['youngest of the crew', 'unburied'] },
];

export const CHARACTER_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
);
