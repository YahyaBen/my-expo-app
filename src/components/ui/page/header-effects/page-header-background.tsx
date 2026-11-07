import { useContext, useEffect, useState, type RefObject } from 'react';
import { BlurView } from 'expo-blur';
import { AccessibilityInfo, Platform, View, type ViewInstance } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../../host/universal-host';
import { PageMotionContext } from './page-motion-context';
import { PageHeaderArtwork } from './page-header-artwork';
import { pageBlurProps } from './page-blur';
import { usePageBlurKey } from './use-page-blur-key';

/** Native backdrop only; the title and back control remain above the blur. */
export function PageHeaderBackground({
  blurTarget,
  colorScheme,
  height = 0,
  blur = true,
}: Readonly<{
  blurTarget: RefObject<ViewInstance | null>;
  colorScheme?: 'light' | 'dark';
  height?: number;
  blur?: boolean;
}>) {
  const motion = useContext(PageMotionContext);
  const scheme = useHostColorScheme(colorScheme ?? motion?.colorScheme);
  const colors = useThemeColors(scheme);
  const blurKey = usePageBlurKey();
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let active = true;
    let changed = false;
    const update = (value: boolean) => {
      changed = true;
      if (active) setReduceTransparency(value);
    };
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', update);
    void AccessibilityInfo.isReduceTransparencyEnabled()
      .then((value) => {
        if (active && !changed) setReduceTransparency(value);
      })
      .catch(() => {});
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  let backdrop = null;
  if (blur && (!motion || !motion.visible)) {
    const style = { position: 'absolute' as const, top: 0, left: 0, right: 0, height };
    backdrop = reduceTransparency ? (
      <View
        key={blurKey}
        testID="page-header-solid-background"
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ ...style, backgroundColor: colors.background }}
      />
    ) : (
      <BlurView
        key={blurKey}
        {...pageBlurProps(scheme)}
        testID="page-header-blur"
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        blurTarget={blurTarget}
        style={style}
      />
    );
  }

  return (
    <>
      {backdrop}
      {motion ? (
        <PageHeaderArtwork
          motion={motion}
          height={height}
          blur={blur}
          blurKey={blurKey}
          blurTarget={blurTarget}
          colorScheme={scheme}
          backgroundColor={colors.background}
          reduceTransparency={reduceTransparency}
        />
      ) : null}
    </>
  );
}
