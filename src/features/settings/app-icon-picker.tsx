import { requireOptionalNativeModule } from 'expo';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ButtonContent,
  CircularCarousel,
  PageScreen,
  PageSection,
  UniversalTextContent as Text,
  type PhotoItem,
} from '@components/ui';
import { screenContentMaxWidth, spacing } from '@/constants/layout';

const iconChoices = ['dark', 'light', 'red'] as const;
type AppIconChoice = (typeof iconChoices)[number];
type AppIconPhoto = PhotoItem & { id: AppIconChoice };

const iconSources = {
  light: require('@assets/AppIcon-Light.icon/Assets/icon.png'),
  dark: require('@assets/AppIcon-Dark.icon/Assets/icon.png'),
  red: require('@assets/AppIcon-Red.icon/Assets/icon.png'),
};

function loadAppIcons(): typeof import('expo-awesome-app-icon') | null {
  if (!requireOptionalNativeModule('AwesomeAppIcon')) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- The package requires a matching native build at import time.
  const icons: typeof import('expo-awesome-app-icon') = require('expo-awesome-app-icon');
  return icons.supportsAlternateIcons() ? icons : null;
}

export function AppIconPicker() {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.max(
    1,
    Math.min(screenContentMaxWidth, windowWidth - insets.left - insets.right) - spacing.lg * 2,
  );
  const itemSize = Math.min(160, width / 2.4);
  const [icons] = useState(loadAppIcons);
  const [iconState, setIconState] = useState(() => icons?.getAppIconState());
  // The carousel starts on its first item; keep this order stable while applying changes.
  const [choices] = useState(() => {
    const available = icons?.getAvailableIcons();
    // Older native builds may not contain every artwork bundled in JavaScript.
    const supported = iconChoices.filter(
      (id) => id === 'dark' || !icons || available?.includes(id),
    );
    const first = supported.find((id) => id === iconState?.selected) ?? 'dark';
    return [first, ...supported.filter((id) => id !== first)];
  });
  const [draft, setDraft] = useState(choices[0]);
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

  const installed = iconChoices.find((id) => id === iconState?.installed) ?? 'dark';
  const isCurrent = !isPending && draft === installed;
  const items: AppIconPhoto[] = choices.map((id) => ({
    id,
    source: iconSources[id],
    label: id === 'red' ? t('settings.appIconRed') : t(`appearance.${id}`),
  }));

  async function applyIcon() {
    if (!icons || changeInFlight.current || isCurrent) return;
    changeInFlight.current = true;
    setChanging(true);
    setFailed(false);
    try {
      const iconName = draft === 'dark' ? null : draft;
      // Apply now: a queued Android selection can stay pending after backgrounding.
      await icons.setAppIcon(iconName);
      const nextState = icons.getAppIconState();
      setIconState(nextState);
      setFailed(nextState.isPending || nextState.installed !== iconName);
    } catch {
      setFailed(true);
    } finally {
      changeInFlight.current = false;
      setChanging(false);
    }
  }

  return (
    <PageScreen title={t('settings.appIcon')} description={t('settings.appIconHint')}>
      <PageSection alignment="center" testID="app-settings-app-icon-page">
        <CircularCarousel
          items={items}
          width={width}
          itemSize={itemSize}
          height={itemSize * 2.4}
          accessibilityLabel={t('settings.appIcon')}
          getPositionLabel={(index) => t('common.selectedValue', { value: items[index].label })}
          onIndexChange={(_, item) => {
            setDraft(item.id);
            setFailed(false);
          }}
          testID="app-settings-app-icon-picker"
        />
        <ButtonContent
          variant="primary"
          label={t(changing ? 'common.wait' : 'settings.appIconApply')}
          disabled={!icons || changing || isCurrent}
          onPress={() => void applyIcon()}
          fullWidth
          testID="app-settings-app-icon-apply"
        />
        {!icons ? (
          <Text tone="muted" testID="app-settings-app-icon-unavailable">
            {t('settings.appIconUnavailable')}
          </Text>
        ) : failed ? (
          <Text tone="error" testID="app-settings-app-icon-error">
            {t('settings.appIconFailed')}
          </Text>
        ) : isPending ? (
          <Text tone="muted" testID="app-settings-app-icon-pending">
            {t('settings.appIconPending')}
          </Text>
        ) : isCurrent ? (
          <Text tone="muted" testID="app-settings-app-icon-current">
            {t('settings.appIconCurrent')}
          </Text>
        ) : null}
      </PageSection>
    </PageScreen>
  );
}
