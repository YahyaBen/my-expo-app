import { Text } from '@expo/ui';
import type { TextProps, UniversalFontWeight } from '@expo/ui';
import type { ThemeTextVariant } from '@/constants/themes/design';
import { useAppTheme } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';

export type UniversalTextVariant = ThemeTextVariant;
export type UniversalTextTone =
  'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type UniversalTextColorScheme = 'light' | 'dark';

export interface UniversalTextProps extends TextProps {
  variant?: UniversalTextVariant;
  /** Semantic foreground from the active theme; independent of typography. */
  tone?: UniversalTextTone;
  fontWeight?: UniversalFontWeight;
  fontSize?: number;
  lightColor?: string;
  darkColor?: string;
  colorScheme?: UniversalTextColorScheme;
}

export function UniversalText({ colorScheme, ...props }: Readonly<UniversalTextProps>) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
    >
      <UniversalTextContent {...props} colorScheme={colorScheme} />
    </UniversalHost>
  );
}

/** Native text for composition inside an existing Host. */
export function UniversalTextContent({
  variant,
  tone = 'default',
  fontWeight,
  fontSize,
  lightColor,
  darkColor,
  colorScheme,
  textStyle,
  ...textProps
}: Readonly<UniversalTextProps>) {
  const activeColorScheme = useHostColorScheme(colorScheme);
  const { colors, design } = useAppTheme(activeColorScheme);
  const preset = variant === undefined ? undefined : design.typography[variant];
  const size = fontSize ?? preset?.fontSize;
  const weight = fontWeight ?? preset?.fontWeight;

  return (
    <Text
      {...textProps}
      textStyle={{
        ...(size === undefined ? {} : { fontSize: size }),
        ...(weight === undefined ? {} : { fontWeight: weight }),
        color:
          (activeColorScheme === 'dark' ? darkColor : lightColor) ??
          colors[tone === 'default' ? 'text' : tone === 'primary' ? 'tint' : tone],
        ...textStyle,
      }}
    />
  );
}
