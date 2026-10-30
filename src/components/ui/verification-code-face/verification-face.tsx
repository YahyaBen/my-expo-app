import { StyleSheet, View } from 'react-native';
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia';
import Animated, {
  Easing,
  cubicBezier,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Column, RNHostView } from '@expo/ui';
import { nativeFillWidthCenter } from '../native/native-fill-width';
import { useHostColorScheme } from '../host/universal-host';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

export type VerificationCodeFaceStatus = 'default' | 'success' | 'error';

// Reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/verification-code-face
/** Decorative feedback only; the caller owns code entry and verification. */
export function VerificationFace({
  progress,
  status,
  size: faceSize = 96,
  visible = true,
  testID,
}: Readonly<{
  progress: number;
  status: VerificationCodeFaceStatus;
  size?: number;
  visible?: boolean;
  testID: string;
}>) {
  const size = Number.isFinite(faceSize) ? Math.max(1, faceSize) : 96;
  return (
    <Column alignment="center" modifiers={nativeFillWidthCenter}>
      <RNHostView matchContents>
        <View
          style={[styles.artwork, { width: size * 1.5, height: size * 1.5 }]}
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <AnimatedVerificationFace
            progress={progress}
            status={status}
            size={size}
            visible={visible}
            testID={testID}
          />
        </View>
      </RNHostView>
    </Column>
  );
}

function AnimatedVerificationFace({
  progress: inputProgress,
  status,
  size,
  testID,
  visible,
}: Readonly<{
  progress: number;
  status: VerificationCodeFaceStatus;
  size: number;
  testID: string;
  visible: boolean;
}>) {
  const colors = useThemeColors(useHostColorScheme());
  const motionEnabled = useMotionEnabled(visible);
  const progress = useDerivedValue(() =>
    withTiming(inputProgress, {
      duration: motionEnabled ? 150 : 0,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
    }),
  );
  const expression = useDerivedValue(() =>
    withTiming(status === 'success' ? 1 : status === 'error' ? -1 : 0, {
      duration: motionEnabled ? 200 : 0,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
    }),
  );
  const faceTransform = useDerivedValue(() => [{ translateX: progress.get() * 8 - 4 }]);
  const pupilRadius = useDerivedValue(() => 2 + progress.get() * 2);
  const pupilLeft = useDerivedValue(() => 31 + progress.get() * 8);
  const pupilRight = useDerivedValue(() => 57 + progress.get() * 8);
  const mouth = useDerivedValue(() =>
    Skia.PathBuilder.Make()
      .moveTo(36, 65)
      .quadTo(48, 65 + expression.get() * 14, 60, 65)
      .build(),
  );
  const eyebrows = useDerivedValue(() =>
    Skia.PathBuilder.Make()
      .moveTo(26, 27)
      .quadTo(35, 27 - expression.get() * 6, 44, 27)
      .moveTo(52, 27)
      .quadTo(61, 27 - expression.get() * 6, 70, 27)
      .build(),
  );

  return (
    <Animated.View
      testID={testID}
      style={[
        { width: size, height: size, borderRadius: size / 4 },
        {
          backgroundColor: colors.primary,
          transform: [
            { perspective: 300 },
            { rotateY: `${motionEnabled ? inputProgress * 45 - 22.5 : 0}deg` },
            { rotateX: `${motionEnabled ? -22.5 : 0}deg` },
          ],
          transitionProperty: 'transform',
          transitionDuration: motionEnabled ? 150 : 0,
          transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
        },
      ]}
    >
      <Canvas style={{ width: size, height: size }} pointerEvents="none" accessible={false}>
        {/* Keep the illustration's 96-unit coordinate system at every requested size. */}
        <Group transform={[{ scale: size / 96 }]}>
          <Group transform={faceTransform}>
            <Path
              path={eyebrows}
              color={colors.onPrimary}
              style="stroke"
              strokeWidth={1.5}
              strokeCap="round"
            />
            <Circle cx={35} cy={44} r={10} color={colors.onPrimary} />
            <Circle cx={61} cy={44} r={10} color={colors.onPrimary} />
            <Circle cx={pupilLeft} cy={47} r={pupilRadius} color={colors.primary} />
            <Circle cx={pupilRight} cy={47} r={pupilRadius} color={colors.primary} />
            <Path
              path={mouth}
              color={colors.onPrimary}
              style="stroke"
              strokeWidth={2}
              strokeCap="round"
            />
          </Group>
        </Group>
      </Canvas>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  artwork: { alignItems: 'center', justifyContent: 'center' },
});
