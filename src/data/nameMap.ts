import raw from '../../data/name-map.json';
/**
 * Butler-translation name → character-node id.
 * Butler (1900) uses Roman divine names and some variant spellings;
 * this map powers the interactive names in the Text reader.
 */
export const NAME_TO_ID: Record<string, string> = raw as Record<string, string>;

/** Longest-first alternation so e.g. "Eurycleia" wins over shorter overlaps. */
export const NAME_REGEX = new RegExp(
  `\\b(${Object.keys(NAME_TO_ID)
    .sort((a, b) => b.length - a.length)
    .join('|')})\\b`,
);
