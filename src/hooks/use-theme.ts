import { themes } from '@/constants/themes/index';
import { useThemePreferences } from '@/context/theme.context';
import { useColorScheme } from './use-color-scheme';

export function useAppTheme(preferredScheme?: 'light' | 'dark') {
  const preferences = useThemePreferences();
  const scheme = useColorScheme(preferredScheme);
  const themeId = preferences?.themeId ?? 'ux';
  const theme = themes[themeId];
  return { themeId, scheme, colors: theme.colors[scheme], design: theme.design };
}

export function useThemeColors(preferredScheme?: 'light' | 'dark') {
  return useAppTheme(preferredScheme).colors;
}
