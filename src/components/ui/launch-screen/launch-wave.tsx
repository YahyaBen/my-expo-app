import { useLayoutDirection } from '@/context/layout-direction.context';
import { useActiveMotionTime } from '@/hooks/use-active-motion-time';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

export const LAUNCH_WAVE_HEIGHT = 80;
const SCALE_Y = LAUNCH_WAVE_HEIGHT / 210;

/** The launch edge has cached paths and rigid drift, independent of page header geometry. */
export function LaunchWave({
  colorScheme,
  animate = true,
}: Readonly<{ colorScheme?: 'light' | 'dark'; animate?: boolean }>) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const direction = useLayoutDirection();
  const horizontalDirection = direction === 'rtl' ? -1 : 1;
  const time = useActiveMotionTime(animate);
  const width = useSharedValue(0);
  const paths = useMemo(
    () => ({
      front: Skia.Path.MakeFromSVGString(
        'M0-204c43 28 300-30 423 18s358 8 586 59 351 183 578 38V-240H0Z',
      )!,
      back: Skia.Path.MakeFromSVGString(
        'M0-204c43 28 300-30 423 18s374-34 586 59 334-143 630-1V-240H0Z',
      )!,
    }),
    [],
  );
  const transform = useDerivedValue(() => [
    { scaleX: width.get() / 1487 },
    { translateY: LAUNCH_WAVE_HEIGHT },
    { translateX: -50 },
    { scaleY: SCALE_Y },
  ]);
  const movement = useDerivedValue(() => Math.sin((time.get() / 8) * 2 * Math.PI));
  const frontDrift = useDerivedValue(() => [
    { translateX: movement.get() * 40 * horizontalDirection },
    { translateY: movement.get() * 2 },
  ]);
  const backDrift = useDerivedValue(() => [
    { translateX: -movement.get() * 50 * horizontalDirection },
    { translateY: -movement.get() * 3 },
  ]);

  return (
    <View
      testID="launch-wave-edge"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      onLayout={({ nativeEvent }) => width.set(nativeEvent.layout.width)}
      style={{ height: LAUNCH_WAVE_HEIGHT }}
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Group transform={transform}>
          <Group transform={frontDrift}>
            <Path path={paths.front}>
              <LinearGradient
                start={vec(0, -210)}
                end={vec(0, 0)}
                colors={[colors.primaryContainer, colors.secondaryContainer]}
              />
            </Path>
          </Group>
          <Group transform={backDrift}>
            <Path path={paths.back} color={colors.background} />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
}
