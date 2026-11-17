import { useActiveMotionTime } from '@/hooks/use-active-motion-time';
import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Path, usePathValue } from '@shopify/react-native-skia';
import { Platform, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useHostColorScheme } from '../host/universal-host';

const supportsBlending = Platform.OS !== 'android' || Number(Platform.Version) >= 29;

// Every period divides the motion clock's 120-second wrap.
const bubbles = [
  { x: 0.12, radius: 0.11, phase: 0.04, period: 20 },
  { x: 0.76, radius: 0.16, phase: 0.21, period: 30 },
  { x: 0.43, radius: 0.07, phase: 0.38, period: 24 },
  { x: 0.9, radius: 0.09, phase: 0.54, period: 20 },
  { x: 0.25, radius: 0.15, phase: 0.69, period: 40 },
  { x: 0.57, radius: 0.12, phase: 0.86, period: 30 },
  { x: 0.67, radius: 0.05, phase: 0.11, period: 24 },
  { x: 0.06, radius: 0.06, phase: 0.47, period: 20 },
] as const;

/** Circular masks invert the live banner beneath them without capturing its content. */
export function BannerBubbles({ animate, testID }: Readonly<{ animate: boolean; testID: string }>) {
  const colors = useThemeColors(useHostColorScheme());
  const time = useActiveMotionTime(animate);
  const size = useSharedValue({ width: 0, height: 0 });
  const mask = usePathValue((builder) => {
    'worklet';
    const { width, height } = size.get();
    if (width <= 0 || height <= 0) return;
    const seconds = time.get();
    const extent = Math.min(width, height);
    for (const bubble of bubbles) {
      const phase = (seconds / bubble.period + bubble.phase) % 1;
      const radius = extent * bubble.radius;
      // Recycle only after the whole circle has left the viewport, including its edge.
      const margin = radius + 2;
      const y = height + margin - phase * (height + margin * 2);
      const x = width * bubble.x + Math.sin(phase * Math.PI * 2) * extent * 0.035;
      builder.addCircle(x, y, radius);
    }
  });

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout;
        size.set({ width, height });
      }}
      style={styles.overlay}
    >
      <Canvas style={styles.fill} pointerEvents="none">
        <Path
          path={mask}
          color={supportsBlending ? '#FFFFFF' : colors.text}
          opacity={supportsBlending ? 1 : 0.06}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    // Older Android versions keep a subtle tint instead of covering content with white.
    mixBlendMode: supportsBlending ? 'difference' : 'normal',
  },
});
