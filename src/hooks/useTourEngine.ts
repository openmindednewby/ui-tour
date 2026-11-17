import { useMemo } from 'react';
import type { TourContextValue } from '../context/TourContext';
import { stepOf } from '../engine/stepEffects';
import { defaultTourLabels } from '../labels';
import type { TourLabels } from '../labels';
import type { Tour, TourEvent, TourTheme, TourTiming, TourUser, TourVars } from '../types';
import { useAutoAdvance, useGuideClick, useRectTracking, useTourKeys } from './useStepListeners';
import { useStepRunner } from './useStepRunner';
import { useTourControls } from './useTourControls';

export interface TourEngineOptions {
  tours: readonly Tour[];
  navigate: (route: string) => void;
  getPathname: () => string;
  onEvent?: (event: TourEvent) => void;
  user: TourUser | null;
  allowWrites: boolean;
  vars: TourVars;
  timing: TourTiming;
  theme: TourTheme;
  labels?: Partial<TourLabels>;
}

export function useTourEngine(options: TourEngineOptions): TourContextValue {
  const controls = useTourControls(options);
  const runner = useStepRunner({ ...options, active: controls.active, onSkip: controls.next });
  const action = stepOf(options.tours, controls.active)?.action ?? null;
  useTourKeys(controls);
  useAutoAdvance(controls.active, runner.view.phase, controls.paused, options.timing.autoMs, controls.next);
  useGuideClick({ active: controls.active, phase: runner.view.phase, action, nodeRef: runner.nodeRef, next: controls.next, delayMs: options.timing.guideAdvanceMs });
  useRectTracking(runner.view.phase, runner.refreshRect);
  const labels = useMemo(() => ({ ...defaultTourLabels, ...options.labels }), [options.labels]);
  return {
    ...controls,
    tours: options.tours,
    theme: options.theme,
    labels,
    user: options.user,
    vars: options.vars,
    view: runner.view,
    cursor: runner.cursor,
    ripple: runner.ripple,
  };
}
