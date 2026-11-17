import { TargetRole } from '../enums/TargetRole';
import type { RoleTarget, StepTarget, TourVars } from '../types';
import { accessibleName, escapeQuotes, fieldLabel, matchesName, normalise, substitute } from './text';

const OVERLAY_SELECTOR = '[data-tour-overlay]';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE']);

const ROLE_SELECTORS: Record<TargetRole, string> = {
  [TargetRole.Button]: 'button,[role="button"],a[href],[role="link"]',
  [TargetRole.Heading]: 'h1,h2,h3,h4,h5,h6,[role="heading"]',
  [TargetRole.Group]: '[role="group"]',
  [TargetRole.Field]: 'input,textarea,[role="textbox"]',
  [TargetRole.Text]: '*',
};

export function isVisible(node: Element): boolean {
  const rect = node.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return false;
  const style = window.getComputedStyle(node);
  return style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';
}

function usable(node: Element): boolean {
  return node.closest(OVERLAY_SELECTOR) === null && isVisible(node);
}

function findText(root: Element, want: string | RegExp): Element | null {
  let best: Element | null = null;
  for (const node of Array.from(root.querySelectorAll('*'))) {
    if (SKIP_TAGS.has(node.tagName) || !usable(node)) continue;
    if (!matchesName(normalise(node.textContent), want, false)) continue;
    if (best === null || best.contains(node)) best = node;
  }
  return best;
}

function findByRole(root: Element, target: RoleTarget, want: string | RegExp): Element | null {
  const label = target.role === TargetRole.Field ? fieldLabel : accessibleName;
  let skip = target.nth ?? 0;
  for (const node of Array.from(root.querySelectorAll(ROLE_SELECTORS[target.role]))) {
    if (!usable(node) || !matchesName(label(node), want, target.exact)) continue;
    if (skip === 0) return node;
    skip -= 1;
  }
  return null;
}

/** Finds the first visible element for a step target: a testID string or a role and accessible name. */
export function findTarget(target: StepTarget, vars: TourVars = {}): Element | null {
  if (typeof target === 'string') {
    const nodes = Array.from(document.querySelectorAll(`[data-testid="${escapeQuotes(target)}"]`));
    return nodes.find(usable) ?? null;
  }
  const root = target.within !== undefined ? document.querySelector(target.within) : document.body;
  if (root === null) return null;
  const want = typeof target.name === 'string' ? substitute(target.name, vars) : target.name;
  return target.role === TargetRole.Text ? findText(root, want) : findByRole(root, target, want);
}
