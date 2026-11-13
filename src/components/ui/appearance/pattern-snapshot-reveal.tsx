import { Canvas, Group, Image, usePathValue, type SkImage } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { appendDangaiMask, createDangaiMask } from './dangai-mask';
import { appendKurohitsugiMask, createKurohitsugiMask } from './kurohitsugi-mask';
import { appendYhwachMask, createYhwachMask } from './yhwach-mask';

/** Pattern artwork masks the previous snapshot while the next theme remains live beneath it. */
export function PatternSnapshotReveal({
  variant,
  width,
  height,
  image,
  onCovered,
  onComplete,
}: Readonly<{
  variant: 'kurohitsugi' | 'yhwach' | 'dangai';
  width: number;
  height: number;
  image: SharedValue<SkImage | null>;
  onCovered: () => void;
  onComplete: () => void;
}>) {
  const progress = useSharedValue(0);
  // Artwork belongs to this reveal; resize cancellation creates a fresh model.
  const [mask] = useState(() => {
    switch (variant) {
      case 'kurohitsugi':
        return { variant, monoliths: createKurohitsugiMask(width, height) };
      case 'yhwach':
        return { variant, eyes: createYhwachMask(width, height) };
      case 'dangai':
        return { variant, aura: createDangaiMask(width, height) };
    }
  });
  const duration = variant === 'yhwach' ? 1500 : variant === 'dangai' ? 1400 : 1200;
  const fragments = usePathValue((builder) => {
    'worklet';
    if (mask.variant === 'kurohitsugi') {
      appendKurohitsugiMask(builder, mask.monoliths, progress.get());
    } else if (mask.variant === 'yhwach') {
      appendYhwachMask(builder, mask.eyes, progress.get());
    } else {
      appendDangaiMask(builder, mask.aura, progress.get());
    }
  });

  useEffect(() => {
    // Match the circular reveal: the full old snapshot hides the native theme commit.
    let frameId = requestAnimationFrame(() => {
      onCovered();
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => {
          progress.set(
            withTiming(
              1,
              {
                duration,
                easing: Easing.linear,
                reduceMotion: ReduceMotion.Never,
              },
              (finished) => {
                if (finished) scheduleOnRN(onComplete);
              },
            ),
          );
        });
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimation(progress);
    };
  }, [duration, onComplete, onCovered, progress]);

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="app-appearance-reveal"
    >
      <Canvas style={styles.fill} pointerEvents="none">
        <Group clip={fragments} invertClip>
          <Image image={image} x={0} y={0} width={width} height={height} fit="fill" />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
