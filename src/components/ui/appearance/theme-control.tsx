import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { themes, themeIds, type ThemeId } from '@/constants/themes/index';
import { usePaletteSettings } from '@/context/theme.context';
import { Picker, type PickerLayout } from '../picker/picker';
import { useAppearanceTransition } from './appearance-transition';

export function ThemeControl({
  testID = 'app-settings-theme-picker',
}: Readonly<{ testID?: string }>) {
  const { t } = useTranslation();
  const { themeId, setThemeId, themeSelectionEnabled } = usePaletteSettings();
  const transition = useAppearanceTransition();
  const origin = useRef<PickerLayout | null>(null);
  const changing = transition?.busy;
  return (
    <Picker<ThemeId>
      selectedValue={themeId}
      onValueChange={(next) => {
        if (!themeSelectionEnabled || changing || next === themeId) return;
        if (transition) {
          transition.run(() => setThemeId(next), origin.current, false);
        } else {
          setThemeId(next);
        }
      }}
      onLayoutChange={(layout) => {
        origin.current = layout;
      }}
      enabled={themeSelectionEnabled && !changing}
      appearance="menu"
      testID={testID}
    >
      {themeIds.map((id) => (
        <Picker.Item
          key={id}
          label={id === 'system' ? t('common.systemMode') : themes[id].label}
          value={id}
        />
      ))}
    </Picker>
  );
}
