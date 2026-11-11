import { getBrandHeadingFont } from '@/config/brand-assets';
import { spacing, tabBarRaisedHeight } from '@/constants/layout';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useMotionSettings } from '@/context/theme.context';
import { useAppUpdates } from '@/features/updates/app-updates';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useAppTheme } from '@/hooks/use-theme';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import {
  BottomSheet,
  ColorSchemeControl,
  Column,
  FieldGroup,
  Icon,
  ListItem,
  nativeFillSize,
  nativeFillWidth,
  pageFormModifiers,
  PageScreen,
  PageSection,
  Row,
  Switch,
  UniversalTextContent as Text,
  ThemeControl,
  usePageHeaderInset,
} from '@components/ui';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, useWindowDimensions } from 'react-native';
import { PushTokenField } from './push-token-field';
import { SettingsPickerRow } from './settings-picker-row';
import { useDeviceLocation } from './use-device-location';
import { useDevicePermissions } from './use-device-permissions';

const languageKeys: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};
const languageLabel = (language: Language) => i18n.getFixedT(language)(languageKeys[language]);

export default function SettingsScreen({
  allowAppIconChange = false,
  tab = false,
  onBack,
}: Readonly<{ allowAppIconChange?: boolean; tab?: boolean; onBack?: () => void }>) {
  const { language, setLanguage, ready } = useLanguage();
  return (
    <SettingsPage
      language={language}
      onLanguageChange={setLanguage}
      languageReady={ready}
      allowAppIconChange={allowAppIconChange}
      tab={tab}
      onBack={onBack}
    />
  );
}

