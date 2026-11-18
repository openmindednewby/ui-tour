import { toTourTheme } from './toTourTheme';
import { contrastRatio } from './contrast';
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

const kefiDark: AppThemeSource = {
  colors: { background: 'rgb(30,25,34)', surface: 'rgb(40,33,48)', text: '#f4eef7', textSecondary: '#b9adc2', border: '#3a3042' },
  palette: { primary: { '300': '#c42b22', '500': '#a8241c', '600': '#8f1f18', '700': '#761912' } },
  mode: 'dark',
};

describe('toTourTheme contrast', () => {
  it('with the kefi dark accent, inks the accent fill in white', () => {
    const theme = { ...kefiDark };

    const tour = toTourTheme(theme);

    expect(tour.onAccent).toBe('white');
  });

  it('with the kefi dark palette below 4.5 on the caption, labels in the text colour', () => {
    const theme = { ...kefiDark };

    const tour = toTourTheme(theme);

    expect([tour.accentText, contrastRatio(String(tour.accentText), 'rgb(40,33,48)') >= 4.5]).toEqual(['#f4eef7', true]);
  });

  it('in dark mode with a light shade passing, labels in the lightest passing shade', () => {
    const theme = { ...kefiDark, palette: { primary: { '300': '#ff9b94', '500': '#ff6a60', '700': '#761912' } } };

    const tour = toTourTheme(theme);

    expect(tour.accentText).toBe('#ff9b94');
  });

  it('in light mode with primary 700 too pale, labels in the darker passing shade 600', () => {
    const theme: AppThemeSource = { ...kefiDark, colors: { ...kefiDark.colors, background: '#fbf9f4', surface: '#ffffff' }, palette: { primary: { '500': '#ffd0cc', '600': '#8f1f18', '700': '#ffb0aa' } }, mode: 'light' };

    const tour = toTourTheme(theme);

    expect(tour.accentText).toBe('#8f1f18');
  });

  it('with a light theme whose primary 700 passes, keeps the accent, surface ink and label unchanged', () => {
    const theme: AppThemeSource = { colors: { background: 'rgb(251,249,244)', surface: '#FFFFFF', text: '#1d1a20', textSecondary: '#5d5562', border: '#ddd6cc' }, palette: { primary: { '300': '#e8766f', '600': '#a8241c', '700': '#8f1f18' } }, mode: 'light' };

    const tour = toTourTheme(theme);

    expect([tour.accent, tour.onAccent, tour.accentText]).toEqual(['#8f1f18', '#FFFFFF', '#8f1f18']);
  });

  it('with a pale accent, inks it in the darker background', () => {
    const theme = { ...kefiDark, palette: { primary: { '300': '#ffd0cc' } } };

    const tour = toTourTheme(theme);

    expect(tour.onAccent).toBe('rgb(30,25,34)');
  });
});
