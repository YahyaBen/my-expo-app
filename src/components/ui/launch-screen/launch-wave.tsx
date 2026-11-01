import { useLayoutDirection } from '@/context/layout-direction.context';
import { useActiveMotionTime } from '@/hooks/use-active-motion-time';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import {
  Canvas,
  Group,
  Path,
  Skia,
  usePathInterpolation,
  type Transforms3d,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useDerivedValue, useSharedValue, type SharedValue } from 'react-native-reanimated';

export const LAUNCH_WAVE_HEIGHT = 160;
const WAVE_HEIGHT = 100;

// Horizontal coordinates are fractions of the available width. Paint outermost first;
// overscan keeps the body joined and both screen edges covered while drifting.
const WAVE_LAYERS = [
  {
    color: 'launchWaveOuter',
    edge: 44,
    crest: 92,
    period: 8,
    phase: 0,
  },
  {
    color: 'launchWaveMiddle',
    edge: 21,
    crest: 69,
    period: 6,
    phase: Math.PI / 2,
  },
  {
    color: 'launchWaveInner',
    edge: -2,
    crest: 46,
    period: 5,
    phase: Math.PI,
  },
  {
    color: 'launchWaveBody',
    edge: -25,
    crest: 23,
    period: 4,
    phase: (3 * Math.PI) / 2,
  },
] as const;

/** Full-width solid waves with independently rolling crests below the splash body. */
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
  const transform = useDerivedValue(() => [
    { scaleX: width.get() },
    { scaleY: LAUNCH_WAVE_HEIGHT / WAVE_HEIGHT },
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
      style={{ width: '100%', height: LAUNCH_WAVE_HEIGHT }}
    >
      <Canvas pointerEvents="none" style={{ width: '100%', flex: 1 }}>
        <Group transform={transform}>
          {WAVE_LAYERS.map((layer) => (
            <LaunchWaveLayer
              key={layer.color}
              layer={layer}
              color={colors[layer.color]}
              time={time}
              horizontalDirection={horizontalDirection}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

function LaunchWaveLayer({
  layer,
  color,
  time,
  horizontalDirection,
}: Readonly<{
  layer: (typeof WAVE_LAYERS)[number];
  color: string;
  time: SharedValue<number>;
  horizontalDirection: number;
}>) {
  const paths = useMemo(
    () =>
      [0.38, 0.62].map((crestX) =>
        Skia.PathBuilder.Make()
          .moveTo(-0.2, -40)
          .lineTo(1.2, -40)
          .lineTo(1.2, layer.edge)
          .cubicTo(0.95, layer.edge, crestX + 0.3, layer.crest, crestX, layer.crest)
          .cubicTo(crestX - 0.3, layer.crest, 0.05, layer.edge, -0.2, layer.edge)
          .close()
          .build(),
      ),
    [layer.edge, layer.crest],
  );
  const phase = useDerivedValue(() => {
    // Each period divides the shared clock's 120-second wrap, so looping stays continuous.
    return (time.get() / layer.period) * 2 * Math.PI * horizontalDirection + layer.phase;
  });
  const progress = useDerivedValue(() => (1 - Math.cos(phase.get())) / 2);
  const path = usePathInterpolation(progress, [0, 1], paths);
  const drift = useDerivedValue<Transforms3d>(() => [
    { translateY: Math.sin(phase.get() + Math.PI / 3) * 3 },
  ]);

  return <Path path={path} color={color} transform={drift} />;
}
