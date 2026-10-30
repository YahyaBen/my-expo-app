export type AppColorScheme = 'light' | 'dark';

/** Every brand defines the same semantic roles in both appearances. */
export interface SemanticColors {
  /** Filled action surface; foreground text uses tint instead. */
  primary: string;
  primaryPressed: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceVariant: string;
  text: string;
  muted: string;
  /** Unavailable content only; ordinary secondary text uses muted. */
  textDisabled: string;
  border: string;
  divider: string;
  /** Foreground accent for primary text, links and native tint. */
  tint: string;
  selection: string;
  overlay: string;
  shadow: string;
  error: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;
  success: string;
  successContainer: string;
  onSuccess: string;
  warning: string;
  warningContainer: string;
  onWarning: string;
  info: string;
  infoContainer: string;
  onInfo: string;
  actionGradientEnd: string;
}

/** Derived roles stay in sync when a brand changes its semantic palette. */
export function createColorTokens(colors: SemanticColors) {
  return {
    ...colors,
    tabIconDefault: colors.muted,
    tabIconSelected: colors.tint,
    tabBarBackground: colors.surfaceRaised,
    tabBarActive: colors.tint,
    tabBarInactive: colors.muted,
    tabBarSelectedBackground: colors.secondaryContainer,
    tabBarBorder: colors.divider,
    tabBarGradientStart: colors.secondaryContainer,
    tabBarGradientEnd: colors.surface,
    tabBarHighlight: `${colors.tint}38`,
    tabBarHighlightClear: `${colors.tint}00`,
    tabBarGlassTint: `${colors.surfaceRaised}D9`,
    tabBarGlassBorder: colors.border,
    tabBarGlassBackdrop: colors.surface,
    tabBarGlassHighlight: `${colors.text}14`,
    tabBarGlassMidHighlight: `${colors.text}08`,
    tabBarGlassClear: `${colors.surfaceRaised}00`,
    tabBarShadow: colors.shadow,
    switchTrackOn: colors.tint,
    switchThumbOn: colors.onPrimary,
    switchTrackOff: colors.surfaceVariant,
    switchThumbOff: colors.muted,
    switchBorderOff: colors.muted,
    switchTrackDisabledOn: `${colors.tint}33`,
    switchThumbDisabledOn: `${colors.text}61`,
    switchTrackDisabledOff: `${colors.text}1F`,
    switchThumbDisabledOff: `${colors.text}61`,
    switchBorderDisabledOff: `${colors.text}1F`,
    controlActive: colors.tint,
    controlOnActive: colors.onPrimary,
    controlSelected: colors.selection,
    controlOnSelected: colors.text,
    controlSurface: colors.surfaceRaised,
    controlTrack: colors.surfaceVariant,
    controlBorder: colors.border,
    controlDisabledContent: colors.textDisabled,
    controlDisabledSurface: colors.surface,
    controlDisabledActive: `${colors.tint}33`,
  };
}

export type ColorTokens = ReturnType<typeof createColorTokens>;
export type ThemePalette = Record<AppColorScheme, ColorTokens>;
