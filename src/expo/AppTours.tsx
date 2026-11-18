import { useCallback, useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { FirstRunOffer, TourPicker, TourProvider } from '@dloizides/ui-tour';
import type { Tour, TourEvent, TourUser, TourVars } from '@dloizides/ui-tour';
import { AppToursContext } from './AppToursContext';
import type { AppToursValue } from './AppToursContext';
import { buildTourLabels, DEFAULT_LABEL_PREFIX, defaultAppTourLabels, localizeTours, translateOr } from './labels';
import type { AppTourLabelKey, Translate } from './labels';
import { toTourTheme } from './toTourTheme';
import type { AppThemeSource } from './toTourTheme';
import { trackTourEvent } from './trackTourEvent';

export interface AppToursProps {
  tours: readonly Tour[];
  translate: Translate;
  theme: AppThemeSource;
  dark?: boolean;
  user?: TourUser | null;
  vars?: TourVars;
  navigate?: (route: string) => void;
  labelPrefix?: string;
  allowWrites?: boolean;
  onEvent?: (event: TourEvent) => void;
  children?: ReactNode;
}

/** One-line tour setup for an Expo Router app: router, theme, translated labels, Umami events, picker and first-run card. */
export function AppTours(props: AppToursProps): ReactElement {
  const router = useRouter();
  const { translate, onEvent: extraEvent } = props;
  const prefix = props.labelPrefix ?? DEFAULT_LABEL_PREFIX;
  const navigate = props.navigate ?? router.push;
  const tours = useMemo(() => localizeTours(props.tours, translate), [props.tours, translate]);
  const labels = useMemo(() => buildTourLabels(translate, prefix), [translate, prefix]);
  const theme = useMemo(() => toTourTheme(props.theme, props.dark), [props.theme, props.dark]);
  const onEvent = useCallback((event: TourEvent) => {
    trackTourEvent(event);
    extraEvent?.(event);
  }, [extraEvent]);
  const appValue = useMemo<AppToursValue>(() => ({
    label: (key: AppTourLabelKey) => translateOr(translate, `${prefix}.${key}`, defaultAppTourLabels[key]),
  }), [translate, prefix]);
  return (
    <AppToursContext.Provider value={appValue}>
      <TourProvider tours={tours} navigate={navigate} theme={theme} labels={labels} user={props.user} vars={props.vars} allowWrites={props.allowWrites} onEvent={onEvent}>
        {props.children}
        <TourPicker />
        <FirstRunOffer />
      </TourProvider>
    </AppToursContext.Provider>
  );
}
