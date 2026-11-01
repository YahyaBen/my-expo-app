import { useLayoutDirection } from '@/context/layout-direction.context';
import { useActiveMotionTime } from '@/hooks/use-active-motion-time';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, Path, Skia, type Transforms3d } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useDerivedValue, useSharedValue, type SharedValue } from 'react-native-reanimated';

export const LAUNCH_WAVE_HEIGHT = 80;
const WAVE_WIDTH = 1000;
const WAVE_HEIGHT = 100;

// Paint outermost first. Overscan keeps the body joined and both sides covered while drifting.
const WAVE_LAYERS = [
  {
    color: 'primaryContainer',
    path: 'M-200-40H1200V18C950 18 800 92 500 92S50 18-200 18Z',
    period: 8,
    phase: 0,
    travel: 22,
  },
  {
    color: 'primary',
    path: 'M-200-40H1200V6C950 6 780 76 480 76S50 6-200 6Z',
    period: 6,
    phase: Math.PI / 2,
    travel: 18,
  },
  {
    color: 'primaryPressed',
    path: 'M-200-40H1200V-6C950-6 800 60 520 60S50-6-200-6Z',
    period: 5,
    phase: Math.PI,
    travel: 24,
  },
  {
    color: 'background',
    path: 'M-200-40H1200V-18C950-18 780 48 500 48S50-18-200-18Z',
    period: 4,
    phase: (3 * Math.PI) / 2,
    travel: 14,
  },
] as const;

/** Four solid, independently drifting contours below the branded splash body. */
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
    { scaleX: width.get() / WAVE_WIDTH },
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
      style={{ height: LAUNCH_WAVE_HEIGHT }}
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
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
  const path = useMemo(() => Skia.Path.MakeFromSVGString(layer.path)!, [layer.path]);
  const drift = useDerivedValue<Transforms3d>(() => {
    // Each period divides the shared clock's 120-second wrap, so looping stays continuous.
    const phase = (time.get() / layer.period) * 2 * Math.PI + layer.phase;
    return [
      { translateX: Math.sin(phase) * layer.travel * horizontalDirection },
      { translateY: Math.sin(phase + Math.PI / 3) * 2 },
    ];
  });

  return <Path path={path} color={color} transform={drift} />;
}
