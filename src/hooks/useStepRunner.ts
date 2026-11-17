import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { rectOf } from '../dom/pointer';
import { applyOutcome, cursorMover, IDLE_VIEW, LOADING_VIEW, stepOf, tourOf } from '../engine/stepEffects';
import { runStep } from '../engine/runStep';
import type { ActiveTour, Point, StepView, Tour, TourTiming, TourVars } from '../types';

export interface StepRunnerOptions {
  tours: readonly Tour[];
  active: ActiveTour | null;
  navigate: (route: string) => void;
  getPathname: () => string;
  vars: TourVars;
  timing: TourTiming;
  allowWrites: boolean;
  onSkip: () => void;
}

export interface StepRunner {
  view: StepView;
  cursor: Point | null;
  ripple: Point | null;
  nodeRef: MutableRefObject<Element | null>;
  refreshRect: () => void;
}

export function useStepRunner(options: StepRunnerOptions): StepRunner {
  const [view, setView] = useState<StepView>(IDLE_VIEW);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [ripple, setRipple] = useState<Point | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const { active } = options;

  const refreshRect = useCallback(() => {
    const node = nodeRef.current;
    if (node !== null) setView((current) => ({ ...current, rect: rectOf(node) }));
  }, []);

  useEffect(() => {
    nodeRef.current = null;
    const latest = optionsRef.current;
    const step = stepOf(latest.tours, active);
    if (active === null || step === null) {
      setView(IDLE_VIEW);
      setCursor(null);
      return undefined;
    }
    let cancelled = false;
    setView(LOADING_VIEW);
    const allowSave = latest.allowWrites && tourOf(latest.tours, active)?.allowSave === true;
    void runStep({
      step,
      mode: active.mode,
      vars: latest.vars,
      timing: latest.timing,
      allowSave,
      navigate: latest.navigate,
      getPathname: latest.getPathname,
      isCancelled: () => cancelled,
      moveCursor: cursorMover(latest.timing.cursorMs, setCursor, setRipple),
    }).then((outcome) => {
      if (!cancelled) applyOutcome(outcome, nodeRef, setView, optionsRef.current.onSkip);
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return { view, cursor, ripple, nodeRef, refreshRect };
}
