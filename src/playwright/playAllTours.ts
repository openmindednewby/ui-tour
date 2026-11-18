import { tourFailure, TourRunFailure } from './TourRunFailure';
import type { PlayToursOptions, TourPage, TourRunResult } from './types';

const START_PREFIX = 'tour-start-';
const AUTO_SUFFIX = '-auto';
const AUTO_BUTTONS = `[data-testid^="${START_PREFIX}"][data-testid$="${AUTO_SUFFIX}"]`;
const CLOSED_GROUPS = '[data-testid^="tour-group-"][aria-expanded="false"]';
const PICKER = '[data-testid="tour-picker"]';
const CAPTION = '[data-testid="tour-caption"]';
const SKIP = '[data-testid="tour-skip"]';
const GONE_POLLS = 2;
const DEFAULT_STEP_TIMEOUT_MS = 30000;
const DEFAULT_POLL_MS = 250;

interface RunState {
  seen: boolean;
  step: number;
  steps: number;
  sinceChangeMs: number;
  gonePolls: number;
}

async function expandGroups(page: TourPage): Promise<void> {
  const closed = page.locator(CLOSED_GROUPS);
  let remaining = await closed.count();
  while (remaining > 0) {
    await closed.first().click();
    const next = await closed.count();
    if (next >= remaining) return;
    remaining = next;
  }
}

async function showPicker(page: TourPage, options: PlayToursOptions): Promise<void> {
  if ((await page.locator(PICKER).count()) === 0) {
    if (options.openPicker !== undefined) await options.openPicker(page);
    else await page.keyboard.press('F2');
  }
  await expandGroups(page);
}

async function listTourIds(page: TourPage): Promise<string[]> {
  const buttons = page.locator(AUTO_BUTTONS);
  const total = await buttons.count();
  const ids: string[] = [];
  for (let index = 0; index < total; index += 1) {
    const testId = (await buttons.nth(index).getAttribute('data-testid')) ?? '';
    ids.push(testId.slice(START_PREFIX.length, testId.length - AUTO_SUFFIX.length));
  }
  return ids;
}

function result(tourId: string, state: RunState, reason?: TourRunFailure): TourRunResult {
  if (reason === undefined) return { tourId, passed: true, step: state.step, steps: state.steps };
  return { tourId, passed: false, step: state.step, steps: state.steps, reason, message: tourFailure(tourId, state.step, state.steps, reason) };
}

async function observe(page: TourPage, tourId: string, state: RunState, timeoutMs: number): Promise<TourRunResult | null> {
  const caption = page.locator(CAPTION);
  if ((await caption.count()) === 0) {
    if (!state.seen) return state.sinceChangeMs >= timeoutMs ? result(tourId, state, TourRunFailure.NeverStarted) : null;
    state.gonePolls += 1;
    if (state.gonePolls < GONE_POLLS) return null;
    return state.step === state.steps ? result(tourId, state) : result(tourId, state, TourRunFailure.ClosedEarly);
  }
  state.gonePolls = 0;
  const step = Number(await caption.getAttribute('data-tour-step'));
  state.steps = Number(await caption.getAttribute('data-tour-steps'));
  if (!state.seen || step !== state.step) {
    state.seen = true;
    state.step = step;
    state.sinceChangeMs = 0;
  }
  if ((await page.locator(SKIP).count()) > 0) return result(tourId, state, TourRunFailure.TargetMissing);
  return state.sinceChangeMs >= timeoutMs ? result(tourId, state, TourRunFailure.Stuck) : null;
}

async function playOne(page: TourPage, tourId: string, options: PlayToursOptions): Promise<TourRunResult> {
  const timeoutMs = options.stepTimeoutMs ?? DEFAULT_STEP_TIMEOUT_MS;
  const pollMs = options.pollMs ?? DEFAULT_POLL_MS;
  await showPicker(page, options);
  await page.locator(`[data-testid="${START_PREFIX}${tourId}${AUTO_SUFFIX}"]`).click();
  const state: RunState = { seen: false, step: 0, steps: 0, sinceChangeMs: 0, gonePolls: 0 };
  for (;;) {
    const outcome = await observe(page, tourId, state, timeoutMs);
    if (outcome !== null) return outcome;
    await page.waitForTimeout(pollMs);
    state.sinceChangeMs += pollMs;
  }
}

/** Plays every tour in the picker (or `ids`) in Auto mode, one after another, and reports how far each got. */
export async function playAllToursInAuto(page: TourPage, options: PlayToursOptions = {}): Promise<TourRunResult[]> {
  await showPicker(page, options);
  const ids = options.ids ?? (await listTourIds(page));
  const results: TourRunResult[] = [];
  for (const id of ids) results.push(await playOne(page, id, options));
  return results;
}

/** One-line spec body: plays every tour in Auto and throws `tour <id> step <n>/<m>: <reason>` for each failure. */
export async function expectAllToursPlay(page: TourPage, options: PlayToursOptions = {}): Promise<void> {
  const failures = (await playAllToursInAuto(page, options)).filter((run) => !run.passed).map((run) => run.message ?? run.tourId);
  if (failures.length > 0) throw new Error(`Tours failed in Auto:\n${failures.join('\n')}`);
}
