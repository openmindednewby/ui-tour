import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { TourMode } from '../enums/TourMode';
import { pause, renderTour } from './harness';

describe('TourProvider in show and auto mode', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('in show mode on a click step, moves the cursor, clicks the target and waits on the step', async () => {
    const onPayees = jest.fn();
    const harness = renderTour({ onPayees });

    act(() => harness.tour().start('payees', TourMode.Show));

    await waitFor(() => expect(onPayees).toHaveBeenCalledTimes(1));
    await act(() => pause(120));
    expect(screen.getByTestId('tour-text')).toHaveTextContent('Open the payees list');
    expect(screen.getByTestId('tour-cursor')).toBeInTheDocument();
  });

  it('in show mode on a type step, types the value into the field', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('payees', TourMode.Show));

    act(() => {
      harness.tour().next();
      harness.tour().next();
    });

    await waitFor(() => expect(screen.getByLabelText('Payee name')).toHaveValue('Demo Payee'));
  });

  it('in auto mode, advances to the next step by itself', async () => {
    const harness = renderTour();

    act(() => harness.tour().start('payees', TourMode.Auto));

    expect(await screen.findByText('This is the payees list')).toBeInTheDocument();
  });

  it('in auto mode when Space is pressed, stays paused on the step', async () => {
    const harness = renderTour();
    act(() => harness.tour().start('payees', TourMode.Auto));

    fireEvent.keyDown(window, { key: ' ' });

    await act(() => pause(200));
    expect(screen.getByTestId('tour-text')).toHaveTextContent('Open the payees list');
  });

  it('in show mode on a Save button, does not click it and reports the refusal', async () => {
    const onSave = jest.fn();
    const harness = renderTour({ onSave });

    act(() => harness.tour().start('danger', TourMode.Show));

    expect(await screen.findByTestId('tour-note')).toHaveTextContent('never clicks "Save"');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('in auto mode on a Save button, skips past it without clicking', async () => {
    const onSave = jest.fn();
    const harness = renderTour({ onSave });

    act(() => harness.tour().start('danger', TourMode.Auto));

    expect(await screen.findByText('After save')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
