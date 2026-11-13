import { useAppearanceSettings, type AppearanceTransitionStyle } from '@/context/theme.context';
import { useTranslation } from 'react-i18next';
import { Picker } from '../picker/picker';
import { useAppearanceTransition } from './appearance-transition';

export function AppearanceTransitionControl({
  testID = 'app-settings-appearance-transition-picker',
}: Readonly<{ testID?: string }>) {
  const { t } = useTranslation();
  const { transitionStyle, setTransitionStyle, appearanceReady } = useAppearanceSettings();
  const transition = useAppearanceTransition();
  const enabled = appearanceReady && !transition?.busy;

  return (
    <Picker<AppearanceTransitionStyle>
      selectedValue={transitionStyle}
      onValueChange={(next) => {
        if (enabled && next !== transitionStyle) setTransitionStyle(next);
      }}
      enabled={enabled}
      appearance="menu"
      testID={testID}
    >
      <Picker.Item label={t('settings.transitions.circular')} value="circular" />
      <Picker.Item label={t('settings.transitions.kurohitsugi')} value="kurohitsugi" />
      <Picker.Item label={t('settings.transitions.yhwach')} value="yhwach" />
      <Picker.Item label={t('settings.transitions.dangai')} value="dangai" />
    </Picker>
  );
}
