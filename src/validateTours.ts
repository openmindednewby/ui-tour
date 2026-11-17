import { StepAction } from './enums/StepAction';
import type { StepTarget, Tour, TourStep } from './types';

export interface TourValidation {
  valid: boolean;
  errors: string[];
}

function hasTarget(target: StepTarget | undefined | null): boolean {
  if (typeof target === 'string') return target.trim() !== '';
  if (target === undefined || target === null) return false;
  return typeof target.name === 'string' ? target.name.trim() !== '' : target.name instanceof RegExp;
}

function stepErrors(tourId: string, index: number, step: TourStep): string[] {
  const where = `tour ${tourId} step ${index + 1}`;
  const errors: string[] = [];
  if (!hasTarget(step.target)) errors.push(`${where}: missing target`);
  if (typeof step.text !== 'string' || step.text.trim() === '') errors.push(`${where}: missing text`);
  if (step.action === StepAction.Type && (step.value ?? '') === '') errors.push(`${where}: type step needs a value`);
  return errors;
}

/** Checks tour data and lists every problem found; `valid` is true only when the list is empty. */
export function validateTours(tours: readonly Tour[]): TourValidation {
  const errors: string[] = [];
  const seen = new Set<string>();
  tours.forEach((tour, index) => {
    const id = typeof tour.id === 'string' && tour.id.trim() !== '' ? tour.id : `#${index + 1}`;
    if (seen.has(id)) errors.push(`tour ${id}: duplicate id`);
    seen.add(id);
    const steps = Array.isArray(tour.steps) ? tour.steps : [];
    if (steps.length === 0) errors.push(`tour ${id}: has no steps`);
    steps.forEach((step, stepIndex) => errors.push(...stepErrors(id, stepIndex, step)));
  });
  return { valid: errors.length === 0, errors };
}
