import type { AppearanceTransitionStyle } from '@/context/theme.context';
import {
  Canvas,
  Fill,
  Group,
  Image,
  Path,
  usePathValue,
  type SkImage,
} from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { appendDangaiMask, createDangaiMask } from './dangai-mask';
import {
  appendGargantaEntrance,
  appendGargantaMask,
  createGargantaMask,
  getGargantaPaperOpacity,
} from './garganta-mask';
import { appendKurohitsugiMask, createKurohitsugiMask } from './kurohitsugi-mask';
import { appendYhwachMask, createYhwachMask } from './yhwach-mask';
import { createXboxArtwork } from './xbox-artwork';
import { XboxIntro } from './xbox-intro';

/** Pattern artwork masks the previous snapshot while the next theme remains live beneath it. */
export function PatternSnapshotReveal({
  variant,
  width,
  height,
  sourceScheme,
  image,
  onCovered,
  onComplete,
}: Readonly<{
  variant: Exclude<AppearanceTransitionStyle, 'circular'>;
  width: number;
  height: number;
  sourceScheme: 'light' | 'dark';
  image: SharedValue<SkImage | null>;
  onCovered: () => void;
  onComplete: () => void;
}>) {
  const progress = useSharedValue(0);
  // Captured with the old snapshot; applying the next theme must not invert this mid-reveal.
  const background = sourceScheme === 'light' ? '#FFFFFF' : '#000000';
  const foreground = sourceScheme === 'light' ? '#000000' : '#FFFFFF';
  // Artwork belongs to this reveal; resize cancellation creates a fresh model.
  const [mask] = useState(() => {
    switch (variant) {
      case 'kurohitsugi':
        return { variant, monoliths: createKurohitsugiMask(width, height) };
      case 'yhwach':
        return { variant, eyes: createYhwachMask(width, height) };
      case 'dangai':
        return { variant, aura: createDangaiMask(width, height) };
      case 'garganta':
        return { variant, rift: createGargantaMask(width, height) };
      case 'xbox':
        return { variant, xbox: createXboxArtwork(width, height) };
    }
  });
  const duration = 20_000;
  const fragments = usePathValue((builder) => {
    'worklet';
    if (mask.variant === 'kurohitsugi') {
      appendKurohitsugiMask(builder, mask.monoliths, progress.get());
    } else if (mask.variant === 'yhwach') {
      appendYhwachMask(builder, mask.eyes, progress.get());
    } else if (mask.variant === 'dangai') {
      appendDangaiMask(builder, mask.aura, progress.get());
    } else if (mask.variant === 'garganta') {
      appendGargantaMask(builder, mask.rift, progress.get());
    }
  });
  const entrance = usePathValue((builder) => {
    'worklet';
    if (mask.variant === 'garganta') {
      appendGargantaEntrance(builder, mask.rift, progress.get());
    }
  });
  const paperOpacity = useDerivedValue(() =>
    mask.variant === 'garganta' ? getGargantaPaperOpacity(progress.get()) : 0,
  );

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
        {mask.variant === 'xbox' ? (
          <XboxIntro
            artwork={mask.xbox}
            progress={progress}
            image={image}
            width={width}
            height={height}
            background={background}
            foreground={foreground}
          />
        ) : variant === 'garganta' ? (
          <Group clip={entrance} invertClip>
            <Image image={image} x={0} y={0} width={width} height={height} fit="fill" />
            <Group opacity={paperOpacity}>
              <Fill color={background} />
              <Path path={fragments} color={foreground} />
            </Group>
          </Group>
        ) : (
          <Group clip={fragments} invertClip>
            <Image image={image} x={0} y={0} width={width} height={height} fit="fill" />
          </Group>
        )}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
