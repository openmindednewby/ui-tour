import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { Point, TourTheme } from '../types';
import { cursorStyle, rippleStyle } from './styles';

export interface MarkProps {
  point: Point;
  theme: TourTheme;
}

export function TourCursor({ point, theme }: MarkProps): ReactElement {
  return (
    <div data-testid="tour-cursor" aria-hidden="true" style={cursorStyle(point)}>
      <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 2l7 19 2.6-7.4L20 11z" fill={theme.surface} stroke={theme.accent} strokeWidth={1.6} />
      </svg>
    </div>
  );
}

export function TourRipple({ point, theme }: MarkProps): ReactElement {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <div data-testid="tour-ripple" aria-hidden="true" style={rippleStyle(theme, point, grown)} />;
}
