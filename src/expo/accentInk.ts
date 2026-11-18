import { contrastRatio, luminance, MIN_TEXT_CONTRAST } from './contrast';

const WHITE = 'white';
const WHITE_LUMINANCE = 1;

type Shades = Partial<Record<'300' | '500' | '600' | '700', string>>;

const LIGHT_FIRST = ['300', '500', '600', '700'] as const;
const DARK_FIRST = ['700', '600', '500', '300'] as const;

/** Picks white or the background, whichever contrasts more with the accent fill; `fallback` when the accent cannot be measured. */
export function pickOnAccent(accent: string, background: string, surface: string, fallback: string): string {
  if (luminance(accent) === undefined) return fallback;
  const white = luminance(surface) === WHITE_LUMINANCE ? surface : WHITE;
  return contrastRatio(white, accent) >= contrastRatio(background, accent) ? white : background;
}

/** First primary shade reaching AA on the caption surface (lighter first in dark), else the text colour; `fallback` when the surface cannot be measured. */
export function pickAccentText(shades: Shades, captionSurface: string, text: string, isDark: boolean, fallback: string): string {
  if (luminance(captionSurface) === undefined) return fallback;
  const order = isDark ? LIGHT_FIRST : DARK_FIRST;
  const passing = order.map((key) => shades[key]).find((shade) => shade !== undefined && contrastRatio(shade, captionSurface) >= MIN_TEXT_CONTRAST);
  return passing ?? text;
}
