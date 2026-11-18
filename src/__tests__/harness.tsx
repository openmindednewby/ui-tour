import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { FirstRunOffer } from '../components/FirstRunOffer';
import { TourPicker } from '../components/TourPicker';
import { TourProvider } from '../components/TourProvider';
import { useTour } from '../context/TourContext';
import type { TourContextValue } from '../context/TourContext';
import { StepAction } from '../enums/StepAction';
import { TargetRole } from '../enums/TargetRole';
import type { Tour, TourEvent, TourTheme, TourTiming, TourUser, TourVars } from '../types';

export const testTheme: TourTheme = {
  accent: 'darkorange',
  onAccent: 'black',
  surface: 'black',
  onSurface: 'white',
  muted: 'silver',
  scrim: 'gray',
  divider: 'dimgray',
  radius: 10,
  fontFamily: 'system-ui',
};

export const fastTiming: TourTiming = { autoMs: 40, waitMs: 60, cursorMs: 0, typeMs: 0, guideAdvanceMs: 0 };

export const testTours: Tour[] = [
  {
    id: 'payees',
    title: 'Payees tour',
    category: 'Payments',
    steps: [
      { target: 'open-payees', text: 'Open the payees list', action: StepAction.Click },
      { route: '/payees', target: { role: TargetRole.Heading, name: 'Payees' }, text: 'This is the payees list', action: StepAction.None },
      { target: { role: TargetRole.Field, name: 'Payee name' }, text: 'Type a name', action: StepAction.Type, value: 'Demo Payee' },
    ],
  },
  {
    id: 'danger',
    title: 'Danger tour',
    category: 'Payments',
    steps: [
      { target: { role: TargetRole.Button, name: 'Save' }, text: 'Save it', action: StepAction.Click },
      { target: 'open-payees', text: 'After save', action: StepAction.None },
    ],
  },
  {
    id: 'missing',
    title: 'Missing tour',
    category: 'Reports',
    steps: [
      { target: 'open-payees', text: 'First step', action: StepAction.None },
      { target: 'not-here', text: 'Optional gone', action: StepAction.None, optional: true },
      { target: 'also-not-here', text: 'Required gone', action: StepAction.None },
      { target: 'open-payees', text: 'Last step', action: StepAction.None },
    ],
  },
];

export interface HarnessOptions {
  onPayees?: () => void;
  onSave?: () => void;
  navigate?: (route: string) => void;
  onEvent?: (event: TourEvent) => void;
  user?: TourUser | null;
  withPicker?: boolean;
  withOffer?: boolean;
  tours?: Tour[];
  vars?: TourVars;
}

export interface Harness {
  tour: () => TourContextValue;
  unmount: () => void;
}

interface PageProps {
  onPayees?: () => void;
  onSave?: () => void;
}

function Page({ onPayees, onSave }: PageProps): ReactElement {
  return (
    <main>
      <button type="button" data-testid="open-payees" onClick={onPayees}>Payees</button>
      <h2>Payees</h2>
      <label htmlFor="payee-name">Payee name</label>
      <input id="payee-name" defaultValue="" />
      <button type="button" onClick={onSave}>Save</button>
    </main>
  );
}

const ignoreRoute = (_route: string): void => undefined;
const rootPath = (): string => '/';

export function renderTour(options: HarnessOptions = {}): Harness {
  let captured: TourContextValue | null = null;
  function Capture(): null {
    captured = useTour();
    return null;
  }
  const view = render(
    <TourProvider
      tours={options.tours ?? testTours}
      vars={options.vars}
      navigate={options.navigate ?? ignoreRoute}
      getPathname={rootPath}
      theme={testTheme}
      timing={fastTiming}
      onEvent={options.onEvent}
      user={options.user ?? null}
    >
      <Page onPayees={options.onPayees} onSave={options.onSave} />
      <Capture />
      {options.withPicker === true ? <TourPicker /> : null}
      {options.withOffer === true ? <FirstRunOffer /> : null}
    </TourProvider>,
  );
  return {
    tour: () => {
      if (captured === null) throw new Error('TourProvider not mounted');
      return captured;
    },
    unmount: view.unmount,
  };
}

export const pause = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
