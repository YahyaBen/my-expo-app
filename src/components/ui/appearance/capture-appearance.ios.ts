import { makeImageFromView } from '@shopify/react-native-skia';
import type { RefObject } from 'react';
import { findNodeHandle, type ViewInstance } from 'react-native';

export function captureAppearance(view: RefObject<ViewInstance | null>) {
  // Skia 2's ref types predate RN's ViewInstance; the public API also accepts a native tag.
  return makeImageFromView({ current: findNodeHandle(view.current) ?? null });
}
