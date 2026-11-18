import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { placeCaption } from '../dom/placement';
import type { Position } from '../dom/placement';
import { substitute } from '../dom/text';
import { tourOf } from '../engine/stepEffects';
import { StepAction } from '../enums/StepAction';
import { StepPhase } from '../enums/StepPhase';
import { TourMode } from '../enums/TourMode';
import { useTour } from '../context/TourContext';
import type { TourContextValue } from '../context/TourContext';
import { formatLabel } from '../labels';
import type { TourStep } from '../types';
import { captionStyle, metaStyle, noteStyle, rowStyle } from './styles';
import { TourButton } from './TourButton';

const START: Position = { left: 12, top: 12 };

function modeName(tour: TourContextValue, mode: TourMode): string {
  if (mode === TourMode.Auto) return tour.labels.modeAuto;
  return mode === TourMode.Show ? tour.labels.modeShow : tour.labels.modeGuide;
}

function hintFor(tour: TourContextValue, mode: TourMode, step: TourStep): string {
  if (mode === TourMode.Auto) return tour.paused ? tour.labels.paused : tour.labels.autoPlaying;
  return mode === TourMode.Guide && step.action === StepAction.Click ? tour.labels.guideHint : tour.labels.continueHint;
}

function noteFor(tour: TourContextValue): string {
  if (tour.view.phase === StepPhase.Missing) return tour.labels.unavailable;
  return tour.view.phase === StepPhase.Refused ? formatLabel(tour.labels.refused, tour.view.refusedName) : '';
}

export function TourCaption(): ReactElement | null {
  const tour = useTour();
  const { active, view, theme, labels } = tour;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>(START);
  const stepIndex = active?.step ?? -1;
  useLayoutEffect(() => {
    const node = ref.current;
    if (node === null) return;
    setPosition(placeCaption(view.rect, { width: node.offsetWidth, height: node.offsetHeight }, { width: window.innerWidth, height: window.innerHeight }));
  }, [view.rect, stepIndex]);
  const current = tourOf(tour.tours, active);
  const step = current?.steps[stepIndex];
  if (active === null || current === null || step === undefined) return null;
  const missing = view.phase === StepPhase.Missing;
  const note = noteFor(tour);
  return (
    <div ref={ref} role="dialog" aria-live="polite" aria-label={current.title} data-testid="tour-caption" data-tour-id={current.id} data-tour-step={stepIndex + 1} data-tour-steps={current.steps.length} style={captionStyle(theme, position)}>
      <div style={metaStyle(theme)}>{formatLabel(labels.captionMeta, current.title, stepIndex + 1, current.steps.length, modeName(tour, active.mode))}</div>
      <div data-testid="tour-text">{substitute(step.text, tour.vars)}</div>
      {note !== '' ? <div data-testid="tour-note" style={noteStyle(theme)}>{note}</div> : null}
      <div style={rowStyle(theme)}>
        <TourButton label={labels.back} onPress={tour.back} theme={theme} testID="tour-back" />
        <TourButton label={missing ? labels.skip : labels.next} onPress={tour.next} theme={theme} testID={missing ? 'tour-skip' : 'tour-next'} primary />
        <TourButton label={labels.end} onPress={tour.end} theme={theme} testID="tour-end" />
        <span>{hintFor(tour, active.mode, step)}</span>
      </div>
    </div>
  );
}
