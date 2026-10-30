import type { TextProps } from '@expo/ui';
import { useWindowDimensions } from 'react-native';

/** Universal Text uses fixed SwiftUI font sizes; scale opted-in presets once. */
export function useNativeTextStyle(textStyle: TextProps['textStyle'], preset: boolean) {
  const { fontScale } = useWindowDimensions();
  if (!preset || !textStyle) return textStyle;
  return {
    ...textStyle,
    fontSize: textStyle.fontSize === undefined ? undefined : textStyle.fontSize * fontScale,
    lineHeight: textStyle.lineHeight === undefined ? undefined : textStyle.lineHeight * fontScale,
  };
}
