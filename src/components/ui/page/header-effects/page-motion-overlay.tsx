import { useAppTheme, useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path, vec } from '@shopify/react-native-skia';
import { useLayoutEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PageWaveContext, type PageWaveContextValue } from './page-wave-context';
import { usePageWaveMotion } from './use-page-wave-motion';
import type { PageHeaderShape, PageHeaderStyle } from '@/constants/header-motion';

export type { PageHeaderShape, PageHeaderStyle } from '@/constants/header-motion';

type PageMotionOverlayProps = {
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  shape?: PageHeaderStyle;
  children?: ReactNode;
  visible?: boolean;
};

/** Optional header decoration; changing styles preserves navigation and content identity. */
export function PageMotionOverlay({
  children,
  shape,
  visible = true,
  ...props
}: Readonly<PageMotionOverlayProps>) {
  const { design } = useAppTheme(props.colorScheme);
  const [motion, setMotion] = useState<PageWaveContextValue | null>(null);
  const waves = design.header.artwork && shape !== 'default';

  return (
    <PageWaveContext.Provider value={waves && visible ? motion : null}>
      <View style={{ flex: 1 }}>
        {children}
        {waves ? (
          <PageMotionArtwork {...props} shape={shape} visible={visible} onMotion={setMotion} />
        ) : null}
      </View>
    </PageWaveContext.Provider>
  );
}

function PageMotionArtwork({
  animate = true,
  colorScheme,
  shape,
  visible,
  onMotion,
}: Readonly<{
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  shape?: PageHeaderShape;
  visible: boolean;
  onMotion: (motion: PageWaveContextValue | null) => void;
}>) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const { context, detailPath, width } = usePageWaveMotion(animate && visible, shape);
  useLayoutEffect(() => {
    onMotion(context);
    return () => onMotion(null);
  }, [context, onMotion]);
  const { wave } = context;
  const gradientStart = vec(0, 0);
  const gradientEnd = vec(0, 100);
  const overlayColors = [colors.tint, `${colors.tint}CC`];

  return visible ? (
    <View
      testID="page-motion-overlay"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      onLayout={({ nativeEvent }) => width.set(nativeEvent.layout.width)}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: wave.height }}
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Group transform={wave.transform}>
          <Path path={wave.backPath} opacity={scheme === 'dark' ? 0.12 : 0.08}>
            <LinearGradient start={gradientStart} end={gradientEnd} colors={overlayColors} />
          </Path>
          <Path path={wave.frontPath} opacity={scheme === 'dark' ? 0.2 : 0.12}>
            <LinearGradient start={gradientStart} end={gradientEnd} colors={overlayColors} />
          </Path>
          <Path
            path={wave.frontPath}
            color={colors.tint}
            opacity={scheme === 'dark' ? 0.22 : 0.12}
            style="stroke"
            strokeWidth={1}
          />
          <Path path={detailPath} color={colors.tint} opacity={0.28} />
        </Group>
      </Canvas>
    </View>
  ) : null;
}
