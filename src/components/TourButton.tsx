import type { ReactElement, Ref } from 'react';
import type { TourTheme } from '../types';
import { buttonStyle } from './styles';

export interface TourButtonProps {
  label: string;
  onPress: () => void;
  theme: TourTheme;
  testID: string;
  primary?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
}

export function TourButton({ label, onPress, theme, testID, primary = false, buttonRef }: TourButtonProps): ReactElement {
  return (
    <button
      type="button"
      ref={buttonRef}
      data-testid={testID}
      aria-label={label}
      style={buttonStyle(theme, primary)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPress();
      }}
    >
      {label}
    </button>
  );
}
