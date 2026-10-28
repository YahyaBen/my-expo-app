import type { EdgeInsets } from 'react-native-safe-area-context';

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
