import type { StepAction } from './enums/StepAction';
import type { StepPhase } from './enums/StepPhase';
import type { TargetRole } from './enums/TargetRole';
import type { TourEventType } from './enums/TourEventType';
import type { TourMode } from './enums/TourMode';

export interface RoleTarget {
  role: TargetRole;
  name: string | RegExp;
  nth?: number;
  exact?: boolean;
  within?: string;
}

export type StepTarget = string | RoleTarget;

export interface TourStep {
  route?: string;
  target: StepTarget;
  text: string;
  action: StepAction;
  value?: string;
  optional?: boolean;
  wait?: number;
}

export interface Tour {
  id: string;
  title: string;
  category: string;
  persona?: string;
  allowSave?: boolean;
  steps: TourStep[];
}

export interface TourEvent {
  type: TourEventType;
  tourId: string;
  mode: TourMode;
  skipped?: number;
}

export interface TourUser {
  id: string;
}

export type TourVars = Record<string, string | undefined>;

export interface TourTheme {
  accent: string;
  onAccent: string;
  accentText?: string;
  surface: string;
  onSurface: string;
  muted: string;
  scrim: string;
  divider: string;
  radius: number;
  fontFamily: string;
}

export interface TourTiming {
  autoMs: number;
  waitMs: number;
  cursorMs: number;
  typeMs: number;
  guideAdvanceMs: number;
}

export interface ActiveTour {
  tourId: string;
  step: number;
  mode: TourMode;
}

export interface Point {
  x: number;
  y: number;
}

export interface TargetRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface StepView {
  phase: StepPhase;
  rect: TargetRect | null;
  refusedName: string;
}
