export enum TourRunFailure {
  NeverStarted = 'never started',
  TargetMissing = 'target missing',
  Stuck = 'stuck',
  ClosedEarly = 'closed early',
}

/** Formats one failed tour as `tour <id> step <n>/<m>: <reason>`. */
export function tourFailure(tourId: string, step: number, steps: number, reason: TourRunFailure): string {
  return `tour ${tourId} step ${step}/${steps}: ${reason}`;
}
