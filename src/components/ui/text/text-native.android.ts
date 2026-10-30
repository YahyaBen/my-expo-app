import type { TextProps } from '@expo/ui';

/** Compose already scales font size and line height in native sp units. */
export function useNativeTextStyle(textStyle: TextProps['textStyle'], _preset: boolean) {
  return textStyle;
}
