import { fontStack } from '../fontStack';
import type { CSSProperties } from 'react';
import { LAYER_Z, MIN_HIT, RING_PADDING } from '../constants';
import type { Position } from '../dom/placement';
import type { Point, TargetRect, TourTheme } from '../types';

const EASE = 'cubic-bezier(.4,0,.2,1)';

export function ringStyle(theme: TourTheme, rect: TargetRect): CSSProperties {
  return {
    position: 'fixed',
    zIndex: LAYER_Z,
    pointerEvents: 'none',
    left: rect.left - RING_PADDING,
    top: rect.top - RING_PADDING,
    width: rect.width + 2 * RING_PADDING,
    height: rect.height + 2 * RING_PADDING,
    border: `3px solid ${theme.accent}`,
    borderRadius: theme.radius,
    boxShadow: `0 0 0 9999px ${theme.scrim}`,
    transition: `all 350ms ${EASE}`,
  };
}

export function scrimStyle(theme: TourTheme): CSSProperties {
  return { position: 'fixed', inset: 0, zIndex: LAYER_Z, pointerEvents: 'none', background: theme.scrim };
}

export function captionStyle(theme: TourTheme, position: Position): CSSProperties {
  return {
    position: 'fixed',
    zIndex: LAYER_Z + 5,
    left: position.left,
    top: position.top,
    width: 'min(440px, calc(100vw - 24px))',
    boxSizing: 'border-box',
    background: theme.surface,
    color: theme.onSurface,
    border: `1px solid ${theme.accent}`,
    borderRadius: theme.radius,
    padding: '14px 16px',
    fontFamily: fontStack(theme.fontFamily),
    fontSize: 16,
    lineHeight: 1.4,
    overflowWrap: 'anywhere',
    transition: `left 350ms ${EASE}, top 350ms ${EASE}`,
  };
}

export function metaStyle(theme: TourTheme): CSSProperties {
  return { color: theme.accent, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 };
}

export function noteStyle(theme: TourTheme): CSSProperties {
  return { color: theme.accent, fontSize: 14, marginTop: 6 };
}

export function rowStyle(theme: TourTheme): CSSProperties {
  return { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 10, color: theme.muted, fontSize: 13 };
}

export function buttonStyle(theme: TourTheme, primary: boolean): CSSProperties {
  return {
    minHeight: MIN_HIT,
    minWidth: MIN_HIT,
    padding: '8px 14px',
    borderRadius: theme.radius,
    border: `1px solid ${theme.accent}`,
    background: primary ? theme.accent : 'transparent',
    color: primary ? theme.onAccent : theme.onSurface,
    fontFamily: fontStack(theme.fontFamily),
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };
}

export function cursorStyle(point: Point): CSSProperties {
  return {
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: LAYER_Z + 7,
    pointerEvents: 'none',
    transform: `translate(${point.x}px, ${point.y}px)`,
    transition: `transform 700ms ${EASE}`,
  };
}

export function rippleStyle(theme: TourTheme, point: Point, grown: boolean): CSSProperties {
  return {
    position: 'fixed',
    left: point.x - 8,
    top: point.y - 8,
    width: 16,
    height: 16,
    borderRadius: '50%',
    zIndex: LAYER_Z + 6,
    pointerEvents: 'none',
    border: `3px solid ${theme.accent}`,
    transform: grown ? 'scale(3.2)' : 'scale(0.4)',
    opacity: grown ? 0 : 1,
    transition: 'transform 600ms ease-out, opacity 600ms ease-out',
  };
}
