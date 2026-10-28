import { createContext } from 'react';
import type { ColorValue } from 'react-native';

/** Carry native button foregrounds across the React Native artwork boundary. */
export const IconColorContext = createContext<ColorValue | undefined>(undefined);
