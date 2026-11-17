import type { TargetRect } from '../types';

const GAP = 16;
const EDGE = 12;
const BOTTOM = 24;

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  left: number;
  top: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(min, value), max);
}

export function placeCaption(rect: TargetRect | null, size: Size, viewport: Size): Position {
  if (rect === null) return { left: (viewport.width - size.width) / 2, top: viewport.height - size.height - BOTTOM };
  const left = clamp(rect.left + rect.width / 2 - size.width / 2, EDGE, viewport.width - size.width - EDGE);
  const bottom = rect.top + rect.height;
  if (bottom + GAP + size.height < viewport.height) return { left, top: bottom + GAP };
  const above = rect.top - size.height - GAP;
  return { left, top: above > 0 ? above : viewport.height - size.height - EDGE };
}
