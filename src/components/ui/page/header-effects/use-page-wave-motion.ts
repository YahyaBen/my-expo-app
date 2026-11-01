import { useLayoutDirection } from '@/context/layout-direction.context';
import { useActiveMotionTime } from '@/hooks/use-active-motion-time';
import { DEFAULT_HEADER_SHAPE, type PageHeaderShape } from '@/constants/header-motion';
import { usePathValue, type Transforms3d } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { drawVectorPath, headerContour } from './page-header-shapes';
import { headerDetails } from './page-header-details';
import type { PageWave, PageWaveContextValue } from './page-wave-context';

const HEADER_WAVE_WIDTH = 1000;
const HEADER_WAVE_HEIGHT = 100;

/** One motion source keeps header artwork and native blur masks aligned. */
export function usePageWaveMotion(animate: boolean, shape: PageHeaderShape = DEFAULT_HEADER_SHAPE) {
  const direction = useLayoutDirection();
  const { height: windowHeight } = useWindowDimensions();
  const [height, setHeaderHeight] = useState(80);
  const time = useActiveMotionTime(animate);
  const width = useSharedValue(0);
  const scaleY = height / HEADER_WAVE_HEIGHT;
  const translateX = direction === 'rtl' ? -HEADER_WAVE_WIDTH : 0;
  const scaleX = useDerivedValue(
    () => (width.get() / HEADER_WAVE_WIDTH) * (direction === 'rtl' ? -1 : 1),
  );
  const transform = useDerivedValue<Transforms3d>(() => [
    { scaleX: scaleX.get() },
    { translateX },
    { scaleY },
  ]);
  const fillEdge = -windowHeight / scaleY;
  const frontContour = useDerivedValue(() => headerContour(shape, time.get(), 0, fillEdge));
  const backContour = useDerivedValue(() => headerContour(shape, time.get(), 1, fillEdge));
  const frontPath = usePathValue((builder) => {
    'worklet';
    drawVectorPath(builder, frontContour.get());
  });
  const backPath = usePathValue((builder) => {
    'worklet';
    drawVectorPath(builder, backContour.get());
  });
  const detailPath = usePathValue((builder) => {
    'worklet';
    drawVectorPath(builder, headerDetails(shape, time.get()));
  });
  const wave = useMemo<PageWave>(
    () => ({
      height,
      scaleX,
      scaleY,
      translateX,
      transform,
      frontPath,
      backPath,
      frontContour,
      backContour,
    }),
    [height, scaleX, scaleY, translateX, transform, frontPath, backPath, frontContour, backContour],
  );
  const context = useMemo<PageWaveContextValue>(() => ({ wave, setHeaderHeight }), [wave]);

  return { context, detailPath, width };
}
