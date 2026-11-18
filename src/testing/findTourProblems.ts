import { isForbiddenClick, StepAction, TargetRole, validateTours } from '@dloizides/ui-tour';
import type { StepTarget, Tour, TourStep } from '@dloizides/ui-tour';

export type Translations = Readonly<Record<string, unknown>>;

const TEST_ID = /^[A-Za-z0-9][\w.:-]*$/;
const TEST_ID_SEPARATOR = /[-_.:]/;
const ROLES = new Set<string>(Object.values(TargetRole));

function lookup(translations: Translations, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => (node !== null && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), translations);
}

function keyProblem(translations: Translations, where: string, field: string, key: string): string[] {
  const value = lookup(translations, key);
  return typeof value === 'string' && value !== '' ? [] : [`${where}: ${field} key "${key}" is missing in translations`];
}

function targetProblems(where: string, target: StepTarget): string[] {
  if (typeof target === 'string') return TEST_ID.test(target) ? [] : [`${where}: malformed target "${target}"`];
  const problems: string[] = [];
  if (!ROLES.has(target.role)) problems.push(`${where}: unknown role "${String(target.role)}"`);
  if (target.nth !== undefined && !(Number.isInteger(target.nth) && target.nth >= 0)) problems.push(`${where}: nth must be a whole number >= 0`);
  return problems;
}

function targetNames(target: StepTarget): string[] {
  if (typeof target === 'string') return target.split(TEST_ID_SEPARATOR).filter((token) => token !== '');
  return [target.name instanceof RegExp ? target.name.source.replace(/^\^/, '') : target.name];
}

function writeProblem(where: string, tour: Tour, step: TourStep): string[] {
  if (step.action !== StepAction.Click) return [];
  const name = targetNames(step.target).find((candidate) => isForbiddenClick(candidate, tour.allowSave === true));
  return name === undefined ? [] : [`${where}: clicks write control "${name}"`];
}

function tourProblems(tour: Tour, translations: Translations): string[] {
  const problems = [...keyProblem(translations, `tour ${tour.id}`, 'title', tour.title), ...keyProblem(translations, `tour ${tour.id}`, 'category', tour.category)];
  (Array.isArray(tour.steps) ? tour.steps : []).forEach((step, index) => {
    const where = `tour ${tour.id} step ${index + 1}`;
    problems.push(...keyProblem(translations, where, 'text', step.text), ...targetProblems(where, step.target), ...writeProblem(where, tour, step));
  });
  return problems;
}

/** Lists every problem in key-based tour data: shape errors, missing translation keys, malformed targets, write-control clicks. */
export function findTourProblems(tours: readonly Tour[], translations: Translations): string[] {
  return [...validateTours(tours).errors, ...tours.flatMap((tour) => tourProblems(tour, translations))];
}

/** Throws one error listing every problem `findTourProblems` finds; call it from a jest test. */
export function expectValidTours(tours: readonly Tour[], translations: Translations): void {
  const problems = findTourProblems(tours, translations);
  if (problems.length > 0) throw new Error(`Invalid tours:\n${problems.join('\n')}`);
}
