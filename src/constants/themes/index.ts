import { nativeDesign } from './design';
import { systemTheme } from './system';
import { uxTheme } from './ux';

export const themes = {
  ux: { label: 'UX Template', colors: uxTheme, design: nativeDesign },
  system: { label: 'System', colors: systemTheme, design: nativeDesign },
};

export type ThemeId = keyof typeof themes;
export const themeIds = Object.keys(themes) as ThemeId[];
