import { useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Platform } from 'react-native';
import { DEFAULT_TIMING } from '../constants';
import { TourContext } from '../context/TourContext';
import { inertTour } from '../engine/inertTour';
import { useTourEngine } from '../hooks/useTourEngine';
import type { TourLabels } from '../labels';
import type { Tour, TourEvent, TourTheme, TourTiming, TourUser, TourVars } from '../types';
import { TourOverlay } from './TourOverlay';

export interface TourProviderProps {
  tours: readonly Tour[];
  navigate: (route: string) => void;
  theme: TourTheme;
  onEvent?: (event: TourEvent) => void;
  user?: TourUser | null;
  labels?: Partial<TourLabels>;
  allowWrites?: boolean;
  vars?: TourVars;
  timing?: Partial<TourTiming>;
  getPathname?: () => string;
  children?: ReactNode;
}

const NO_VARS: TourVars = {};

function currentPathname(): string {
  return typeof window === 'undefined' ? '' : window.location.pathname;
}

function WebTourProvider(props: TourProviderProps): ReactElement {
  const timing = useMemo(() => ({ ...DEFAULT_TIMING, ...props.timing }), [props.timing]);
  const value = useTourEngine({
    tours: props.tours,
    navigate: props.navigate,
    getPathname: props.getPathname ?? currentPathname,
    onEvent: props.onEvent,
    user: props.user ?? null,
    allowWrites: props.allowWrites === true,
    vars: props.vars ?? NO_VARS,
    timing,
    theme: props.theme,
    labels: props.labels,
  });
  return (
    <TourContext.Provider value={value}>
      {props.children}
      <TourOverlay />
    </TourContext.Provider>
  );
}

function NativeTourProvider({ tours, theme, labels, children }: TourProviderProps): ReactElement {
  const value = useMemo(() => inertTour(tours, theme, labels), [tours, theme, labels]);
  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

/** Runs guided tours over the app (web only); on native it renders children and the tour API does nothing. */
export function TourProvider(props: TourProviderProps): ReactElement {
  return Platform.OS === 'web' ? <WebTourProvider {...props} /> : <NativeTourProvider {...props} />;
}
