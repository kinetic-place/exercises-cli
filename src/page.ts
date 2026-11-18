/**
 * Each exercise's page on Kinetic.place: the videos creators sell of it, to license for an app.
 *
 * The exercise's ID alone is the page's permanent address. The site sends it on to the page's own,
 * named in the language, so this needs no slug rules of its own, and links printed by copies of
 * this package installed long ago keep working whatever an exercise is called later.
 */
import type { Locale } from './types.js';

const SITE = 'https://kinetic.place';

/** `https://kinetic.place/exercises/<id>` in English, `…/es/exercises/<id>` in Spanish. */
export function exercisePageUrl(id: string, locale: Locale): string {
  return `${SITE}${locale === 'en' ? '' : `/${locale}`}/exercises/${id}`;
}

/** The words that go with the link, for a person in the terminal and for an AI assistant. */
export const PAGE_LABEL = 'Videos to license for this exercise';
