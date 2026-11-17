import { act, fireEvent, screen } from '@testing-library/react';
import { TourEventType } from '../enums/TourEventType';
import { TourMode } from '../enums/TourMode';
import { renderTour } from './harness';

describe('TourProvider in guide mode', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('with a started tour, rings the target and captions the step', async () => {
    const harness = renderTour();

    act(() => harness.tour().start('payees', TourMode.Guide));

    expect(await screen.findByTestId('tour-ring')).toBeInTheDocument();
    expect(screen.getByTestId('tour-text')).toHaveTextContent('Open the payees list');
  });

  it('with no target ringed yet, dims the whole page', () => {
    const harness = renderTour();

    act(() => harness.tour().start('payees', TourMode.Guide));

    expect(screen.getByTestId('tour-scrim')).toBeInTheDocument();
  });

  it('when Next is pressed, advances to the next step', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('payees', TourMode.Guide));
    await screen.findByTestId('tour-ring');

    fireEvent.click(screen.getByTestId('tour-next'));

    expect(await screen.findByText('This is the payees list')).toBeInTheDocument();
  });

  it('when the ringed target is clicked, the app gets the click and the tour advances', async () => {
    const onPayees = jest.fn();
    const harness = renderTour({ onPayees });
    act(() => harness.tour().start('payees', TourMode.Guide));
    await screen.findByTestId('tour-ring');

    fireEvent.click(screen.getByTestId('open-payees'));

    expect(await screen.findByText('This is the payees list')).toBeInTheDocument();
    expect(onPayees).toHaveBeenCalledTimes(1);
  });

  it('when ArrowLeft is pressed on step two, goes back to step one', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('payees', TourMode.Guide));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await screen.findByText('This is the payees list');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(await screen.findByText('Open the payees list')).toBeInTheDocument();
  });

  it('when Escape is pressed, ends the tour and emits tour_quit', async () => {
    const onEvent = jest.fn();
    const harness = renderTour({ onEvent });
    act(() => harness.tour().start('payees', TourMode.Guide));
    await screen.findByTestId('tour-ring');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByTestId('tour-caption')).toBeNull();
    expect(onEvent).toHaveBeenLastCalledWith({ type: TourEventType.Quit, tourId: 'payees', mode: TourMode.Guide });
  });
});
