import type { RefObject } from 'react';
import type { ViewInstance } from 'react-native';
import type { PageWave } from './page-motion-context';

export type PageWaveSurfaceProps = {
  wave: PageWave;
  blurKey: number;
  blurTarget: RefObject<ViewInstance | null>;
  colorScheme: 'light' | 'dark';
  backgroundColor: string;
  reduceTransparency: boolean;
};
