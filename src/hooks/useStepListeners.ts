import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { StepAction } from '../enums/StepAction';
import { StepPhase } from '../enums/StepPhase';
import { TourMode } from '../enums/TourMode';
import type { ActiveTour } from '../types';
import type { TourControls } from './useTourControls';

export function handleTourKey(key: string, controls: TourControls): boolean {
  if (key === 'F2') controls.openPicker();
  else if (controls.pickerOpen && key === 'Escape') controls.closePicker();
  else if (controls.active === null) return false;
  else if (key === 'Escape') controls.end();
  else if (key === 'ArrowRight') controls.next();
  else if (key === 'ArrowLeft') controls.back();
  else if (key === ' ' && controls.active.mode === TourMode.Auto) controls.togglePause();
  else return false;
  return true;
}

export function useTourKeys(controls: TourControls): void {
  const controlsRef = useRef(controls);
  controlsRef.current = controls;
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (!handleTourKey(event.key, controlsRef.current)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
}

export function useAutoAdvance(active: ActiveTour | null, phase: StepPhase, paused: boolean, autoMs: number, next: () => void): void {
  useEffect(() => {
    if (active === null || active.mode !== TourMode.Auto || paused) return undefined;
    if (phase === StepPhase.Idle || phase === StepPhase.Loading) return undefined;
    const timer = setTimeout(next, autoMs);
    return () => clearTimeout(timer);
  }, [active, phase, paused, autoMs, next]);
}

export interface GuideClickOptions {
  active: ActiveTour | null;
  phase: StepPhase;
  action: StepAction | null;
  nodeRef: MutableRefObject<Element | null>;
  next: () => void;
  delayMs: number;
}

export function useGuideClick({ active, phase, action, nodeRef, next, delayMs }: GuideClickOptions): void {
  useEffect(() => {
    if (active === null || active.mode !== TourMode.Guide || phase !== StepPhase.Ready || action !== StepAction.Click) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onClick = (event: MouseEvent): void => {
      const node = nodeRef.current;
      if (node !== null && event.target instanceof Node && node.contains(event.target)) timer = setTimeout(next, delayMs);
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [active, phase, action, nodeRef, next, delayMs]);
}

export function useRectTracking(phase: StepPhase, refreshRect: () => void): void {
  useEffect(() => {
    if (phase !== StepPhase.Ready && phase !== StepPhase.Refused) return undefined;
    window.addEventListener('resize', refreshRect);
    window.addEventListener('scroll', refreshRect, true);
    return () => {
      window.removeEventListener('resize', refreshRect);
      window.removeEventListener('scroll', refreshRect, true);
    };
  }, [phase, refreshRect]);
}
