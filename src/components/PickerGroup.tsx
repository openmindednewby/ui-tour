import type { ReactElement, Ref } from 'react';
import { useTour } from '../context/TourContext';
import { TourMode } from '../enums/TourMode';
import { formatLabel } from '../labels';
import type { Tour } from '../types';
import { groupButtonStyle, mutedStyle, tourRowStyle } from './panelStyles';
import { TourButton } from './TourButton';

export interface TourGroup {
  category: string;
  tours: Tour[];
}

export function groupTours(tours: readonly Tour[]): TourGroup[] {
  const groups: TourGroup[] = [];
  for (const tour of tours) {
    const group = groups.find((candidate) => candidate.category === tour.category);
    if (group !== undefined) group.tours.push(tour);
    else groups.push({ category: tour.category, tours: [tour] });
  }
  return groups;
}

interface PickerRowProps {
  tour: Tour;
  firstButtonRef?: Ref<HTMLButtonElement>;
}

function PickerRow({ tour, firstButtonRef }: PickerRowProps): ReactElement {
  const { theme, labels, start } = useTour();
  return (
    <div data-testid={`tour-row-${tour.id}`} style={tourRowStyle(theme)}>
      <span style={{ flex: '1 1 160px' }}>
        <strong>{tour.title}</strong>
        <br />
        <small style={mutedStyle(theme)}>{formatLabel(labels.stepCount, tour.steps.length)}</small>
      </span>
      <TourButton label={labels.guideMe} onPress={() => start(tour.id, TourMode.Guide)} theme={theme} testID={`tour-start-${tour.id}-guide`} buttonRef={firstButtonRef} primary />
      <TourButton label={labels.showMe} onPress={() => start(tour.id, TourMode.Show)} theme={theme} testID={`tour-start-${tour.id}-show`} />
      <TourButton label={labels.auto} onPress={() => start(tour.id, TourMode.Auto)} theme={theme} testID={`tour-start-${tour.id}-auto`} />
    </div>
  );
}

export interface PickerGroupProps {
  group: TourGroup;
  expanded: boolean;
  onToggle: () => void;
  firstButtonRef?: Ref<HTMLButtonElement>;
}

export function PickerGroup({ group, expanded, onToggle, firstButtonRef }: PickerGroupProps): ReactElement {
  const { theme, labels } = useTour();
  return (
    <section>
      <button type="button" aria-expanded={expanded} data-testid={`tour-group-${group.category}`} style={groupButtonStyle(theme)} onClick={onToggle}>
        {formatLabel(labels.groupTitle, group.category, group.tours.length)}
      </button>
      {expanded ? group.tours.map((tour, index) => <PickerRow key={tour.id} tour={tour} firstButtonRef={index === 0 ? firstButtonRef : undefined} />) : null}
    </section>
  );
}
