/**
 * Greek line counts per book of the Odyssey (standard OCT numbering).
 * Butler's prose translation carries no line numbers, but it tracks the
 * Greek closely enough that a cited line's position within the book maps
 * proportionally onto the prose paragraphs — good enough to land the
 * reader at the right scene and flash it.
 */
export const BOOK_LINES: Record<number, number> = {
  1: 444, 2: 434, 3: 497, 4: 847, 5: 493, 6: 331, 7: 347, 8: 586,
  9: 566, 10: 574, 11: 640, 12: 453, 13: 440, 14: 533, 15: 557, 16: 481,
  17: 606, 18: 428, 19: 604, 20: 394, 21: 434, 22: 501, 23: 372, 24: 548,
};

/** Parse "Od. 20.345–372" → { book: 20, line: 345 }; null if unparseable. */
export function parseOdCitation(citation: string): { book: number; line: number } | null {
  const m = citation.match(/Od\.\s*(\d+)\.(\d+)/);
  if (!m) return null;
  return { book: Number(m[1]), line: Number(m[2]) };
}
