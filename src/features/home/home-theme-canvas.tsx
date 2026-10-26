import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Canvas, Group, Rect, Skia } from '@shopify/react-native-skia';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  Column,
  RNHostView,
  Row,
  Spacer,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  useHostLayoutDirection,
} from '@components/ui';
import { radii, screenContentMaxWidth, spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

const paletteRoles = [
  { background: 'background', foreground: 'text' },
  { background: 'primaryContainer', foreground: 'onPrimaryContainer' },
  { background: 'secondaryContainer', foreground: 'onSecondaryContainer' },
  { background: 'successContainer', foreground: 'success' },
  { background: 'warningContainer', foreground: 'warning' },
  { background: 'infoContainer', foreground: 'info' },
] as const;

// Reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/theme-canvas-animation
export function HomeThemeCanvas() {
  const { t } = useTranslation();
  const { width: windowWidth, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scheme = useHostColorScheme();
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const colors = useThemeColors(scheme);
  const motionEnabled = useMotionEnabled();
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );
  const columns = width >= 300 && fontScale <= 1.3 ? 3 : 2;
  const rows = paletteRoles.length / columns;
  const headingHeight = 96 * Math.max(1, fontScale);
  const buttonHeight = 56 * Math.max(1, fontScale);
  const gridTop = spacing.lg + headingHeight + spacing.lg;
  const height = gridTop + rows * buttonHeight + (rows - 1) * spacing.sm + spacing.lg;
  const buttonWidth = (width - spacing.lg * 2 - (columns - 1) * spacing.sm) / columns;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const selection = useRef(0);
  const busy = useRef(false);
  const mounted = useRef(false);
  const baseColor = useSharedValue(colors.background);
  const nextColor = useSharedValue(colors.background);
  const origin = useSharedValue({ x: width / 2, y: height / 2 });
  const radius = useSharedValue(0);
  const clip = useDerivedValue(() =>
    Skia.PathBuilder.Make().addCircle(origin.get().x, origin.get().y, radius.get()).build(),
  );
  const finishTransition = useCallback(() => {
    busy.current = false;
    if (mounted.current) setTransitioning(false);
  }, []);

  useEffect(() => {
    // Resizing, appearance changes and Reduce Motion settle the local preview immediately.
    mounted.current = true;
    cancelAnimation(radius);
    const color = colors[paletteRoles[selection.current].background];
    baseColor.set(color);
    nextColor.set(color);
    radius.set(0);
    return () => {
      mounted.current = false;
      cancelAnimation(radius);
    };
  }, [colors, width, height, rtl, motionEnabled, baseColor, nextColor, radius]);

  function selectTheme(index: number) {
    if (busy.current || selection.current === index) return;
    selection.current = index;
    setSelectedIndex(index);
    const color = colors[paletteRoles[index].background];
    baseColor.set(nextColor.get());
    nextColor.set(color);
    if (!motionEnabled) {
      baseColor.set(color);
      return;
    }

    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = spacing.lg + column * (buttonWidth + spacing.sm) + buttonWidth / 2;
    const y = gridTop + row * (buttonHeight + spacing.sm) + buttonHeight / 2;
    const centerX = rtl ? width - x : x;
    origin.set({ x: centerX, y });
    radius.set(0);
    busy.current = true;
    setTransitioning(true);
    radius.set(
      withTiming(
        Math.hypot(Math.max(centerX, width - centerX), Math.max(y, height - y)),
        { duration: 300, easing: Easing.bezier(0.23, 1, 0.32, 1) },
        (finished) => {
          if (finished) {
            baseColor.set(color);
            radius.set(0);
          }
          scheduleOnRN(finishTransition);
        },
      ),
    );
  }

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-theme-canvas">
      <UniversalTextContent variant="subtitle">
        {t('starter.themeCanvasTitle')}
      </UniversalTextContent>
      <UniversalTextContent tone="muted">{t('starter.themeCanvasHint')}</UniversalTextContent>
      <RNHostView matchContents>
        <View style={{ width, height, borderRadius: radii.card, overflow: 'hidden' }}>
          <Canvas style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false}>
            <Rect x={0} y={0} width={width} height={height} color={baseColor} />
            <Group clip={clip}>
              <Rect x={0} y={0} width={width} height={height} color={nextColor} />
            </Group>
          </Canvas>
          <UniversalHost colorScheme={scheme} viewportHeight={height} ignoreSafeArea="all">
            <Column
              spacing={spacing.lg}
              modifiers={nativeFillWidth}
              style={{ padding: spacing.lg }}
            >
              <Column
                alignment="center"
                modifiers={nativeFillWidth}
                style={{ height: headingHeight }}
              >
                <Spacer flexible size={0} />
                <UniversalTextContent
                  fontSize={32}
                  fontWeight="700"
                  textStyle={{
                    color: colors[paletteRoles[selectedIndex].foreground],
                    textAlign: 'center',
                  }}
                  testID="home-theme-canvas-selection"
                >
                  {t('starter.themeCanvasOption', { number: selectedIndex + 1 })}
                </UniversalTextContent>
                <Spacer flexible size={0} />
              </Column>
              <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
                {Array.from({ length: rows }, (_, row) => (
                  <Row key={row} spacing={spacing.sm} modifiers={nativeFillWidth}>
                    {paletteRoles
                      .slice(row * columns, (row + 1) * columns)
                      .map((palette, column) => {
                        const index = row * columns + column;
                        const selected = index === selectedIndex;
                        return (
                          <Column
                            key={palette.background}
                            modifiers={nativeRowWeight}
                            style={{ height: buttonHeight }}
                          >
                            <UniversalButtonContent
                              variant={selected ? 'secondary' : 'primary'}
                              label={t('starter.themeCanvasOption', { number: index + 1 })}
                              color={colors[selected ? palette.foreground : palette.background]}
                              contentColor={colors[palette.foreground]}
                              contentPadding={spacing.sm}
                              borderRadius={radii.sm}
                              fullWidth
                              disabled={transitioning}
                              onPress={() => selectTheme(index)}
                              testID={`home-theme-canvas-option-${index + 1}`}
                            />
                          </Column>
                        );
                      })}
                  </Row>
                ))}
              </Column>
            </Column>
          </UniversalHost>
        </View>
      </RNHostView>
    </Column>
  );
}
