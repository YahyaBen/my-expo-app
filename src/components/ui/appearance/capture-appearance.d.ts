import type { SkImage } from '@shopify/react-native-skia';
import type { RefObject } from 'react';
import type { ViewInstance } from 'react-native';

export declare function captureAppearance(
  view: RefObject<ViewInstance | null>,
): Promise<SkImage | null>;
