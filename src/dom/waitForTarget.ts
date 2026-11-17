import type { StepTarget, TourVars } from '../types';
import { findTarget } from './findTarget';

const POLL_MS = 200;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForTarget(
  target: StepTarget,
  vars: TourVars,
  timeoutMs: number,
  isCancelled: () => boolean,
): Promise<Element | null> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const node = findTarget(target, vars);
    const remaining = deadline - Date.now();
    if (node !== null || isCancelled() || remaining <= 0) return node;
    await sleep(Math.min(POLL_MS, remaining));
  }
}
