import { fontStack } from '@dloizides/ui-tour';
import type { TourTheme } from '@dloizides/ui-tour';

import { pickAccentText, pickOnAccent } from './accentInk';

export interface AppThemeColors {
  background: string;
  surface: string;
  surfaceElevated?: string;
  text: string;
  textSecondary: string;
  border: string;
  divider?: string;
}

export interface AppThemeSource {
  colors: AppThemeColors;
  palette: { primary: { '300'?: string; '500'?: string; '600'?: string; '700'?: string } };
  mode?: string;
  typography?: { fontFamily?: string };
}

const DARK_MODE = 'dark';
const TOUR_RADIUS = 12;
const SCRIM_STRENGTH = '62%';

/** Maps an app theme (theme-web `ResolvedTheme` or ui-feedback theme) onto the tour colour slots. */
export function toTourTheme(theme: AppThemeSource, dark?: boolean): TourTheme {
  const isDark = dark ?? theme.mode === DARK_MODE;
  const { colors, palette } = theme;
  const lightAccent = palette.primary['700'] ?? palette.primary['600'] ?? palette.primary['500'] ?? colors.text;
  const accent = isDark ? palette.primary['300'] ?? colors.text : lightAccent;
  const shade = isDark ? colors.background : colors.text;
  const surface = colors.surfaceElevated ?? colors.surface;
  return {
    accent,
    onAccent: pickOnAccent(accent, colors.background, colors.surface, isDark ? colors.background : colors.surface),
    accentText: pickAccentText(palette.primary, surface, colors.text, isDark, accent),
    surface,
    onSurface: colors.text,
    muted: colors.textSecondary,
    scrim: `color-mix(in srgb, ${shade} ${SCRIM_STRENGTH}, transparent)`,
    divider: colors.divider ?? colors.border,
    radius: TOUR_RADIUS,
    fontFamily: fontStack(theme.typography?.fontFamily),
  };
}
