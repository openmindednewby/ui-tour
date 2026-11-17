import { act, fireEvent, screen } from '@testing-library/react';
import { TourEventType } from '../enums/TourEventType';
import { TourMode } from '../enums/TourMode';
import { renderTour } from './harness';

describe('TourPicker', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('when F2 is pressed, opens the picker with focus on the first tour', () => {
    renderTour({ withPicker: true });

    fireEvent.keyDown(window, { key: 'F2' });

    expect(screen.getByTestId('tour-picker')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId('tour-start-payees-guide'));
  });

  it('with tours in two categories, groups them with counts and opens only the first group', () => {
    const harness = renderTour({ withPicker: true });

    act(() => harness.tour().openPicker());

    expect(screen.getByTestId('tour-group-Payments')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('tour-group-Payments')).toHaveTextContent('Payments (2)');
    expect(screen.getByTestId('tour-group-Reports')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('tour-start-missing-guide')).toBeNull();
  });

  it('when a collapsed group is toggled, shows its tours with step counts', () => {
    const harness = renderTour({ withPicker: true });
    act(() => harness.tour().openPicker());

    fireEvent.click(screen.getByTestId('tour-group-Reports'));

    expect(screen.getByTestId('tour-start-missing-auto')).toBeInTheDocument();
    expect(screen.getByTestId('tour-row-missing')).toHaveTextContent('4 steps');
  });

  it('when Show me is pressed on a tour, starts it in show mode and closes the picker', () => {
    const onEvent = jest.fn();
    const harness = renderTour({ withPicker: true, onEvent });
    act(() => harness.tour().openPicker());

    fireEvent.click(screen.getByTestId('tour-start-danger-show'));

    expect(onEvent).toHaveBeenCalledWith({ type: TourEventType.Start, tourId: 'danger', mode: TourMode.Show });
    expect(screen.queryByTestId('tour-picker')).toBeNull();
  });

  it('when Escape is pressed in the open picker, closes it', () => {
    const harness = renderTour({ withPicker: true });
    act(() => harness.tour().openPicker());

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByTestId('tour-picker')).toBeNull();
  });
});
