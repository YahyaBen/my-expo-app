import { DarkTheme, DefaultTheme } from 'expo-router';
import type { AppColorScheme, ColorTokens } from './themes/tokens';

export function navigationTheme(scheme: AppColorScheme, colors: ColorTokens) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.tint,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.divider,
      notification: colors.error,
    },
  };
}
