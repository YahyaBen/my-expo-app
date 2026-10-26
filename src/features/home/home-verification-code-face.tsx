import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia';
import Animated, {
  Easing,
  cubicBezier,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Column,
  RNHostView,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent,
  nativeFillWidth,
  nativeFillWidthCenter,
  useHostColorScheme,
  type TextInputRef,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

type FaceStatus = 'default' | 'success' | 'error';
const codeLength = 4;
const correctCode = '1111';

// Reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/verification-code-face
export function HomeVerificationCodeFace() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInputRef>(null);
  // Preserve native editing and normalize supported numeric scripts only for comparison.
  const digits = code.replace(/[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/g, (digit) => {
    const point = digit.charCodeAt(0);
    const zero = point >= 0xff10 ? 0xff10 : point >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(point - zero);
  });
  const status: FaceStatus = /[^0-9]/.test(digits)
    ? 'error'
    : digits.length < codeLength
      ? 'default'
      : digits === correctCode
        ? 'success'
        : 'error';

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-verification-face">
      <UniversalTextContent variant="subtitle">
        {t('starter.verificationFaceTitle')}
      </UniversalTextContent>
      <UniversalTextContent tone="muted">{t('starter.verificationFaceHint')}</UniversalTextContent>
      <Column alignment="center" modifiers={nativeFillWidthCenter}>
        <RNHostView matchContents>
          <View
            style={styles.artwork}
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <VerificationFace length={digits.replace(/[^0-9]/g, '').length} status={status} />
          </View>
        </RNHostView>
      </Column>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(text) => {
          setCode(text);
          if (text.length === codeLength) inputRef.current?.blur();
        }}
        label={t('starter.verificationFaceLabel')}
        placeholder="0000"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus
        maxLength={codeLength}
        textAlign="center"
        textStyle={{ fontSize: 32, letterSpacing: spacing.md }}
        style={{ paddingVertical: spacing.md }}
        status={status}
        helperText={
          status === 'default'
            ? undefined
            : t(
                status === 'success'
                  ? 'starter.verificationFaceSuccess'
                  : 'starter.verificationFaceError',
              )
        }
        onSubmitEditing={() => inputRef.current?.blur()}
        testID="home-verification-face-input"
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('starter.verificationFaceReset')}
        onPress={() => {
          setCode('');
          inputRef.current?.blur();
        }}
        fullWidth
        testID="home-verification-face-reset"
      />
    </Column>
  );
}

function VerificationFace({ length, status }: { length: number; status: FaceStatus }) {
  const colors = useThemeColors(useHostColorScheme());
  const motionEnabled = useMotionEnabled();
  const progress = useDerivedValue(() =>
    withTiming(length / codeLength, {
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
      testID="home-verification-face-artwork"
      style={[
        styles.tile,
        {
          backgroundColor: colors.primary,
          transform: [
            { perspective: 300 },
            { rotateY: `${motionEnabled ? (length / codeLength) * 45 - 22.5 : 0}deg` },
            { rotateX: `${motionEnabled ? -22.5 : 0}deg` },
          ],
          transitionProperty: 'transform',
          transitionDuration: motionEnabled ? 150 : 0,
          transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
        },
      ]}
    >
      <Canvas style={styles.tile} pointerEvents="none" accessible={false}>
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
      </Canvas>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  artwork: { width: 144, height: 144, alignItems: 'center', justifyContent: 'center' },
  tile: { width: 96, height: 96, borderRadius: spacing.xl },
});
