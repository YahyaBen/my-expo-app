import { DarkTheme, DefaultTheme } from 'expo-router';
import type { AppColorScheme, ColorTokens } from './themes/tokens';

export function navigationTheme(scheme: AppColorScheme, colors: ColorTokens) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.tint ?? base.colors.primary,
      background: colors.background ?? base.colors.background,
      card: colors.background ?? base.colors.card,
      text: colors.text ?? base.colors.text,
      border: colors.divider ?? base.colors.border,
      notification: colors.error ?? base.colors.notification,
    },
  };
}
