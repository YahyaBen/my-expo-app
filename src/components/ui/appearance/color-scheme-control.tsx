import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useAppearanceSettings, type ColorSchemePreference } from '@/context/theme.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Picker, type PickerLayout } from '../picker/picker';
import { useAppearanceTransition } from './appearance-transition';

export function ColorSchemeControl({
  testID = 'app-settings-color-scheme-picker',
  onValueChange,
  disabled = false,
}: Readonly<{
  testID?: string;
  onValueChange?: (scheme: ColorSchemePreference) => void;
  disabled?: boolean;
}>) {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme, appearanceReady } = useAppearanceSettings();
  const scheme = useColorScheme();
  const transition = useAppearanceTransition();
  const origin = useRef<PickerLayout | null>(null);
  const changing = !onValueChange && transition?.busy;
  return (
    <Picker<ColorSchemePreference>
      selectedValue={colorScheme}
      onValueChange={(next) => {
        if (!appearanceReady || disabled || changing) return;
        if (onValueChange) {
          onValueChange(next);
        } else if (next === colorScheme) {
          return;
        } else if (transition && next !== scheme) {
          transition.run(() => setColorScheme(next), origin.current, scheme === 'light');
        } else {
          setColorScheme(next);
        }
      }}
      onLayoutChange={(layout) => {
        origin.current = layout;
      }}
      appearance="menu"
      enabled={appearanceReady && !disabled && !changing}
      testID={testID}
    >
      <Picker.Item label={t('common.systemMode')} value="system" />
      <Picker.Item label={t('common.lightMode')} value="light" />
      <Picker.Item label={t('common.darkMode')} value="dark" />
    </Picker>
  );
}
