import type { TourVars } from '../types';

const WHITESPACE = /\s+/g;
const VARIABLE = /\{(\w+)\}/g;
const QUOTE_OR_SLASH = /["\\]/g;

export function normalise(value: string | null | undefined): string {
  return (value ?? '').replace(WHITESPACE, ' ').trim();
}

export function substitute(text: string, vars: TourVars): string {
  return text.replace(VARIABLE, (match: string, key: string) => vars[key] ?? match);
}

export function escapeQuotes(value: string): string {
  return value.replace(QUOTE_OR_SLASH, '\\$&');
}

function nonEmpty(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim() !== '';
}

export function accessibleName(node: Element): string {
  const label = node.getAttribute('aria-label');
  return normalise(nonEmpty(label) ? label : node.textContent);
}

function labelFor(node: Element): string | null {
  if (node.id === '') return null;
  return document.querySelector(`label[for="${escapeQuotes(node.id)}"]`)?.textContent ?? null;
}

function labelledBy(node: Element): string | null {
  const id = node.getAttribute('aria-labelledby');
  if (!nonEmpty(id)) return null;
  return document.getElementById(id)?.textContent ?? null;
}

export function fieldLabel(node: Element): string {
  const candidates = [node.getAttribute('aria-label'), labelFor(node), labelledBy(node), node.getAttribute('placeholder')];
  return normalise(candidates.find(nonEmpty));
}

export function matchesName(value: string, want: string | RegExp, exact: boolean | undefined): boolean {
  if (want instanceof RegExp) return want.test(value);
  return exact === false ? value.includes(want) : value === want;
}
