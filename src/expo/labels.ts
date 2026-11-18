import { defaultTourLabels } from '@dloizides/ui-tour';
import type { Tour, TourLabels } from '@dloizides/ui-tour';

export type Translate = (key: string) => string;

export const DEFAULT_LABEL_PREFIX = 'tours.labels';

export const defaultAppTourLabels = {
  takeTour: 'Take a tour',
  takeTourHint: 'Opens the list of guided tours',
};

export type AppTourLabelKey = keyof typeof defaultAppTourLabels;

/** Translates `key`; a missing or empty translation returns `fallback`. */
export function translateOr(translate: Translate, key: string, fallback: string): string {
  const value = translate(key);
  return typeof value === 'string' && value !== '' && value !== key ? value : fallback;
}

/** Builds every tour label from `<prefix>.<labelName>` keys, keeping the English default for a missing key. */
export function buildTourLabels(translate: Translate, prefix: string = DEFAULT_LABEL_PREFIX): TourLabels {
  const names = Object.keys(defaultTourLabels) as Array<keyof TourLabels>;
  const labels: TourLabels = { ...defaultTourLabels };
  names.forEach((name) => {
    labels[name] = translateOr(translate, `${prefix}.${name}`, defaultTourLabels[name]);
  });
  return labels;
}

/** Replaces each tour title, category and step text key with its translation. */
export function localizeTours(tours: readonly Tour[], translate: Translate): Tour[] {
  const text = (key: string): string => translateOr(translate, key, key);
  return tours.map((tour) => ({
    ...tour,
    title: text(tour.title),
    category: text(tour.category),
    steps: tour.steps.map((step) => ({ ...step, text: text(step.text) })),
  }));
}
