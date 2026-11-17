import { act, fireEvent, screen } from '@testing-library/react';
import { TourMode } from '../enums/TourMode';
import { renderTour } from './harness';

describe('TourProvider with a missing target', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('with an optional missing target, skips to the next step', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('missing', TourMode.Guide));

    act(() => harness.tour().next());

    expect(await screen.findByText('Required gone')).toBeInTheDocument();
  });

  it('with a required missing target, shows the unavailable note with Skip and End', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('missing', TourMode.Guide));

    act(() => harness.tour().next());

    expect(await screen.findByTestId('tour-note')).toHaveTextContent("This step isn't available here");
    expect(screen.getByTestId('tour-skip')).toBeInTheDocument();
    expect(screen.getByTestId('tour-end')).toBeInTheDocument();
  });

  it('when Skip is pressed on a missing step, moves on to the next step', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('missing', TourMode.Guide));
    act(() => harness.tour().next());
    await screen.findByTestId('tour-skip');

    fireEvent.click(screen.getByTestId('tour-skip'));

    expect(await screen.findByText('Last step')).toBeInTheDocument();
  });
});
