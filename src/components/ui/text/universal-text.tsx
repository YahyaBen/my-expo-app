import { Text } from '@expo/ui';
import type { TextProps, UniversalFontWeight } from '@expo/ui';
import type { ThemeTextVariant } from '@/constants/themes/design';
import { useAppTheme } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { useNativeTextStyle } from './text-native';

export type UniversalTextVariant = ThemeTextVariant;
export type UniversalTextTone =
  | 'default'
  | 'muted'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
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
  const size = textStyle?.fontSize ?? fontSize ?? preset?.fontSize;
  const weight = fontWeight ?? preset?.fontWeight;
  const colorRole =
    tone === 'default'
      ? 'text'
      : tone === 'primary'
        ? 'tint'
        : tone === 'disabled'
          ? 'textDisabled'
          : tone;
  const resolvedTextStyle = useNativeTextStyle(
    {
      ...(preset && size !== undefined
        ? { lineHeight: preset.lineHeight * (size / preset.fontSize) }
        : {}),
      ...(size === undefined ? {} : { fontSize: size }),
      ...(weight === undefined ? {} : { fontWeight: weight }),
      color: (activeColorScheme === 'dark' ? darkColor : lightColor) ?? colors[colorRole],
      ...textStyle,
    },
    preset !== undefined,
  );

  return <Text {...textProps} textStyle={resolvedTextStyle} />;
}
