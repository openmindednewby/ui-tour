import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StepAction, TourEventType, TourMode } from '@dloizides/ui-tour';
import { AppTours } from './AppTours';
import { TourButton } from './TourButton';
import type { AppThemeSource } from './toTourTheme';

const { routerPush } = jest.requireActual<{ routerPush: jest.Mock }>('expo-router');

const theme: AppThemeSource = {
  colors: { background: 'ivory', surface: 'white', text: 'black', textSecondary: 'gray', border: 'silver' },
  palette: { primary: { '600': 'blue' } },
};
const dictionary: Record<string, string | undefined> = {
  'tours.labels.takeTour': 'Tour starten',
  'tours.payees.title': 'Payees tour',
};
const translate = (key: string): string => dictionary[key] ?? key;
const tours = [{ id: 'payees', title: 'tours.payees.title', category: 'Payments', steps: [{ route: '/payees', target: 'open-payees', text: 'Open it', action: StepAction.None, optional: true }] }];

interface UmamiWindow {
  umami?: { track: jest.Mock };
}

function renderKit(navigate?: (route: string) => void): void {
  render(
    <AppTours tours={tours} translate={translate} theme={theme} navigate={navigate}>
      <TourButton />
    </AppTours>,
  );
}

describe('AppTours', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    routerPush.mockClear();
    (window as unknown as UmamiWindow).umami = { track: jest.fn() };
  });

  it('with a translated takeTour key, labels the button from the translate function', () => {
    renderKit();

    const button = screen.getByTestId('take-tour');

    expect(button).toHaveTextContent('Tour starten');
  });

  it('when the button is pressed, opens the picker with translated tour titles', () => {
    renderKit();

    fireEvent.click(screen.getByTestId('take-tour'));

    expect(screen.getByTestId('tour-picker')).toHaveTextContent('Payees tour');
  });

  it('when a step has a route and no navigate override, navigates through expo-router', async () => {
    renderKit();
    fireEvent.click(screen.getByTestId('take-tour'));

    act(() => fireEvent.click(screen.getByTestId('tour-start-payees-guide')));

    await waitFor(() => expect(routerPush).toHaveBeenCalledWith('/payees'));
  });

  it('with a navigate override, uses it instead of expo-router', async () => {
    const navigate = jest.fn();
    renderKit(navigate);
    fireEvent.click(screen.getByTestId('take-tour'));

    act(() => fireEvent.click(screen.getByTestId('tour-start-payees-guide')));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/payees'));
    expect(routerPush).not.toHaveBeenCalled();
  });

  it('when a tour starts, sends tour_start to Umami with only the id and mode', () => {
    renderKit();
    fireEvent.click(screen.getByTestId('take-tour'));

    act(() => fireEvent.click(screen.getByTestId('tour-start-payees-show')));

    expect((window as unknown as UmamiWindow).umami?.track.mock.calls).toEqual([[TourEventType.Start, { tourId: 'payees', mode: TourMode.Show }]]);
  });
});
