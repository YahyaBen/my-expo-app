import { wireframeDesign } from './design';
import { uxTheme } from './ux';

export const themes = {
  ux: { label: 'UX Template', colors: uxTheme, design: wireframeDesign },
};

export type ThemeId = keyof typeof themes;
export const themeIds = Object.keys(themes) as ThemeId[];
