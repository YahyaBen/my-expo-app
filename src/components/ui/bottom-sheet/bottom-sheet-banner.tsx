import { useThemeColors } from '@/hooks/use-theme';
import { Column, RNHostView, Spacer } from '@expo/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillSize, nativeFillWidth } from '../native/native-fill-width';

export type BottomSheetBannerProps = {
  children?: ReactNode;
  /** Animate only while the sheet is presented and its destination is focused. */
  animate: boolean;
  testID?: string;
};

const bannerHeight = 176;

/** Native banner content shares one isolated RN surface with its decorative mask. */
export function BottomSheetBanner({
  children,
  animate,
  testID = 'bottom-sheet-banner',
}: Readonly<BottomSheetBannerProps>) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column modifiers={nativeFillWidth} style={{ height: bannerHeight }}>
      <RNHostView>
        <View testID={testID} style={[styles.scene, { backgroundColor: colors.surfaceVariant }]}>
          <UniversalHost matchContents={false} ignoreSafeArea="all" style={StyleSheet.absoluteFill}>
            <Column alignment="center" modifiers={nativeFillSize}>
              <Spacer />
              {children}
              <Spacer />
            </Column>
          </UniversalHost>
          {animate ? <ActiveBubbles testID={`${testID}-bubbles`} /> : null}
        </View>
      </RNHostView>
    </Column>
  );
}

function ActiveBubbles({ testID }: Readonly<{ testID: string }>) {
  const BannerBubbles: typeof import('./banner-bubbles').BannerBubbles =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Load Skia only for a visible sheet banner.
    require('./banner-bubbles').BannerBubbles;
  return <BannerBubbles animate testID={testID} />;
}

const styles = StyleSheet.create({
  scene: { flex: 1, overflow: 'hidden', isolation: 'isolate' },
});
