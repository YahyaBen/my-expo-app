import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia';
import Animated, {
  Easing,
  cubicBezier,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Column, RNHostView, type TextInputRef } from '@expo/ui';
import { UniversalButtonContent } from '../button/universal-button';
import { TextInput } from '../text-input/text-input';
import { nativeFillWidth, nativeFillWidthCenter } from '../native/native-fill-width';
import { useHostColorScheme } from '../host/universal-host';
import { spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

export type VerificationCodeFaceStatus = 'default' | 'success' | 'error';

export type VerificationCodeFaceProps = {
  /** Keep the raw string in the parent so native cursor/editing behavior stays intact. */
  value: string;
  onChangeText: (value: string) => void;
  label: string;
  length?: number;
  /** Validation belongs to the caller; this controls presentation only. */
  status?: VerificationCodeFaceStatus;
  helperText?: string;
  resetLabel?: string;
  faceSize?: number;
  disabled?: boolean;
  /** Called for a new complete numeric entry, with supported digits normalized to ASCII. */
  onComplete?: (code: string) => void;
  testID?: string;
};

function normalizeDigits(value: string) {
  return value.replace(/[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/g, (digit) => {
    const point = digit.charCodeAt(0);
    const zero = point >= 0xff10 ? 0xff10 : point >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(point - zero);
  });
}

// Reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/verification-code-face
export function VerificationCodeFace({
  value,
  onChangeText,
  label,
  length = 4,
  status = 'default',
  helperText,
  resetLabel,
  faceSize = 96,
  disabled = false,
  onComplete,
  testID = 'verification-code-face',
}: VerificationCodeFaceProps) {
  const inputRef = useRef<TextInputRef>(null);
  const codeLength = Number.isFinite(length) ? Math.max(1, Math.trunc(length)) : 4;
  const size = Number.isFinite(faceSize) ? Math.max(1, faceSize) : 96;
  const digits = normalizeDigits(value);
  const progress = Math.min(digits.replace(/[^0-9]/g, '').length / codeLength, 1);

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <Column alignment="center" modifiers={nativeFillWidthCenter}>
        <RNHostView matchContents>
          <View
            style={[styles.artwork, { width: size * 1.5, height: size * 1.5 }]}
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <VerificationFace
              progress={progress}
              status={status}
              size={size}
              testID={`${testID}-artwork`}
            />
          </View>
        </RNHostView>
      </Column>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          if (disabled) return;
          // Return the original text; normalizing the controlled value here can break native edits.
          onChangeText(text);
          const normalized = normalizeDigits(text);
          if (normalized.length === codeLength && /^[0-9]+$/.test(normalized)) {
            inputRef.current?.blur();
            if (text !== value) onComplete?.(normalized);
          }
        }}
        label={label}
        placeholder={'0'.repeat(codeLength)}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus
        maxLength={codeLength}
        disabled={disabled}
        textAlign="center"
        textStyle={{ fontSize: 32, letterSpacing: spacing.md }}
        style={{ paddingVertical: spacing.md }}
        status={status}
        helperText={helperText}
        onSubmitEditing={() => inputRef.current?.blur()}
        testID={`${testID}-input`}
      />
      {resetLabel ? (
        <UniversalButtonContent
          variant="secondary"
          label={resetLabel}
          onPress={() => {
            if (disabled) return;
            onChangeText('');
            inputRef.current?.blur();
          }}
          disabled={disabled}
          fullWidth
          testID={`${testID}-reset`}
        />
      ) : null}
    </Column>
  );
}

function VerificationFace({
  progress: inputProgress,
  status,
  size,
  testID,
}: {
  progress: number;
  status: VerificationCodeFaceStatus;
  size: number;
  testID: string;
}) {
  const colors = useThemeColors(useHostColorScheme());
  const motionEnabled = useMotionEnabled();
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
