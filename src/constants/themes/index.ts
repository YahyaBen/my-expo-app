import { altareaDesign, altareaTheme } from './altarea';
import { nativeDesign } from './design';
import { instagramTheme } from './instagram';
import { uxTheme } from './ux';

export const themes = {
  ux: { label: 'UX Template', colors: uxTheme, design: nativeDesign },
  instagram: { label: 'Instagram', colors: instagramTheme, design: nativeDesign },
  altarea: { label: 'Altarea', colors: altareaTheme, design: altareaDesign },
};

export type ThemeId = keyof typeof themes;
export const themeIds = Object.keys(themes) as ThemeId[];
