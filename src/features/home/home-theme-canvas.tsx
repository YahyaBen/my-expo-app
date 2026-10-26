import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Canvas, Circle, Group, Rect, Skia } from '@shopify/react-native-skia';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Column,
  RNHostView,
  Switch,
  UniversalTextContent,
  nativeFillWidth,
  useHostColorScheme,
  useHostLayoutDirection,
} from '@components/ui';
import { radii, screenContentMaxWidth, spacing } from '@/constants/layout';
import { useThemeSettings } from '@/context/theme.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

const height = 160;

/** The app owns appearance and persistence; the canvas only illustrates the change. */
export function HomeThemeCanvas() {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dark = useHostColorScheme() === 'dark';
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const { setColorScheme, appearanceReady } = useThemeSettings();
  const motionEnabled = useMotionEnabled();
  const lightColors = useThemeColors('light');
  const darkColors = useThemeColors('dark');
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );
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
    if (!motionEnabled || baseDark.get() === dark) {
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
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-theme-canvas">
      <UniversalTextContent variant="subtitle">
        {t('starter.themeCanvasTitle')}
      </UniversalTextContent>
      <UniversalTextContent tone="muted">{t('starter.themeCanvasHint')}</UniversalTextContent>
      <Switch
        label={t('common.darkMode')}
        value={dark}
        onValueChange={(enabled) => setColorScheme(enabled ? 'dark' : 'light')}
        disabled={!appearanceReady}
        testID="home-theme-canvas-switch"
      />
      <RNHostView matchContents>
        <Canvas
          style={{ width, height, borderRadius: radii.card, overflow: 'hidden' }}
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          testID="home-theme-canvas-artwork"
        >
          {lightScene}
          <Group opacity={darkOpacity}>{darkScene}</Group>
          <Group clip={clip}>{dark ? darkScene : lightScene}</Group>
        </Canvas>
      </RNHostView>
    </Column>
  );
}
