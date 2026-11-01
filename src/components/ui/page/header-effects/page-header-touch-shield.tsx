import { View } from 'react-native';

const claimTouch = () => true;
const keepTouch = () => false;

/** Blocks only this page's header area, independently of other retained pages. */
export function PageHeaderTouchShield({ height }: Readonly<{ height: number }>) {
  return (
    <View
      testID="page-header-touch-shield"
      collapsable={false}
      pointerEvents="box-only"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onStartShouldSetResponder={claimTouch}
      onMoveShouldSetResponder={claimTouch}
      onResponderTerminationRequest={keepTouch}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height,
      }}
    />
  );
}
