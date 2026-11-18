import { toTourTheme } from './toTourTheme';
import type { AppThemeSource } from './toTourTheme';

const base: AppThemeSource = {
  colors: { background: 'ivory', surface: 'white', surfaceElevated: 'snow', text: 'black', textSecondary: 'gray', border: 'silver', divider: 'gainsboro' },
  palette: { primary: { '300': 'lightblue', '600': 'blue', '700': 'navy' } },
  typography: { fontFamily: 'Inter' },
};

describe('toTourTheme', () => {
  it('in light mode, uses primary 700 as the accent and the surface as its ink', () => {
    const theme = { ...base, mode: 'light' };

    const tour = toTourTheme(theme);

    expect([tour.accent, tour.onAccent, tour.surface, tour.divider]).toEqual(['navy', 'white', 'snow', 'gainsboro']);
  });

  it('with mode dark, uses primary 300 as the accent and the background as its ink', () => {
    const theme = { ...base, mode: 'dark' };

    const tour = toTourTheme(theme);

    expect([tour.accent, tour.onAccent]).toEqual(['lightblue', 'ivory']);
  });

  it('with the dark argument, overrides the theme mode', () => {
    const theme = { ...base, mode: 'light' };

    const tour = toTourTheme(theme, true);

    expect(tour.accent).toBe('lightblue');
  });

  it('without divider, elevated surface or typography, falls back to border, surface and sans-serif', () => {
    const theme: AppThemeSource = { colors: { background: 'ivory', surface: 'white', text: 'black', textSecondary: 'gray', border: 'silver' }, palette: { primary: { '500': 'teal' } } };

    const tour = toTourTheme(theme);

    expect([tour.accent, tour.surface, tour.divider, tour.fontFamily]).toEqual(['teal', 'white', 'silver', 'sans-serif']);
  });

  it('with a named font, appends the sans-serif fallback', () => {
    const theme = { ...base };

    const tour = toTourTheme(theme);

    expect(tour.fontFamily).toBe('Inter, sans-serif');
  });
});