/** Native settings content receives language state from the existing owner. */
function SettingsPage({
  language,
  onLanguageChange,
  languageReady,
  allowAppIconChange,
  onBack,
  tab,
}: Readonly<{
  language: Language;
  onLanguageChange?: (language: Language) => void;
  languageReady: boolean;
  allowAppIconChange: boolean;
  onBack?: () => void;
  tab: boolean;
}>) {
  const { t } = useTranslation();
  const direction = useLayoutDirection();
  const { colors } = useAppTheme();
  const { width, height: windowHeight, fontScale } = useWindowDimensions();
  const stackPickers = Platform.OS === 'android' && (width < 360 || fontScale > 1.2);
  const languageListHeight = Math.min(320, windowHeight * 0.45);
  const changeLanguage = languageReady ? onLanguageChange : undefined;
  const [languageOpen, setLanguageOpen] = useState(false);
  const device = useDevicePermissions();
  const location = useDeviceLocation(device.permissions.location);
  const updates = useAppUpdates();
  const updatesDisabled = updates?.pending !== null;
  const updateCheckDisabled =
    updatesDisabled ||
    (updates?.otaStatus === 'unavailable' && updates.storeStatus === 'unavailable');
  const permissionActionPending = device.pending !== null || location.pending;
  const deviceControlsDisabled = !device.ready || permissionActionPending;
  const locationRequestDisabled = permissionActionPending || !location.enabled;
  const locationBlocked =
    location.permission?.canAskAgain === false && !location.permission.granted;
  const locationStatus = !location.enabled
    ? 'disabledInApp'
    : location.servicesEnabled === false
      ? 'servicesOff'
      : location.permission?.granted
        ? 'allowed'
        : location.permission?.status === 'denied'
          ? 'denied'
          : 'notRequested';
  const chevron = (
    <Icon
      name={Icon.select({
        ios: 'chevron.forward',
        android: 'chevron_right',
      })}
      size={18}
      color={colors.muted}
    />
  );
  // Native section footers keep the final row clear of the shared raised tab action.
  const tabFooter = tab ? (
    <FieldGroup.SectionFooter>
      <Column style={{ height: tabBarRaisedHeight }} testID="app-settings-tab-clearance" />
    </FieldGroup.SectionFooter>
  ) : null;
  return (
    <PageScreen
      tab={tab}
      title={t('settings.title')}
      onBack={onBack}
      showBack={!!onBack}
      scrollable={false}
    >
      <Column spacing={0} modifiers={nativeFillSize} testID="app-settings-viewport">
        <Column spacing={0} modifiers={nativeFillSize} testID="app-settings-content">
          <FieldGroup
            // Recreate only the native form when direction flips; retain preference state above it.
            key={Platform.OS === 'ios' ? direction : undefined}
            modifiers={pageFormModifiers}
            style={{ backgroundColor: 'transparent' }}
            testID="app-settings-groups"
          >
            <FieldGroup.Section
              title={t('settings.appearance')}
              titleUppercase
              testID="app-settings-appearance"
            >
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading
                  label={t('settings.appearance')}
                  language={language}
                  first
                />
              </FieldGroup.SectionHeader>
              <SettingsPickerRow label={t('common.theme')} stacked={stackPickers}>
                <ThemeControl />
              </SettingsPickerRow>
              <SettingsPickerRow label={t('common.colorScheme')} stacked={stackPickers}>
                <ColorSchemeControl testID="app-settings-color-scheme-picker" />
              </SettingsPickerRow>
              {allowAppIconChange ? (
                <ListItem.FieldRow
                  onPress={() => router.push('/settings/app-icon')}
                  trailing={chevron}
                  testID="app-settings-app-icon"
                >
                  <Text>{t('settings.appIcon')}</Text>
                </ListItem.FieldRow>
              ) : null}
              <ReducedMotionControl />
              <TabBarAutoHideControl />
              <ListItem.FieldRow
                testID="app-settings-language"
                onPress={changeLanguage ? () => setLanguageOpen(true) : undefined}
                trailing={
                  <Row alignment="center" spacing={spacing.sm}>
                    <Text textStyle={{ color: colors.muted }}>{languageLabel(language)}</Text>
                    {chevron}
                  </Row>
                }
              >
                <Text>{t('common.language')}</Text>
              </ListItem.FieldRow>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.permissions.title')} titleUppercase>
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading
                  label={t('settings.permissions.title')}
                  language={language}
                />
              </FieldGroup.SectionHeader>
              {(['notifications', 'camera', 'microphone'] as const).map((kind) => {
                const permission = device.permissions[kind];
                const enabled = kind === 'notifications' || device.enabled[kind];
                return (
                  <Switch
                    key={kind}
                    label={t(`settings.permissions.${kind}`)}
                    value={enabled && permission?.granted === true}
                    disabled={deviceControlsDisabled || !permission}
                    onValueChange={(value) => void device.setEnabled(kind, value)}
                    modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
                    testID={`app-settings-permission-${kind}`}
                  />
                );
              })}
              {(['photos', 'haptics'] as const).map((kind) => (
                <Switch
                  key={kind}
                  label={t(`settings.permissions.${kind}`)}
                  value={device.enabled[kind]}
                  disabled={deviceControlsDisabled}
                  onValueChange={(value) => void device.setEnabled(kind, value)}
                  modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
                  testID={`app-settings-permission-${kind}`}
                />
              ))}
              <Text tone="muted">{t('settings.permissions.notificationsHint')}</Text>
              {Platform.OS === 'android' ? (
                <PushTokenField permission={device.permissions.notifications} />
              ) : null}
              {device.error || device.saveFailed ? (
                <Text tone="error" testID="app-settings-permissions-error">
                  {t(`settings.permissions.${device.error ?? 'saveFailed'}`)}
                </Text>
              ) : null}
              <ListItem.FieldRow
                onPress={deviceControlsDisabled ? undefined : () => void device.openSettings()}
                trailing={chevron}
                testID="app-settings-system-permissions"
              >
                <Text tone={deviceControlsDisabled ? 'disabled' : 'default'}>
                  {t('settings.permissions.systemSettings')}
                </Text>
              </ListItem.FieldRow>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.location.title')} titleUppercase>
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading label={t('settings.location.title')} language={language} />
              </FieldGroup.SectionHeader>
              <Switch
                label={t('settings.permissions.location')}
                value={location.enabled && location.permission?.granted === true}
                disabled={deviceControlsDisabled}
                onValueChange={(value) => void device.setEnabled('location', value)}
                modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
                testID="app-settings-permission-location"
              />
              <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
                <Text testID="app-settings-location-status">
                  {t(`settings.location.${locationStatus}`)}
                </Text>
                <Text tone="muted">{t('settings.location.hint')}</Text>
                {location.servicesEnabled === false && Platform.OS === 'ios' ? (
                  <Text tone="muted" testID="app-settings-location-services-hint">
                    {t('settings.location.servicesOffIOS')}
                  </Text>
                ) : null}
                {location.error ? (
                  <Text tone="error" testID="app-settings-location-error">
                    {t(`settings.location.${location.error}`)}
                  </Text>
                ) : null}
                {location.position ? (
                  <>
                    <Text testID="app-settings-location-latitude">
                      {t('settings.location.latitude', {
                        value: location.position.coords.latitude.toFixed(5),
                      })}
                    </Text>
                    <Text testID="app-settings-location-longitude">
                      {t('settings.location.longitude', {
                        value: location.position.coords.longitude.toFixed(5),
                      })}
                    </Text>
                    {location.position.coords.accuracy !== null ? (
                      <Text tone="muted">
                        {t('settings.location.accuracy', {
                          value: Math.round(location.position.coords.accuracy),
                        })}
                      </Text>
                    ) : null}
                  </>
                ) : null}
              </Column>
              <ListItem.FieldRow
                onPress={
                  locationRequestDisabled ? undefined : () => void location.requestLocation()
                }
                testID="app-settings-get-location"
              >
                <Text tone={locationRequestDisabled ? 'disabled' : 'default'}>
                  {t(
                    location.pending
                      ? 'settings.location.locating'
                      : locationBlocked
                        ? 'settings.location.openSettings'
                        : location.permission?.granted && location.servicesEnabled
                          ? 'settings.location.getLocation'
                          : 'settings.location.enableLocation',
                  )}
                </Text>
              </ListItem.FieldRow>
              <ListItem.FieldRow
                onPress={permissionActionPending ? undefined : () => void location.openSettings()}
                trailing={chevron}
                testID="app-settings-location-open-settings"
              >
                <Text tone={permissionActionPending ? 'disabled' : 'default'}>
                  {t('settings.location.openSettings')}
                </Text>
              </ListItem.FieldRow>
              {!updates ? tabFooter : null}
            </FieldGroup.Section>
            {updates ? (
              <FieldGroup.Section
                title={t('updates.title')}
                titleUppercase
                testID="app-settings-updates"
              >
                <FieldGroup.SectionHeader>
                  <SettingsSectionHeading label={t('updates.title')} language={language} />
                </FieldGroup.SectionHeader>
                <ListItem.FieldRow
                  supportingText={t('updates.installedVersion', {
                    version: nativeApplicationVersion ?? t('updates.unknown'),
                    build: nativeBuildVersion ?? t('updates.unknown'),
                  })}
                  testID="app-settings-installed-version"
                >
                  <Text>{t('updates.installed')}</Text>
                </ListItem.FieldRow>
                <ListItem.FieldRow
                  supportingText={t(`updates.status.${updates.otaStatus}`)}
                  testID="app-settings-update-status"
                >
                  <Text>{t('updates.improvements')}</Text>
                </ListItem.FieldRow>
                <ListItem.FieldRow
                  supportingText={
                    updates.storeVersion
                      ? `${t(`updates.status.${updates.storeStatus}`)} · ${t(
                          Platform.OS === 'android' ? 'updates.storeBuild' : 'updates.storeVersion',
                          { version: updates.storeVersion },
                        )}`
                      : t(`updates.status.${updates.storeStatus}`)
                  }
                  testID="app-settings-store-status"
                >
                  <Text>
                    {t(Platform.OS === 'android' ? 'updates.googlePlay' : 'updates.appStore')}
                  </Text>
                </ListItem.FieldRow>
                {updates.actionError ? (
                  <Text tone="error" testID="app-settings-update-error">
                    {t(`updates.errors.${updates.actionError}`)}
                  </Text>
                ) : null}
                <ListItem.FieldRow
                  onPress={updateCheckDisabled ? undefined : () => void updates.checkForUpdates()}
                  testID="app-settings-check-updates"
                >
                  <Text tone={updateCheckDisabled ? 'disabled' : 'primary'}>
                    {t(updates.pending === 'check' ? 'updates.checking' : 'updates.check')}
                  </Text>
                </ListItem.FieldRow>
                {updates.storeStatus === 'available' ? (
                  <ListItem.FieldRow
                    onPress={updatesDisabled ? undefined : () => void updates.openStore()}
                    testID="app-settings-store-update"
                  >
                    <Text tone={updatesDisabled ? 'disabled' : 'primary'}>
                      {t(
                        updates.pending === 'store' ? 'updates.openingStore' : 'updates.updateApp',
                      )}
                    </Text>
                  </ListItem.FieldRow>
                ) : null}
                {updates.otaStatus === 'available' || updates.otaStatus === 'ready' ? (
                  <ListItem.FieldRow
                    onPress={
                      updatesDisabled
                        ? undefined
                        : () =>
                            void (updates.otaStatus === 'ready'
                              ? updates.restartApp()
                              : updates.downloadUpdate())
                    }
                    testID="app-settings-apply-update"
                  >
                    <Text tone={updatesDisabled ? 'disabled' : 'primary'}>
                      {t(
                        updates.pending === 'download'
                          ? 'updates.downloading'
                          : updates.pending === 'restart'
                            ? 'updates.restarting'
                            : updates.otaStatus === 'ready'
                              ? 'updates.restart'
                              : 'updates.download',
                      )}
                    </Text>
                  </ListItem.FieldRow>
                ) : null}
                {tabFooter}
              </FieldGroup.Section>
            ) : null}
          </FieldGroup>
        </Column>
        <Column spacing={0} testID="app-settings-language-presentation">
          <BottomSheet
            isPresented={languageOpen}
            onDismiss={() => setLanguageOpen(false)}
            testID="app-settings-language-sheet"
          >
            <PageSection>
              <Text variant="title" testID="app-settings-language-title">
                {t('common.language')}
              </Text>
              <Column modifiers={nativeFillWidth} style={{ height: languageListHeight }}>
                <FieldGroup.Section>
                  {SUPPORTED_LANGUAGES.map((value) => (
                    <ListItem.FieldRow
                      key={value}
                      testID={`app-settings-language-${value}`}
                      onPress={
                        changeLanguage &&
                        (() => {
                          changeLanguage(value);
                          setLanguageOpen(false);
                        })
                      }
                      trailing={
                        language === value ? (
                          <Icon
                            name={Icon.select({
                              ios: 'checkmark',
                              android: 'check',
                            })}
                            size={20}
                            color={colors.tint}
                          />
                        ) : undefined
                      }
                    >
                      <Text>{languageLabel(value)}</Text>
                    </ListItem.FieldRow>
                  ))}
                </FieldGroup.Section>
              </Column>
            </PageSection>
          </BottomSheet>
        </Column>
      </Column>
    </PageScreen>
  );
}

