import type { ThemeDesign } from './design';
import {
  createColorTokens,
  feedbackColors,
  type SemanticColors,
  type ThemePalette,
} from './tokens';

// Website foundations observed 2026-10-23: #502882, #AA3787, #F6F5F3,
// #EBEBE8, #D4D4D4, black and white. Dark appearance and state roles are mobile adaptations.
const palette = {
  light: {
    ...feedbackColors.light,
    primary: '#502882',
    primaryPressed: '#3C1E62',
    primaryContainer: '#EFE8F6',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#3C1E62',
    secondary: '#AA3787',
    secondaryContainer: '#F9EAF5',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#681E52',
    background: '#FFFFFF',
    surface: '#F6F5F3',
    surfaceRaised: '#FFFFFF',
    surfaceVariant: '#EBEBE8',
    text: '#000000',
    muted: '#62605E',
    border: '#85817E',
    divider: '#D4D4D4',
    tint: '#502882',
    selection: '#EFE8F6',
    overlay: '#17121F99',
    shadow: '#000000',
    info: '#006D8F',
    actionGradientEnd: '#502882',
  },
  dark: {
    ...feedbackColors.dark,
    primary: '#D4B5F4',
    primaryPressed: '#C39AE9',
    primaryContainer: '#3C2356',
    onPrimary: '#27123F',
    onPrimaryContainer: '#F0DFFF',
    secondary: '#ED9BD3',
    secondaryContainer: '#4B2341',
    onSecondary: '#3D0C2E',
    onSecondaryContainer: '#FFD8F1',
    background: '#17121F',
    surface: '#211A2B',
    surfaceRaised: '#2B2236',
    surfaceVariant: '#3D304A',
    text: '#FAF7FD',
    muted: '#C6BFD0',
    border: '#8F819F',
    divider: '#4A3D57',
    tint: '#D4B5F4',
    selection: '#3C2356',
    overlay: '#000000B3',
    shadow: '#000000',
    error: '#FF9BA8',
    success: '#9DDBB4',
    warning: '#F3CC77',
    info: '#8FD7F5',
    actionGradientEnd: '#D4B5F4',
  },
} satisfies Record<'light' | 'dark', SemanticColors>;

export const altareaTheme: ThemePalette = {
  light: createColorTokens(palette.light),
  dark: createColorTokens(palette.dark),
};

/** Mobile type ramp inspired by the site's fluid headings and 18px body. */
export const altareaDesign: ThemeDesign = {
  typography: {
    heading: { fontSize: 36, fontWeight: '700' },
    title: { fontSize: 30, fontWeight: '700' },
    subtitle: { fontSize: 22, fontWeight: '600' },
    body: { fontSize: 18, fontWeight: '400' },
    label: { fontSize: 16, fontWeight: '600' },
    caption: { fontSize: 13, fontWeight: '400' },
  },
  shape: { buttonRadius: 24, inputRadius: 6 },
};
