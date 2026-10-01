import { Host, Text } from '@expo/ui';
import type { TextProps, UniversalFontWeight } from '@expo/ui';
import { useColorScheme } from 'react-native';

export type UniversalTextVariant = 'heading' | 'title' | 'body' | 'caption';
export type UniversalTextColorScheme = 'light' | 'dark';

export interface UniversalTextProps extends TextProps {
  variant?: UniversalTextVariant;
  fontWeight?: UniversalFontWeight;
  fontSize?: number;
  lightColor?: string;
  darkColor?: string;
  colorScheme?: UniversalTextColorScheme;
}

const variants: Record<UniversalTextVariant, { fontSize: number; fontWeight: UniversalFontWeight }> = {
  heading: { fontSize: 36, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
};

export function UniversalText({
  variant = 'body',
  fontWeight,
  fontSize,
  lightColor = '#173C65',
  darkColor = '#DBEDF4',
  colorScheme,
  textStyle,
  ...textProps
}: UniversalTextProps) {
  const systemColorScheme = useColorScheme();
  const activeColorScheme = colorScheme ?? systemColorScheme ?? 'light';
  const preset = variants[variant];
  const resolvedFontSize = fontSize ?? preset.fontSize;

  return (
    <Host matchContents={{ vertical: true }} colorScheme={activeColorScheme} style={{ width: '100%' }}>
      <Text
        {...textProps}
        textStyle={{
          fontSize: resolvedFontSize,
          fontWeight: fontWeight ?? preset.fontWeight,
          lineHeight: Math.round(resolvedFontSize * 1.25),
          color: activeColorScheme === 'dark' ? darkColor : lightColor,
          ...textStyle,
        }}
      />
    </Host>
  );
}
