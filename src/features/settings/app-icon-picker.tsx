import { requireOptionalNativeModule } from 'expo';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Platform } from 'react-native';
import {
  Column,
  nativeFillWidth,
  nativeRowWeight,
  Picker,
  Row,
  UniversalTextContent as Text,
} from '@components/ui';
import { spacing } from '@/constants/layout';

type AppIconChoice = 'light' | 'dark';

function loadAppIcons(): typeof import('expo-awesome-app-icon') | null {
  if (!requireOptionalNativeModule('AwesomeAppIcon')) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- The package requires a matching native build at import time.
  const icons: typeof import('expo-awesome-app-icon') = require('expo-awesome-app-icon');
  return icons.supportsAlternateIcons() && icons.getAvailableIcons().includes('light')
    ? icons
    : null;
}

export function AppIconPicker() {
  const { t } = useTranslation();
  const [icons] = useState(loadAppIcons);
  const [iconState, setIconState] = useState(() => icons?.getAppIconState());
  const [changing, setChanging] = useState(false);
  const [failed, setFailed] = useState(false);
  const changeInFlight = useRef(false);
  const isPending = iconState?.isPending === true;

  useEffect(() => {
    if (!icons || !isPending) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setIconState(icons.getAppIconState());
    });
    return () => subscription.remove();
  }, [icons, isPending]);

  if (!icons) return null;
  const selected = iconState?.selected === 'light' ? 'light' : 'dark';

  async function changeIcon(value: AppIconChoice) {
    if (!icons || changeInFlight.current || value === selected) return;
    changeInFlight.current = true;
    setChanging(true);
    setFailed(false);
    try {
      await icons.setAppIcon(value === 'light' ? 'light' : null, {
        deferUntilBackground: Platform.OS === 'android',
      });
      setIconState(icons.getAppIconState());
    } catch {
      setFailed(true);
    } finally {
      changeInFlight.current = false;
      setChanging(false);
    }
  }

  return (
    <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
      <Row alignment="center" spacing={spacing.lg} modifiers={nativeFillWidth}>
        <Column modifiers={Platform.OS === 'ios' ? nativeFillWidth : nativeRowWeight}>
          <Text>{t('settings.appIcon')}</Text>
        </Column>
        <Picker<AppIconChoice>
          selectedValue={selected}
          onValueChange={(value) => void changeIcon(value)}
          enabled={!changing}
          testID="app-settings-app-icon-picker"
        >
          <Picker.Item label={t('appearance.light')} value="light" />
          <Picker.Item label={t('appearance.dark')} value="dark" />
        </Picker>
      </Row>
      {failed ? (
        <Text tone="error" testID="app-settings-app-icon-error">
          {t('settings.appIconFailed')}
        </Text>
      ) : isPending ? (
        <Text tone="muted" testID="app-settings-app-icon-pending">
          {t('settings.appIconPending')}
        </Text>
      ) : null}
    </Column>
  );
}
