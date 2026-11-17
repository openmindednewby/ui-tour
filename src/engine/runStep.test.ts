import { DEFAULT_TIMING } from '../constants';
import { StepAction } from '../enums/StepAction';
import { StepOutcomeKind } from '../enums/StepOutcomeKind';
import { TargetRole } from '../enums/TargetRole';
import { TourMode } from '../enums/TourMode';
import type { TourStep } from '../types';
import { runStep } from './runStep';
import type { StepRunContext } from './runStep';

const contextFor = (step: TourStep, over: Partial<StepRunContext> = {}): StepRunContext => ({
  step,
  mode: TourMode.Show,
  vars: {},
  timing: { ...DEFAULT_TIMING, waitMs: 60, cursorMs: 0, typeMs: 0 },
  allowSave: false,
  navigate: jest.fn(),
  getPathname: () => '/',
  isCancelled: () => false,
  moveCursor: jest.fn().mockResolvedValue(undefined),
  ...over,
});

const saveStep: TourStep = { target: { role: TargetRole.Button, name: 'Save' }, text: 'Save', action: StepAction.Click };

describe('runStep', () => {
  let onClick: jest.Mock;
  beforeEach(() => {
    onClick = jest.fn();
    document.body.innerHTML = '<button>Save</button>';
    document.querySelector('button')?.addEventListener('click', onClick);
  });

  it('in show mode on a Save button, refuses the click and reports it', async () => {
    const context = contextFor(saveStep);

    const outcome = await runStep(context);

    expect({ kind: outcome.kind, clicks: onClick.mock.calls.length }).toEqual({ kind: StepOutcomeKind.Refused, clicks: 0 });
  });

  it('in auto mode with allowSave on a Save button, clicks it', async () => {
    const context = contextFor(saveStep, { mode: TourMode.Auto, allowSave: true });

    const outcome = await runStep(context);

    expect({ kind: outcome.kind, clicks: onClick.mock.calls.length }).toEqual({ kind: StepOutcomeKind.Ready, clicks: 1 });
  });

  it('in guide mode on a click step, never clicks for the user', async () => {
    const context = contextFor(saveStep, { mode: TourMode.Guide, allowSave: true });

    const outcome = await runStep(context);

    expect({ kind: outcome.kind, clicks: onClick.mock.calls.length }).toEqual({ kind: StepOutcomeKind.Ready, clicks: 0 });
  });

  it('with a target that appears within the wait, returns ready', async () => {
    setTimeout(() => document.body.insertAdjacentHTML('beforeend', '<div data-testid="late">Late</div>'), 20);
    const context = contextFor({ target: 'late', text: 'Late', action: StepAction.None });

    const outcome = await runStep(context);

    expect(outcome.kind).toBe(StepOutcomeKind.Ready);
  });

  it('with a required target that never appears, returns missing after the wait', async () => {
    const context = contextFor({ target: 'never', text: 'Never', action: StepAction.None });

    const outcome = await runStep(context);

    expect(outcome.kind).toBe(StepOutcomeKind.Missing);
  });

  it('with an optional target that never appears, returns skip', async () => {
    const context = contextFor({ target: 'never', text: 'Never', action: StepAction.None, optional: true });

    const outcome = await runStep(context);

    expect(outcome.kind).toBe(StepOutcomeKind.Skip);
  });

  it('with a route other than the current path, navigates through the app router', async () => {
    const navigate = jest.fn();
    const context = contextFor({ route: '/payees', target: 'never', text: 'x', action: StepAction.None, optional: true }, { navigate });

    await runStep(context);

    expect(navigate.mock.calls).toEqual([['/payees']]);
  });

  it('with the default timing, waits 8 seconds for a missing target', () => {
    const timing = DEFAULT_TIMING;

    const waitMs = timing.waitMs;

    expect(waitMs).toBe(8000);
  });
});
