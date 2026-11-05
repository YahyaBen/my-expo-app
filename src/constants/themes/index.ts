import { nativeDesign } from './design';
import { uxTheme } from './ux';

export const themes = {
  ux: { label: 'UX Template', colors: uxTheme, design: nativeDesign },
};

export type ThemeId = keyof typeof themes;
export const themeIds = Object.keys(themes) as ThemeId[];
