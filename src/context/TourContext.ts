import { createContext, useContext } from 'react';
import type { TourControls } from '../hooks/useTourControls';
import type { TourLabels } from '../labels';
import type { Point, StepView, Tour, TourTheme, TourUser, TourVars } from '../types';

export interface TourContextValue extends TourControls {
  tours: readonly Tour[];
  theme: TourTheme;
  labels: TourLabels;
  user: TourUser | null;
  vars: TourVars;
  view: StepView;
  cursor: Point | null;
  ripple: Point | null;
}

export const TourContext = createContext<TourContextValue | null>(null);

/** Returns the tour controls and state; must be called inside `TourProvider`. */
export function useTour(): TourContextValue {
  const value = useContext(TourContext);
  if (value === null) throw new Error('useTour must be used inside TourProvider');
  return value;
}
