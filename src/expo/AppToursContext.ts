import { createContext, useContext } from 'react';
import type { AppTourLabelKey } from './labels';

export interface AppToursValue {
  label: (key: AppTourLabelKey) => string;
}

export const AppToursContext = createContext<AppToursValue | null>(null);

/** Returns the kit labels; must be called inside `AppTours`. */
export function useAppTours(): AppToursValue {
  const value = useContext(AppToursContext);
  if (value === null) throw new Error('useAppTours must be used inside AppTours');
  return value;
}
