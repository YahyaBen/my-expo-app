import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path, vec } from '@shopify/react-native-skia';
import { useIsFocused } from 'expo-router';
import { View } from 'react-native';
import { getSeasonalHeaderColor } from './page-header-details';
import type { PageMotionSettings } from './page-motion-context';
import { PageWaveSurface } from './page-wave-surface';
import type { PageWaveSurfaceProps } from './page-wave-surface.types';
import { usePageWaveMotion } from './use-page-wave-motion';

/** The backdrop, mask and artwork travel with their owning native screen. */
export function PageHeaderArtwork({
  motion,
  height,
  blur,
  ...surfaceProps
}: Readonly<
  Omit<PageWaveSurfaceProps, 'wave'> & {
    motion: PageMotionSettings;
    height: number;
    blur: boolean;
  }
>) {
  const focused = useIsFocused();
  const { colorScheme: scheme } = surfaceProps;
  const colors = useThemeColors(scheme);
  const { wave, detailPath, width } = usePageWaveMotion(
    motion.animate && motion.visible && focused,
    motion.shape,
    height,
  );
  const gradientStart = vec(0, 0);
  const gradientEnd = vec(0, 100);
  const seasonalColor = getSeasonalHeaderColor(motion.shape, scheme);
  const tint = seasonalColor ?? colors.tint;
  const overlayColors = [tint, `${tint}CC`];

  // Hiding artwork pauses its clock without discarding the retained phase.
  if (!motion.visible) return null;

  return (
    <View
      testID="page-motion-overlay"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      onLayout={({ nativeEvent }) => {
        if (nativeEvent.layout.width > 0) width.set(nativeEvent.layout.width);
      }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}
    >
      {blur ? <PageWaveSurface {...surfaceProps} wave={wave} /> : null}
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Group transform={wave.transform}>
          <Path path={wave.backPath} opacity={scheme === 'dark' ? 0.12 : 0.08}>
            <LinearGradient start={gradientStart} end={gradientEnd} colors={overlayColors} />
          </Path>
          <Path path={wave.frontPath} opacity={scheme === 'dark' ? 0.2 : 0.12}>
            <LinearGradient start={gradientStart} end={gradientEnd} colors={overlayColors} />
          </Path>
          <Path
            path={wave.frontPath}
            color={tint}
            opacity={scheme === 'dark' ? 0.22 : 0.12}
            style="stroke"
            strokeWidth={1}
          />
          <Path path={detailPath} color={tint} opacity={seasonalColor ? 0.36 : 0.28} />
        </Group>
      </Canvas>
    </View>
  );
}
