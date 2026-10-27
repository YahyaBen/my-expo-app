import { useEffect } from 'react';
import { View } from 'react-native';
import { Column, RNHostView } from '@expo/ui';
import { Canvas, Circle, Group, Rect, Skia } from '@shopify/react-native-skia';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { nativeFillWidth } from '../native/native-fill-width';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import { radii, spacing } from '@/constants/layout';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

const height = 160;

/** Decorative artwork follows its Host; the appearance control owns preference changes. */
export function ColorSchemeCanvas({ testID = 'color-scheme-canvas' }: { testID?: string }) {
  const [width, setWidth] = useMeasuredWidth();
  const dark = useHostColorScheme() === 'dark';
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const motionEnabled = useMotionEnabled();
  const lightColors = useThemeColors('light');
  const darkColors = useThemeColors('dark');
  const baseDark = useSharedValue(dark);
  const radius = useSharedValue(0);
  const darkOpacity = useDerivedValue(() => (baseDark.get() ? 1 : 0));
  const clip = useDerivedValue(() =>
    Skia.PathBuilder.Make()
      .addCircle(rtl ? spacing.xl : width - spacing.xl, spacing.xl, radius.get())
      .build(),
  );

  useEffect(() => {
    cancelAnimation(radius);
    radius.set(0);
    if (width === 0 || !motionEnabled || baseDark.get() === dark) {
      baseDark.set(dark);
    } else {
      radius.set(
        withTiming(
          Math.hypot(width - spacing.xl, height - spacing.xl),
          { duration: 300, easing: Easing.bezier(0.23, 1, 0.32, 1) },
          (finished) => {
            if (!finished) return;
            baseDark.set(dark);
            radius.set(0);
          },
        ),
      );
    }
    return () => cancelAnimation(radius);
  }, [dark, width, rtl, motionEnabled, baseDark, radius]);

  const lightScene = (
    <Group>
      <Rect x={0} y={0} width={width} height={height} color={lightColors.background} />
      <Circle cx={width / 2} cy={height / 2} r={30} color={lightColors.warning} />
      <Circle
        cx={width / 2}
        cy={height / 2}
        r={38}
        color={lightColors.warning}
        style="stroke"
        strokeWidth={2}
      />
    </Group>
  );
  const darkScene = (
    <Group>
      <Rect x={0} y={0} width={width} height={height} color={darkColors.background} />
      <Circle cx={width / 2} cy={height / 2} r={32} color={darkColors.text} />
      <Circle cx={width / 2 + 15} cy={height / 2 - 12} r={28} color={darkColors.background} />
    </Group>
  );

  return (
    <Column modifiers={nativeFillWidth}>
      <Column style={{ height }}>
        <RNHostView matchContents={false}>
          <View
            style={{ flex: 1, borderRadius: radii.card, overflow: 'hidden' }}
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            testID={testID}
          >
            {width > 0 ? (
              <Canvas style={{ flex: 1 }} pointerEvents="none" accessible={false}>
                {lightScene}
                <Group opacity={darkOpacity}>{darkScene}</Group>
                <Group clip={clip}>{dark ? darkScene : lightScene}</Group>
              </Canvas>
            ) : null}
          </View>
        </RNHostView>
      </Column>
    </Column>
  );
}
