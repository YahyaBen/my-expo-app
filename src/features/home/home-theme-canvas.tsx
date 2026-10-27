import { useTranslation } from 'react-i18next';
import {
  ColorSchemeCanvas,
  Column,
  Switch,
  UniversalTextContent,
  nativeFillWidth,
  useHostColorScheme,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useThemeSettings } from '@/context/theme.context';

export function HomeThemeCanvas() {
  const { t } = useTranslation();
  const dark = useHostColorScheme() === 'dark';
  const { setColorScheme, appearanceReady } = useThemeSettings();

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-theme-canvas">
      <UniversalTextContent variant="subtitle">
        {t('starter.themeCanvasTitle')}
      </UniversalTextContent>
      <UniversalTextContent tone="muted">{t('starter.themeCanvasHint')}</UniversalTextContent>
      <Switch
        label={t('common.darkMode')}
        value={dark}
        onValueChange={(enabled) => setColorScheme(enabled ? 'dark' : 'light')}
        disabled={!appearanceReady}
        testID="home-theme-canvas-switch"
      />
      <ColorSchemeCanvas testID="home-theme-canvas-artwork" />
    </Column>
  );
}
