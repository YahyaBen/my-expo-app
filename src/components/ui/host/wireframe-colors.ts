import type { MaterialColors } from '@expo/ui/jetpack-compose';
import type { AppColorScheme } from '@/constants/themes/tokens';
import { uxColors } from '@/constants/themes/ux';

/** A neutral seed still generates chromatic Material roles; set every role explicitly. */
function materialColors(scheme: AppColorScheme): MaterialColors {
  const colors = uxColors[scheme];
  const fixed = uxColors.light;
  return {
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primaryContainer,
    onPrimaryContainer: colors.onPrimaryContainer,
    inversePrimary: colors.onPrimary,
    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondaryContainer: colors.onSecondaryContainer,
    tertiary: colors.secondary,
    onTertiary: colors.onSecondary,
    tertiaryContainer: colors.secondaryContainer,
    onTertiaryContainer: colors.onSecondaryContainer,
    background: colors.background,
    onBackground: colors.text,
    surface: colors.surface,
    onSurface: colors.text,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.muted,
    surfaceTint: colors.tint,
    inverseSurface: colors.text,
    inverseOnSurface: colors.background,
    error: colors.error,
    onError: colors.onError,
    errorContainer: colors.errorContainer,
    onErrorContainer: colors.text,
    outline: colors.border,
    outlineVariant: colors.divider,
    scrim: colors.shadow,
    surfaceBright: scheme === 'light' ? colors.surfaceRaised : colors.surfaceVariant,
    surfaceDim: scheme === 'light' ? colors.surfaceVariant : colors.background,
    surfaceContainer: colors.surface,
    surfaceContainerHigh: colors.surfaceRaised,
    surfaceContainerHighest: colors.surfaceVariant,
    surfaceContainerLow: colors.surface,
    surfaceContainerLowest: colors.background,
    primaryFixed: fixed.primaryContainer,
    primaryFixedDim: uxColors.dark.secondary,
    onPrimaryFixed: fixed.text,
    onPrimaryFixedVariant: fixed.secondary,
    secondaryFixed: fixed.secondaryContainer,
    secondaryFixedDim: fixed.primaryContainer,
    onSecondaryFixed: fixed.text,
    onSecondaryFixedVariant: fixed.secondary,
    tertiaryFixed: fixed.secondaryContainer,
    tertiaryFixedDim: fixed.primaryContainer,
    onTertiaryFixed: fixed.text,
    onTertiaryFixedVariant: fixed.secondary,
  };
}

// Shared by all Hosts; appearance changes select an existing immutable palette.
export const wireframeHostTheme = {
  light: { colorOverrides: materialColors('light') },
  dark: { colorOverrides: materialColors('dark') },
};
