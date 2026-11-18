const GENERIC_TAIL = /(^|,)\s*(sans-serif|serif|monospace|cursive|fantasy)\s*$/i;
const FALLBACK = 'sans-serif';

/** Font stack that always ends in a generic family, so a missing web font falls back to sans-serif. */
export function fontStack(family: string | null | undefined): string {
  const clean = (family ?? '').trim();
  if (clean === '') return FALLBACK;
  return GENERIC_TAIL.test(clean) ? clean : `${clean}, ${FALLBACK}`;
}
