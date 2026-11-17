import { useCallback, useRef, useState } from 'react';
import { markOfferSeen } from '../engine/firstRunStore';
import { loadSession, saveSession } from '../engine/tourSession';
import { TourEventType } from '../enums/TourEventType';
import type { TourMode } from '../enums/TourMode';
import type { ActiveTour, Tour, TourEvent, TourUser } from '../types';

export interface ControlsOptions {
  tours: readonly Tour[];
  onEvent?: (event: TourEvent) => void;
  user: TourUser | null;
}

export interface TourControls {
  active: ActiveTour | null;
  paused: boolean;
  pickerOpen: boolean;
  start: (tourId: string, mode: TourMode) => void;
  next: () => void;
  back: () => void;
  end: () => void;
  togglePause: () => void;
  openPicker: () => void;
  closePicker: () => void;
}

export function useTourControls(options: ControlsOptions): TourControls {
  const [active, setActiveState] = useState<ActiveTour | null>(() => loadSession(options.tours));
  const [paused, setPaused] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const activeRef = useRef(active);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const setActive = useCallback((next: ActiveTour | null) => {
    activeRef.current = next;
    saveSession(next);
    setActiveState(next);
  }, []);

  const close = useCallback((type: TourEventType) => {
    const current = activeRef.current;
    if (current === null) return;
    const { onEvent, user } = optionsRef.current;
    onEvent?.({ type, tourId: current.tourId, mode: current.mode });
    if (type === TourEventType.Finish && user !== null) markOfferSeen(user.id);
    setPaused(false);
    setActive(null);
  }, [setActive]);

  const start = useCallback((tourId: string, mode: TourMode) => {
    if (!optionsRef.current.tours.some((tour) => tour.id === tourId)) return;
    setPickerOpen(false);
    setPaused(false);
    setActive({ tourId, step: 0, mode });
    optionsRef.current.onEvent?.({ type: TourEventType.Start, tourId, mode });
  }, [setActive]);

  const next = useCallback(() => {
    const current = activeRef.current;
    if (current === null) return;
    const tour = optionsRef.current.tours.find((candidate) => candidate.id === current.tourId);
    if (tour === undefined || current.step + 1 >= tour.steps.length) close(TourEventType.Finish);
    else setActive({ ...current, step: current.step + 1 });
  }, [close, setActive]);

  const back = useCallback(() => {
    const current = activeRef.current;
    if (current !== null && current.step > 0) setActive({ ...current, step: current.step - 1 });
  }, [setActive]);

  const end = useCallback(() => close(TourEventType.Quit), [close]);
  const togglePause = useCallback(() => setPaused((value) => !value), []);
  const openPicker = useCallback(() => setPickerOpen(true), []);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  return { active, paused, pickerOpen, start, next, back, end, togglePause, openPicker, closePicker };
}
