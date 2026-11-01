import { createContext } from 'react';
import type { SkPath, Transforms3d } from '@shopify/react-native-skia';
import type { DerivedValue, SharedValue } from 'react-native-reanimated';
import type { VectorCommand } from './page-header-shapes';

/** Geometry and paths shared by the artwork and each platform's native blur mask. */
export type PageWave = {
  height: number;
  scaleX: DerivedValue<number>;
  scaleY: number;
  translateX: number;
  transform: DerivedValue<Transforms3d>;
  frontPath: SharedValue<SkPath>;
  backPath: SharedValue<SkPath>;
  frontContour: DerivedValue<VectorCommand[]>;
  backContour: DerivedValue<VectorCommand[]>;
};

export type PageWaveContextValue = {
  wave: PageWave;
  setHeaderHeight: (height: number) => void;
};

export const PageWaveContext = createContext<PageWaveContextValue | null>(null);
