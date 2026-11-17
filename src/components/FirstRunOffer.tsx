import { useState } from 'react';
import type { ReactElement } from 'react';
import { useTour } from '../context/TourContext';
import { hasSeenOffer, markOfferSeen } from '../engine/firstRunStore';
import { TourMode } from '../enums/TourMode';
import { offerStyle } from './panelStyles';
import { TourButton } from './TourButton';

export interface FirstRunOfferProps {
  tourId?: string;
  mode?: TourMode;
}

/** Dismissible "take a tour" card, shown once per signed-in user; starts `tourId` or opens the picker. */
export function FirstRunOffer({ tourId, mode = TourMode.Guide }: FirstRunOfferProps): ReactElement | null {
  const { user, active, start, openPicker, theme, labels } = useTour();
  const [dismissed, setDismissed] = useState(false);
  if (typeof document === 'undefined' || user === null || active !== null || dismissed || hasSeenOffer(user.id)) return null;
  const close = (): void => {
    markOfferSeen(user.id);
    setDismissed(true);
  };
  const take = (): void => {
    close();
    if (tourId !== undefined) start(tourId, mode);
    else openPicker();
  };
  return (
    <div role="region" aria-label={labels.offerTitle} data-tour-overlay="" data-testid="tour-offer" style={offerStyle(theme)}>
      <strong>{labels.offerTitle}</strong>
      <p style={{ margin: '6px 0 12px', color: theme.muted }}>{labels.offerBody}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <TourButton label={labels.offerStart} onPress={take} theme={theme} testID="tour-offer-start" primary />
        <TourButton label={labels.offerDismiss} onPress={close} theme={theme} testID="tour-offer-dismiss" />
      </div>
    </div>
  );
}
