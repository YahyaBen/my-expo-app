import { themeIds, themes, type ThemeId } from '@/constants/themes/index';
import { usePaletteSettings } from '@/context/theme.context';
import { Picker } from '@components/ui';

export function ThemePicker() {
  const { themeId, setThemeId } = usePaletteSettings();
  return (
    <Picker<ThemeId>
      selectedValue={themeId}
      onValueChange={setThemeId}
      appearance="menu"
      testID="demo-text-theme-picker"
    >
      {themeIds.map((id) => (
        <Picker.Item key={id} label={themes[id].label} value={id} />
      ))}
    </Picker>
  );
}
