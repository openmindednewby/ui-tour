import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useTour } from '../context/TourContext';
import { TourMode } from '../enums/TourMode';
import { ringStyle, scrimStyle } from './styles';
import { TourCaption } from './TourCaption';
import { TourCursor, TourRipple } from './TourMarks';

export function TourOverlay(): ReactElement | null {
  const { active, view, cursor, ripple, theme } = useTour();
  if (active === null || typeof document === 'undefined') return null;
  return createPortal(
    <div data-tour-overlay="" data-testid="tour-overlay">
      {view.rect !== null ? <div data-testid="tour-ring" style={ringStyle(theme, view.rect)} /> : <div data-testid="tour-scrim" style={scrimStyle(theme)} />}
      {active.mode !== TourMode.Guide && cursor !== null ? <TourCursor point={cursor} theme={theme} /> : null}
      {ripple !== null ? <TourRipple point={ripple} theme={theme} /> : null}
      <TourCaption />
    </div>,
    document.body,
  );
}
