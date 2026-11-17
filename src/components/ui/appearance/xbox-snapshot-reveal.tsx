import { Canvas, type SkImage } from '@shopify/react-native-skia';
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
import { createXboxArtwork } from './xbox-artwork';
import { XboxIntro } from './xbox-intro';

/** Xbox artwork masks the previous snapshot while the next theme remains live beneath it. */
export function XboxSnapshotReveal({
  width,
  height,
  sourceScheme,
  image,
  onCovered,
  onComplete,
}: Readonly<{
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
  const [artwork] = useState(() => createXboxArtwork(width, height));
  const duration = 2_000;

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
        <XboxIntro
          artwork={artwork}
          progress={progress}
          image={image}
          width={width}
          height={height}
          background={background}
          foreground={foreground}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
