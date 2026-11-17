import { StepAction } from '../enums/StepAction';
import { StepOutcomeKind } from '../enums/StepOutcomeKind';
import { TourMode } from '../enums/TourMode';
import { isForbiddenClick } from '../dom/forbidden';
import { isToggleControl } from '../dom/clickTarget';
import { centreOf, dispatchClick, typeValue } from '../dom/pointer';
import { accessibleName, substitute } from '../dom/text';
import { waitForTarget } from '../dom/waitForTarget';
import type { Point, TourStep, TourTiming, TourVars } from '../types';

export interface StepRunContext {
  step: TourStep;
  mode: TourMode;
  vars: TourVars;
  timing: TourTiming;
  allowSave: boolean;
  navigate: (route: string) => void;
  getPathname: () => string;
  isCancelled: () => boolean;
  moveCursor: (point: Point) => Promise<void>;
}

export type StepOutcome =
  | { kind: StepOutcomeKind.Ready; node: Element; clicked: boolean }
  | { kind: StepOutcomeKind.Refused; node: Element; name: string }
  | { kind: StepOutcomeKind.Skip }
  | { kind: StepOutcomeKind.Missing }
  | { kind: StepOutcomeKind.Cancelled };

const CANCELLED: StepOutcome = { kind: StepOutcomeKind.Cancelled };

function ready(node: Element, clicked: boolean): StepOutcome {
  return { kind: StepOutcomeKind.Ready, node, clicked };
}

async function perform(context: StepRunContext, node: Element): Promise<StepOutcome> {
  const { step, mode } = context;
  const acts = mode !== TourMode.Guide;
  if (step.action === StepAction.Type) {
    if (acts) await context.moveCursor(centreOf(node));
    await typeValue(node, substitute(step.value ?? '', context.vars), context.timing.typeMs);
    return ready(node, false);
  }
  if (step.action !== StepAction.Click || !acts) return ready(node, false);
  const name = accessibleName(node);
  if (!isToggleControl(node) && isForbiddenClick(name, context.allowSave)) return { kind: StepOutcomeKind.Refused, node, name };
  const point = centreOf(node);
  await context.moveCursor(point);
  if (context.isCancelled()) return CANCELLED;
  dispatchClick(node, point);
  return ready(node, true);
}

export async function runStep(context: StepRunContext): Promise<StepOutcome> {
  const { step } = context;
  if (step.route !== undefined && context.getPathname() !== step.route) context.navigate(step.route);
  const node = await waitForTarget(step.target, context.vars, step.wait ?? context.timing.waitMs, context.isCancelled);
  if (context.isCancelled()) return CANCELLED;
  if (node === null) return { kind: step.optional === true ? StepOutcomeKind.Skip : StepOutcomeKind.Missing };
  if (node instanceof HTMLElement && typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'center' });
  return perform(context, node);
}
