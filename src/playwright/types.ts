import type { TourRunFailure } from './TourRunFailure';

export interface TourLocator {
  count(): Promise<number>;
  click(): Promise<void>;
  getAttribute(name: string): Promise<string | null>;
  nth(index: number): TourLocator;
  first(): TourLocator;
}

export interface TourPage {
  locator(selector: string): TourLocator;
  keyboard: { press(key: string): Promise<void> };
  waitForTimeout(ms: number): Promise<void>;
}

export interface PlayToursOptions {
  ids?: readonly string[];
  openPicker?: (page: TourPage) => Promise<void>;
  stepTimeoutMs?: number;
  pollMs?: number;
}

export interface TourRunResult {
  tourId: string;
  passed: boolean;
  step: number;
  steps: number;
  reason?: TourRunFailure;
  message?: string;
}
