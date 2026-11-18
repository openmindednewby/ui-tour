import type { TourEvent } from '@dloizides/ui-tour';

interface UmamiWindow {
  umami?: { track: (name: string, data?: Record<string, string>) => void };
}

/** Sends a tour event to Umami (when its script is loaded) with only the tour id and mode. */
export function trackTourEvent(event: TourEvent): void {
  if (typeof window === 'undefined') return;
  (window as unknown as UmamiWindow).umami?.track(event.type, { tourId: event.tourId, mode: event.mode });
}
