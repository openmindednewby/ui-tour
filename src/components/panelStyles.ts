import type { CSSProperties } from 'react';
import { LAYER_Z, MIN_HIT } from '../constants';
import type { TourTheme } from '../types';

export function backdropStyle(theme: TourTheme): CSSProperties {
  return { position: 'fixed', inset: 0, zIndex: LAYER_Z + 6, background: theme.scrim, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 };
}

export function panelStyle(theme: TourTheme): CSSProperties {
  return {
    background: theme.surface,
    color: theme.onSurface,
    border: `1px solid ${theme.accent}`,
    borderRadius: theme.radius,
    padding: '20px 22px',
    width: 'min(560px, 100%)',
    boxSizing: 'border-box',
    maxHeight: '90vh',
    overflow: 'auto',
    fontFamily: theme.fontFamily,
    fontSize: 15,
    lineHeight: 1.4,
  };
}

export function titleStyle(theme: TourTheme): CSSProperties {
  return { margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: theme.onSurface };
}

export function mutedStyle(theme: TourTheme): CSSProperties {
  return { margin: 0, color: theme.muted, fontSize: 13 };
}

export function groupButtonStyle(theme: TourTheme): CSSProperties {
  return {
    display: 'block',
    width: '100%',
    minHeight: MIN_HIT,
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    borderTop: `1px solid ${theme.divider}`,
    marginTop: 8,
    padding: '12px 0',
    color: theme.accent,
    fontFamily: theme.fontFamily,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  };
}

export function tourRowStyle(theme: TourTheme): CSSProperties {
  return { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '10px 0', borderTop: `1px solid ${theme.divider}` };
}

export function offerStyle(theme: TourTheme): CSSProperties {
  return {
    position: 'fixed',
    right: 12,
    bottom: 12,
    zIndex: LAYER_Z - 1,
    width: 'min(360px, calc(100vw - 24px))',
    boxSizing: 'border-box',
    background: theme.surface,
    color: theme.onSurface,
    border: `1px solid ${theme.accent}`,
    borderRadius: theme.radius,
    padding: 16,
    fontFamily: theme.fontFamily,
    fontSize: 15,
    lineHeight: 1.4,
  };
}
