import { act, screen, waitFor } from '@testing-library/react';
import { StepAction } from '../enums/StepAction';
import { TourMode } from '../enums/TourMode';
import { SESSION_KEY } from '../engine/tourSession';
import { renderTour } from './harness';

describe('TourProvider routes and resume', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('with a step on another route, navigates through the app router without a page load', async () => {
    const navigate = jest.fn();
    const harness = renderTour({ navigate });
    act(() => harness.tour().start('payees', TourMode.Guide));

    act(() => harness.tour().next());

    await waitFor(() => expect(navigate.mock.calls).toEqual([['/payees']]));
    expect(window.location.pathname).toBe('/');
  });

  it('when a step advances, stores the tour, step and mode in sessionStorage', () => {
    const harness = renderTour();
    act(() => harness.tour().start('payees', TourMode.Show));

    act(() => harness.tour().next());

    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null')).toEqual({ tourId: 'payees', step: 1, mode: TourMode.Show });
  });

  it('with a stored session after a reload, resumes the same step', async () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ tourId: 'payees', step: 1, mode: TourMode.Guide }));

    renderTour();

    expect(await screen.findByText('This is the payees list')).toBeInTheDocument();
  });

  it('with a stored session for an unknown tour, starts nothing', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ tourId: 'gone', step: 0, mode: TourMode.Guide }));

    renderTour();

    expect(screen.queryByTestId('tour-caption')).toBeNull();
  });

  it('with a vars placeholder in a step route, navigates to the filled route', async () => {
    const navigate = jest.fn();
    const tours = [{ id: 'join', title: 'Join', category: 'Start', steps: [{ route: '/t/{tenantSlug}/register', target: 'open-payees', text: 'Register here', action: StepAction.None }] }];
    const harness = renderTour({ navigate, tours, vars: { tenantSlug: 'demo' } });

    act(() => harness.tour().start('join', TourMode.Guide));

    await waitFor(() => expect(navigate.mock.calls).toEqual([['/t/demo/register']]));
  });
});
