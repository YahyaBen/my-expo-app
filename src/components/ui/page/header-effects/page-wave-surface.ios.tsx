import { Mask, Rectangle, RNHostView } from '@expo/ui/swift-ui';
import { background, foregroundStyle, frame, shapes } from '@expo/ui/swift-ui/modifiers';
import { View } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { G, Path, type GProps, type PathProps } from 'react-native-svg';
import { UniversalHost } from '../../host/universal-host';
import type { PageWaveSurfaceProps } from './page-wave-surface.types';
import { vectorPathToSvg } from './page-header-shapes';

const AnimatedGroup = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// SVG exposes transform publicly but its native view receives a six-value matrix.
function svgMatrixAdapter(props: Record<string, unknown>) {
  'worklet';
  if ('transform' in props) {
    props.matrix = props.transform;
    delete props.transform;
  }
}

/** Keep both the material and its mask in SwiftUI; masking an ancestor of Expo Blur breaks UIKit blur. */
export function PageWaveSurface({
  wave,
  colorScheme,
  backgroundColor,
  reduceTransparency,
}: Readonly<PageWaveSurfaceProps>) {
  // Serialize only where SVG is rendered; Android and launch edges keep numeric paths.
  const frontPathProps = useAnimatedProps<PathProps>(() => ({
    d: vectorPathToSvg(wave.frontContour.get()),
  }));
  const backPathProps = useAnimatedProps<PathProps>(() => ({
    d: vectorPathToSvg(wave.backContour.get()),
  }));
  const transformProps = useAnimatedProps<GProps>(
    () => {
      const scaleX = wave.scaleX.get();
      return {
        transform: [scaleX, 0, 0, wave.scaleY, scaleX * wave.translateX, 0],
      };
    },
    undefined,
    svgMatrixAdapter,
  );
  const bounds = [frame({ height: wave.height }), frame({ maxWidth: Infinity })];

  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      testID="page-wave-blur-mask"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: wave.height }}
    >
      <Mask alignment="topLeading" modifiers={bounds}>
        <Rectangle
          testID={reduceTransparency ? 'page-header-solid-background' : 'page-header-blur'}
          modifiers={[
            ...bounds,
            foregroundStyle('transparent'),
            background(
              reduceTransparency ? backgroundColor : { type: 'material', material: 'ultraThin' },
              shapes.rectangle(),
            ),
          ]}
        />
        <Mask.Content>
          <RNHostView>
            <View style={{ width: '100%', height: wave.height }} pointerEvents="none">
              <Svg width="100%" height={wave.height}>
                <AnimatedGroup animatedProps={transformProps}>
                  <AnimatedPath animatedProps={backPathProps} fill="black" />
                  <AnimatedPath animatedProps={frontPathProps} fill="black" />
                </AnimatedGroup>
              </Svg>
            </View>
          </RNHostView>
        </Mask.Content>
      </Mask>
    </UniversalHost>
  );
}
