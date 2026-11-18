import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';
import { fontStack, useTour } from '@dloizides/ui-tour';
import { useAppTours } from './AppToursContext';

export interface TourButtonProps {
  testID?: string;
}

const MIN_HIT = 44;
const PADDING = 12;

/** "Take a tour" button for the shell help slot; opens the tour picker (F2 does the same). */
export function TourButton({ testID = 'take-tour' }: TourButtonProps): ReactElement {
  const { openPicker, theme } = useTour();
  const { label } = useAppTours();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label('takeTour')}
      accessibilityHint={label('takeTourHint')}
      onPress={openPicker}
      style={{ minHeight: MIN_HIT, minWidth: MIN_HIT, paddingHorizontal: PADDING, justifyContent: 'center', borderWidth: 1, borderColor: theme.divider, borderRadius: theme.radius }}
    >
      <Text style={{ color: theme.onSurface, fontFamily: fontStack(theme.fontFamily) }}>{label('takeTour')}</Text>
    </Pressable>
  );
}
