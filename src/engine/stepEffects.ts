import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { RIPPLE_MS } from '../constants';
import { rectOf } from '../dom/pointer';
import { sleep } from '../dom/waitForTarget';
import { StepOutcomeKind } from '../enums/StepOutcomeKind';
import { StepPhase } from '../enums/StepPhase';
import type { ActiveTour, Point, StepView, Tour, TourStep } from '../types';
import type { StepOutcome } from './runStep';

export const IDLE_VIEW: StepView = { phase: StepPhase.Idle, rect: null, refusedName: '' };
export const LOADING_VIEW: StepView = { phase: StepPhase.Loading, rect: null, refusedName: '' };

export function tourOf(tours: readonly Tour[], active: ActiveTour | null): Tour | null {
  if (active === null) return null;
  return tours.find((tour) => tour.id === active.tourId) ?? null;
}

export function stepOf(tours: readonly Tour[], active: ActiveTour | null): TourStep | null {
  const tour = tourOf(tours, active);
  return tour !== null && active !== null ? (tour.steps[active.step] ?? null) : null;
}

export function cursorMover(
  cursorMs: number,
  setCursor: Dispatch<SetStateAction<Point | null>>,
  setRipple: Dispatch<SetStateAction<Point | null>>,
): (point: Point) => Promise<void> {
  return async (point) => {
    setCursor(point);
    await sleep(cursorMs);
    setRipple(point);
    setTimeout(() => setRipple(null), RIPPLE_MS);
  };
}

export function applyOutcome(
  outcome: StepOutcome,
  nodeRef: MutableRefObject<Element | null>,
  setView: Dispatch<SetStateAction<StepView>>,
  onSkip: () => void,
): void {
  if (outcome.kind === StepOutcomeKind.Skip) onSkip();
  else if (outcome.kind === StepOutcomeKind.Missing) setView({ phase: StepPhase.Missing, rect: null, refusedName: '' });
  else if (outcome.kind === StepOutcomeKind.Refused) {
    nodeRef.current = outcome.node;
    setView({ phase: StepPhase.Refused, rect: rectOf(outcome.node), refusedName: outcome.name });
  } else if (outcome.kind === StepOutcomeKind.Ready) {
    nodeRef.current = outcome.clicked ? null : outcome.node;
    setView({ phase: StepPhase.Ready, rect: outcome.clicked ? null : rectOf(outcome.node), refusedName: '' });
  }
}
