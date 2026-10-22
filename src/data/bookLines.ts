import raw from '../../data/book-lines.json';
/**
 * Greek line counts per book of the Odyssey (standard OCT numbering).
 * Butler's prose translation carries no line numbers, but it tracks the
 * Greek closely enough that a cited line's position within the book maps
 * proportionally onto the prose paragraphs — good enough to land the
 * reader at the right scene and flash it.
 */
export const BOOK_LINES: Record<number, number> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [Number(k), v as number]));

/** Parse "Od. 20.345–372" → { book: 20, line: 345 }; null if unparseable. */
export function parseOdCitation(citation: string): { book: number; line: number } | null {
  const m = citation.match(/Od\.\s*(\d+)\.(\d+)/);
  if (!m) return null;
  return { book: Number(m[1]), line: Number(m[2]) };
}
