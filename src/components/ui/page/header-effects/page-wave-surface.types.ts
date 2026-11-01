import type { RefObject } from 'react';
import type { ViewInstance } from 'react-native';
import type { PageWave } from './page-wave-context';

export type PageWaveSurfaceProps = {
  wave: PageWave;
  blurTarget: RefObject<ViewInstance | null>;
  colorScheme: 'light' | 'dark';
  backgroundColor: string;
  reduceTransparency: boolean;
};
