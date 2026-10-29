import { screenContentMaxWidth, spacing, tabBarRaisedHeight } from '@/constants/layout';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Platform, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheet,
  Column,
  ColorSchemeControl,
  FieldGroup,
  Icon,
  ListItem,
  nativeFillWidth,
  nativeRowWeight,
  PageFrame,
  PageSection,
  pageFormModifiers,
  Row,
  Spacer,
  Switch,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  usePageHeaderInset,
} from '@components/ui';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useThemeSettings } from '@/context/theme.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useAppTheme } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import { version as appVersion } from '../../../package.json';
import { HeaderMotionPicker } from './header-motion-picker';
import { getBrandHeadingFont } from '@/config/brand-assets';
import { useDeviceLocation } from './use-device-location';
import { useDevicePermissions } from './use-device-permissions';

const languageKeys: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};
const languageLabel = (language: Language) => i18n.getFixedT(language)(languageKeys[language]);

export default function SettingsPreview() {
  const { language, setLanguage, ready } = useLanguage();
  return (
    <SettingsPage
      language={language}
      onLanguageChange={setLanguage}
      languageReady={ready}
      onBack={() => {}}
    />
  );
}

/** Explicit preferences also let native stories run without changing saved app settings. */
export function SettingsPage({
  language,
  onLanguageChange,
  languageReady = true,
  tab = false,
  onBack,
}: Readonly<{
  language: Language;
  onLanguageChange?: (language: Language) => void;
  languageReady?: boolean;
  tab?: boolean;
  onBack?: () => void;
}>) {
  const { t } = useTranslation();
  const direction = useLayoutDirection();
  const { colors, design } = useAppTheme();
  const { setReducedMotion, headerMotionReady } = useThemeSettings();
  const reducedMotion = useAppReducedMotion();
  const { height: windowHeight } = useWindowDimensions();
  const languageListHeight = Math.min(320, windowHeight * 0.45);
  const [languageOpen, setLanguageOpen] = useState(false);
  const device = useDevicePermissions();
  const location = useDeviceLocation(device.permissions.location);
  const deviceControlsDisabled = !device.ready || device.pending !== null || location.pending;
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
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
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
  return (
    <PageFrame
      title={t('settings.title')}
      onBack={tab ? undefined : back}
      headerOverlay={false}
      scrollsBehindHeader
    >
      <SettingsViewport tab={tab}>
        <UniversalHost
          // Recreate only this iOS form host when direction flips; reused native cells mirror text.
          key={Platform.OS === 'ios' ? direction : undefined}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1, maxWidth: screenContentMaxWidth, alignSelf: 'center' }}
          testID="app-settings-content"
        >
          <FieldGroup
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
              <Row alignment="center" spacing={spacing.lg} modifiers={nativeFillWidth}>
                <Column modifiers={Platform.OS === 'ios' ? nativeFillWidth : nativeRowWeight}>
                  <Text>{t('common.colorScheme')}</Text>
                </Column>
                <ColorSchemeControl testID="app-settings-color-scheme-picker" />
              </Row>
              {design.header.artwork ? (
                <Row alignment="center" spacing={spacing.lg} modifiers={nativeFillWidth}>
                  <Column modifiers={Platform.OS === 'ios' ? nativeFillWidth : nativeRowWeight}>
                    <Text>{t('settings.headerMotion')}</Text>
                  </Column>
                  <HeaderMotionPicker />
                </Row>
              ) : null}
              <Switch
                label={t('settings.reduceMotion')}
                value={reducedMotion}
                onValueChange={setReducedMotion}
                disabled={!headerMotionReady}
                modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
                testID="app-settings-reduce-motion"
              />
              <ListItem
                testID="app-settings-language"
                disabled={!languageReady || !onLanguageChange}
                onPress={() => {
                  if (languageReady && onLanguageChange) setLanguageOpen(true);
                }}
                trailing={
                  <Row alignment="center" spacing={spacing.sm}>
                    <Text textStyle={{ color: colors.muted }}>{languageLabel(language)}</Text>
                    {chevron}
                  </Row>
                }
              >
                <Text>{t('common.language')}</Text>
              </ListItem>
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
              {device.error || device.saveFailed ? (
                <Text tone="error" testID="app-settings-permissions-error">
                  {t(`settings.permissions.${device.error ?? 'saveFailed'}`)}
                </Text>
              ) : null}
              <UniversalButtonContent
                variant="link"
                label={t('settings.permissions.systemSettings')}
                disabled={deviceControlsDisabled}
                onPress={() => void device.openSettings()}
                testID="app-settings-system-permissions"
              />
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
              <UniversalButtonContent
                variant="secondary"
                label={t(
                  location.pending
                    ? 'settings.location.locating'
                    : locationBlocked
                      ? 'settings.location.openSettings'
                      : location.permission?.granted && location.servicesEnabled
                        ? 'settings.location.getLocation'
                        : 'settings.location.enableLocation',
                )}
                disabled={location.pending || !location.enabled || device.pending !== null}
                onPress={() => void location.requestLocation()}
                testID="app-settings-get-location"
              />
              <UniversalButtonContent
                variant="link"
                label={t('settings.location.openSettings')}
                disabled={location.pending || device.pending !== null}
                onPress={() => void location.openSettings()}
                testID="app-settings-location-open-settings"
              />
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.about')} titleUppercase>
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading label={t('settings.about')} language={language} />
              </FieldGroup.SectionHeader>
              <ListItem
                supportingText={
                  <Text fontSize={14} tone="muted">
                    {appVersion}
                  </Text>
                }
              >
                <Text>{t('settings.appVersion')}</Text>
              </ListItem>
              {tab ? (
                <FieldGroup.SectionFooter>
                  <Spacer size={tabBarRaisedHeight} />
                </FieldGroup.SectionFooter>
              ) : null}
            </FieldGroup.Section>
          </FieldGroup>
        </UniversalHost>
        {/* A sheet owns a Host; isolate its presentation from the form's native hit-testing tree. */}
        <UniversalHost
          style={{ position: 'absolute' }}
          pointerEvents="box-none"
          testID="app-settings-language-presentation"
        >
          <BottomSheet
            isPresented={languageOpen}
            onDismiss={() => setLanguageOpen(false)}
            testID="app-settings-language-sheet"
          >
            <PageSection>
              <Text
                variant="title"
                tone="primary"
                textStyle={{ fontFamily: getBrandHeadingFont(language) }}
                testID="app-settings-language-title"
              >
                {t('common.language')}
              </Text>
              <Column modifiers={nativeFillWidth} style={{ height: languageListHeight }}>
                <FieldGroup
                  modifiers={pageFormModifiers}
                  style={{ backgroundColor: 'transparent' }}
                  testID="app-settings-language-options"
                >
                  <FieldGroup.Section>
                    {SUPPORTED_LANGUAGES.map((value) => (
                      <ListItem
                        key={value}
                        testID={`app-settings-language-${value}`}
                        disabled={!languageReady || !onLanguageChange}
                        onPress={() => {
                          if (!languageReady || !onLanguageChange) return;
                          onLanguageChange(value);
                          setLanguageOpen(false);
                        }}
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
                      </ListItem>
                    ))}
                  </FieldGroup.Section>
                </FieldGroup>
              </Column>
              <UniversalButtonContent
                variant="link"
                label={t('common.close')}
                testID="app-settings-language-close"
                onPress={() => setLanguageOpen(false)}
              />
            </PageSection>
          </BottomSheet>
        </UniversalHost>
      </SettingsViewport>
    </PageFrame>
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

// FieldGroup owns scrolling; the RN boundary supplies a bounded native viewport and safe areas.
function SettingsViewport({ children, tab }: Readonly<{ children: ReactNode; tab: boolean }>) {
  const insets = useSafeAreaInsets();
  return (
    <View
      testID="app-settings-viewport"
      collapsable={false}
      style={{ flex: 1, overflow: 'hidden', ...screenInsets(insets, { tabBarShown: tab }) }}
    >
      {children}
    </View>
  );
}
