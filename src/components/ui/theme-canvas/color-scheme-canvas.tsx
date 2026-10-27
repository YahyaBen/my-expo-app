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

export type ColorSchemeCanvasProps = {
  /** Omit to follow the owning Host; supplying a value affects only this artwork. */
  colorScheme?: 'light' | 'dark';
  height?: number;
  testID?: string;
};

/** Decorative artwork follows its Host; the appearance control owns preference changes. */
export function ColorSchemeCanvas({
  colorScheme,
  height: requestedHeight = 160,
  testID = 'color-scheme-canvas',
}: ColorSchemeCanvasProps) {
  const [width, setWidth] = useMeasuredWidth();
  const height = Math.max(1, requestedHeight);
  const dark = useHostColorScheme(colorScheme) === 'dark';
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const motionEnabled = useMotionEnabled();
  const lightColors = useThemeColors('light');
  const darkColors = useThemeColors('dark');
  const baseDark = useSharedValue(dark);
  const radius = useSharedValue(0);
  // Keep the illustration and reveal origin inside small, consumer-sized canvases.
  const artworkScale = Math.min(1, width / 96, height / 96);
  const originX = rtl ? Math.min(spacing.xl, width / 2) : width - Math.min(spacing.xl, width / 2);
  const originY = Math.min(spacing.xl, height / 2);
  const darkOpacity = useDerivedValue(() => (baseDark.get() ? 1 : 0));
  const clip = useDerivedValue(() =>
    Skia.PathBuilder.Make().addCircle(originX, originY, radius.get()).build(),
  );

  useEffect(() => {
    cancelAnimation(radius);
    radius.set(0);
    if (width === 0 || !motionEnabled || baseDark.get() === dark) {
      baseDark.set(dark);
    } else {
      radius.set(
        withTiming(
          Math.hypot(Math.max(originX, width - originX), Math.max(originY, height - originY)),
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
  }, [dark, width, height, originX, originY, motionEnabled, baseDark, radius]);

  const lightScene = (
    <Group>
      <Rect x={0} y={0} width={width} height={height} color={lightColors.background} />
      <Circle cx={width / 2} cy={height / 2} r={30 * artworkScale} color={lightColors.warning} />
      <Circle
        cx={width / 2}
        cy={height / 2}
        r={38 * artworkScale}
        color={lightColors.warning}
        style="stroke"
        strokeWidth={2 * artworkScale}
      />
    </Group>
  );
  const darkScene = (
    <Group>
      <Rect x={0} y={0} width={width} height={height} color={darkColors.background} />
      <Circle cx={width / 2} cy={height / 2} r={32 * artworkScale} color={darkColors.text} />
      <Circle
        cx={width / 2 + 15 * artworkScale}
        cy={height / 2 - 12 * artworkScale}
        r={28 * artworkScale}
        color={darkColors.background}
      />
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
