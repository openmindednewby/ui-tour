import type { TourContextValue } from '../context/TourContext';
import { defaultTourLabels } from '../labels';
import type { TourLabels } from '../labels';
import type { Tour, TourTheme } from '../types';
import { IDLE_VIEW } from './stepEffects';

const ignore = (): void => undefined;

export function inertTour(tours: readonly Tour[], theme: TourTheme, labels?: Partial<TourLabels>): TourContextValue {
  return {
    active: null,
    paused: false,
    pickerOpen: false,
    start: ignore,
    next: ignore,
    back: ignore,
    end: ignore,
    togglePause: ignore,
    openPicker: ignore,
    closePicker: ignore,
    tours,
    theme,
    labels: { ...defaultTourLabels, ...labels },
    user: null,
    vars: {},
    view: IDLE_VIEW,
    cursor: null,
    ripple: null,
  };
}
