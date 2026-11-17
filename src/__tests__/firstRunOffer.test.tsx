import { act, fireEvent, screen } from '@testing-library/react';
import { hasSeenOffer } from '../engine/firstRunStore';
import { TourMode } from '../enums/TourMode';
import { renderTour } from './harness';

describe('FirstRunOffer', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('with a first-time user, shows the tour offer', () => {
    const user = { id: 'u1' };

    renderTour({ withOffer: true, user });

    expect(screen.getByTestId('tour-offer')).toHaveTextContent('Take a 1-minute tour');
  });

  it('when dismissed, hides and is remembered for that user', () => {
    renderTour({ withOffer: true, user: { id: 'u1' } });

    fireEvent.click(screen.getByTestId('tour-offer-dismiss'));

    expect(screen.queryByTestId('tour-offer')).toBeNull();
    expect(hasSeenOffer('u1')).toBe(true);
  });

  it('with a user who dismissed it before, never shows again', () => {
    const first = renderTour({ withOffer: true, user: { id: 'u1' } });
    fireEvent.click(screen.getByTestId('tour-offer-dismiss'));
    first.unmount();

    renderTour({ withOffer: true, user: { id: 'u1' } });

    expect(screen.queryByTestId('tour-offer')).toBeNull();
  });

  it('when a tour is finished, never shows the offer again', () => {
    const harness = renderTour({ withOffer: true, user: { id: 'u2' } });
    act(() => harness.tour().start('danger', TourMode.Guide));
    act(() => harness.tour().next());

    act(() => harness.tour().next());

    expect(screen.queryByTestId('tour-offer')).toBeNull();
    expect(hasSeenOffer('u2')).toBe(true);
  });

  it('with no signed-in user, shows nothing', () => {
    const user = null;

    renderTour({ withOffer: true, user });

    expect(screen.queryByTestId('tour-offer')).toBeNull();
  });
});
