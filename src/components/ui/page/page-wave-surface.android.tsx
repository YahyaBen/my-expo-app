import { MaskedView } from '@expo/ui/community/masked-view';
import { Canvas, Group, Path } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import type { PageWaveSurfaceProps } from './page-wave-surface.types';
import { pageBlurProps } from './page-blur';

export function PageWaveSurface({ wave, blurTarget, colorScheme }: PageWaveSurfaceProps) {
  return (
    <MaskedView
      testID="page-wave-blur-mask"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: wave.overlayHeight }}
      maskElement={
        <Canvas pointerEvents="none" style={{ flex: 1 }}>
          <Group transform={wave.fit}>
            <Group transform={wave.backDrift}>
              <Path path={wave.backWave} color="black" />
            </Group>
            <Group transform={wave.frontDrift}>
              <Path path={wave.frontWave} color="black" />
            </Group>
          </Group>
        </Canvas>
      }
    >
      <BlurView
        {...pageBlurProps(colorScheme)}
        testID="page-header-blur"
        pointerEvents="none"
        blurTarget={blurTarget}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
}
