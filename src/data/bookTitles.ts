import raw from '../../data/book-titles.json';

/** Short editorial title per book, from data/book-titles.json. */
export const BOOK_TITLES: Record<number, string> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [Number(k), v as string]));
