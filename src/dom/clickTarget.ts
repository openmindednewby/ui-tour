import type { Point } from '../types';

const CHECKABLE_SELECTOR = 'input[type="checkbox"],input[type="radio"],[role="switch"],[role="checkbox"],[role="radio"]';

function hitAt(point: Point): Element | null {
  return typeof document.elementFromPoint === 'function' ? document.elementFromPoint(point.x, point.y) : null;
}

/** The element a real pointer press would reach: the hit point inside the target, else its checkable control, else the target. */
export function clickTarget(node: Element, point: Point): Element {
  const hit = hitAt(point);
  if (hit !== null && hit !== node && node.contains(hit)) return hit;
  if (node.matches(CHECKABLE_SELECTOR)) return node;
  return node.querySelector(CHECKABLE_SELECTOR) ?? node;
}
