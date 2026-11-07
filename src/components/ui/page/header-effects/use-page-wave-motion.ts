import { useLayoutDirection } from '@/context/layout-direction.context';
import { useActiveMotionTime } from '@/hooks/use-active-motion-time';
import type { PageHeaderShape } from '@/constants/header-motion';
import { usePathValue, type Transforms3d } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { drawVectorPath, headerContour } from './page-header-shapes';
import { drawHeaderDetails } from './page-header-details';
import type { PageWave } from './page-motion-context';

const HEADER_WAVE_WIDTH = 1000;
const HEADER_WAVE_HEIGHT = 100;

/** One motion source keeps header artwork and native blur masks aligned. */
export function usePageWaveMotion(animate: boolean, shape: PageHeaderShape, height: number) {
  const direction = useLayoutDirection();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const time = useActiveMotionTime(animate);
  const width = useSharedValue(windowWidth);
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
    drawHeaderDetails(builder, shape, time.get(), scaleX.get(), scaleY);
  });
  const wave: PageWave = {
    height,
    scaleX,
    scaleY,
    translateX,
    transform,
    frontPath,
    backPath,
    frontContour,
    backContour,
  };

  return { wave, detailPath, width };
}
