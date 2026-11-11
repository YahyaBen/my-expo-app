import type { EdgeInsets } from 'react-native-safe-area-context';

/** Keep content centered when a landscape cutout protects only one side. */
export function horizontalSafeAreaInset(insets: Pick<EdgeInsets, 'left' | 'right'>) {
  return Math.max(insets.left, insets.right);
}

export function screenInsets(
  insets: EdgeInsets,
  { headerShown = false, tabBarShown = false } = {},
) {
  return {
    paddingTop: headerShown ? 0 : insets.top,
    paddingBottom: tabBarShown ? 0 : undefined,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };
}