/** Motion changes update this control without rebuilding the settings form. */
function ReducedMotionControl() {
  const { t } = useTranslation();
  const { setReducedMotion, motionReady } = useMotionSettings();
  const reducedMotion = useAppReducedMotion();
  return (
    <Switch
      label={t('settings.reduceMotion')}
      value={reducedMotion}
      onValueChange={setReducedMotion}
      disabled={!motionReady}
      modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
      testID="app-settings-reduce-motion"
    />
  );
}

function TabBarAutoHideControl() {
  const { t } = useTranslation();
  const { tabBarAutoHideEnabled, setTabBarAutoHideEnabled, motionReady } = useMotionSettings();
  return (
    <Column spacing={spacing.xs} modifiers={nativeFillWidth}>
      <Switch
        label={t('settings.tabBarAutoHide')}
        value={tabBarAutoHideEnabled}
        onValueChange={setTabBarAutoHideEnabled}
        disabled={!motionReady}
        modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
        testID="app-settings-tab-bar-auto-hide"
      />
      <Text variant="caption" tone="muted">
        {t('settings.tabBarAutoHideHint')}
      </Text>
    </Column>
  );
}

/** Only the first section reserves clearance; all headings share the brand foreground. */
function SettingsSectionHeading({
  label,
  language,
  first = false,
}: Readonly<{
  label: string;
  language: Language;
  first?: boolean;
}>) {
  const headerInset = usePageHeaderInset();
  return (
    <Column
      modifiers={nativeFillWidth}
      style={{ paddingTop: first ? headerInset : 0 }}
      testID={first ? 'app-settings-scroll-inset' : undefined}
    >
      <Text
        variant="caption"
        tone="primary"
        fontWeight="700"
        textStyle={{ fontFamily: getBrandHeadingFont(language) }}
      >
        {label.toLocaleUpperCase(language)}
      </Text>
    </Column>
  );
}
