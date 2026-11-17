import { TourMode } from '../enums/TourMode';
import type { ActiveTour, Tour } from '../types';

export const SESSION_KEY = '__tour-state';

const MODES: readonly string[] = Object.values(TourMode);

export function saveSession(active: ActiveTour | null): void {
  try {
    if (active === null) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(active));
  } catch {
    return;
  }
}

function isActiveTour(value: unknown): value is ActiveTour {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ActiveTour>;
  return typeof candidate.tourId === 'string' && typeof candidate.step === 'number' && MODES.includes(String(candidate.mode));
}

export function loadSession(tours: readonly Tour[]): ActiveTour | null {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
    if (!isActiveTour(parsed)) return null;
    const tour = tours.find((candidate) => candidate.id === parsed.tourId);
    const inRange = tour !== undefined && parsed.step >= 0 && parsed.step < tour.steps.length;
    return inRange ? { tourId: parsed.tourId, step: parsed.step, mode: parsed.mode } : null;
  } catch {
    return null;
  }
}
