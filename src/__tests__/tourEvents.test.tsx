import { act, screen } from '@testing-library/react';
import { TourEventType } from '../enums/TourEventType';
import { TourMode } from '../enums/TourMode';
import { renderTour } from './harness';

describe('TourProvider onEvent', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('when a tour starts, emits tour_start with only the tour id and mode', () => {
    const onEvent = jest.fn();
    const harness = renderTour({ onEvent, user: { id: 'u1' } });

    act(() => harness.tour().start('payees', TourMode.Show));

    expect(onEvent.mock.calls).toEqual([[{ type: TourEventType.Start, tourId: 'payees', mode: TourMode.Show }]]);
  });

  it('when the last step is passed, emits tour_finish', () => {
    const onEvent = jest.fn();
    const harness = renderTour({ onEvent });
    act(() => harness.tour().start('danger', TourMode.Guide));
    act(() => harness.tour().next());

    act(() => harness.tour().next());

    expect(onEvent).toHaveBeenLastCalledWith({ type: TourEventType.Finish, tourId: 'danger', mode: TourMode.Guide, skipped: 0 });
  });

  it('with any event, carries exactly the type, tour id and mode keys', () => {
    const onEvent = jest.fn();
    const harness = renderTour({ onEvent, user: { id: 'person@example.com' } });

    act(() => harness.tour().start('payees', TourMode.Auto));

    expect(Object.keys(onEvent.mock.calls[0][0]).sort()).toEqual(['mode', 'tourId', 'type']);
  });

  it('when an optional step was skipped, tour_finish carries the skipped count', async () => {
    const onEvent = jest.fn();
    const harness = renderTour({ onEvent });
    act(() => harness.tour().start('missing', TourMode.Guide));
    act(() => harness.tour().next());
    await screen.findByTestId('tour-skip');
    act(() => harness.tour().next());

    act(() => harness.tour().next());

    expect(onEvent).toHaveBeenLastCalledWith({ type: TourEventType.Finish, tourId: 'missing', mode: TourMode.Guide, skipped: 1 });
  });

  it('when an optional step was skipped, the caption shows the skipped count', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('missing', TourMode.Guide));

    act(() => harness.tour().next());

    expect(await screen.findByTestId('tour-skip')).toBeInTheDocument();
    expect(screen.getByTestId('tour-caption')).toHaveAttribute('data-tour-skipped', '1');
  });
});
