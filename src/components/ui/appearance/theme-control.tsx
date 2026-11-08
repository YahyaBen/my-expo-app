import { useTranslation } from 'react-i18next';
import { themes, themeIds, type ThemeId } from '@/constants/themes/index';
import { usePaletteSettings } from '@/context/theme.context';
import { Picker } from '../picker/picker';

export function ThemeControl({
  testID = 'app-settings-theme-picker',
}: Readonly<{ testID?: string }>) {
  const { t } = useTranslation();
  const { themeId, setThemeId, themeSelectionEnabled } = usePaletteSettings();
  return (
    <Picker<ThemeId>
      selectedValue={themeId}
      onValueChange={setThemeId}
      enabled={themeSelectionEnabled}
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
