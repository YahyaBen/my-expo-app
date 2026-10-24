import { spacing } from '@/constants/layout';
import { HEADER_BLUR_STEP, MAX_HEADER_BLUR, MIN_HEADER_BLUR } from '@/constants/header-blur';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Platform, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheet,
  ColorSchemeControl,
  Column,
  FieldGroup,
  Icon,
  nativeFillWidth,
  PageFrame,
  PageSection,
  pageFormModifiers,
  Row,
  Slider,
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
import { useAuthGuards } from '@/guards/auth-guards';
import { useAppTheme } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import { version as appVersion } from '../../../package.json';
import { HeaderMotionPicker } from './header-motion-picker';
import { SettingsRow } from './settings-row';
import { developerScreensEnabled } from '@/config/developer-tools';
import { getBrandHeadingFont } from '@/config/brand-assets';

const languageKeys: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};
const languageLabel = (language: Language) => i18n.getFixedT(language)(languageKeys[language]);

export default function SettingsScreen() {
  const { language, setLanguage, ready } = useLanguage();
  const { requireAuth } = useAuthGuards();
  return (
    <SettingsPage
      language={language}
      onLanguageChange={setLanguage}
      languageReady={ready}
      authenticated={requireAuth}
    />
  );
}

/** Explicit preferences also let native stories run without changing saved app settings. */
export function SettingsPage({
  language,
  onLanguageChange,
  languageReady = true,
  authenticated = false,
  onBack,
}: {
  language: Language;
  onLanguageChange?: (language: Language) => void;
  languageReady?: boolean;
  authenticated?: boolean;
  onBack?: () => void;
}) {
  const { t } = useTranslation();
  const direction = useLayoutDirection();
  const { colors, design } = useAppTheme();
  const { setReducedMotion, headerMotionReady, headerBlur, setHeaderBlur } = useThemeSettings();
  const reducedMotion = useAppReducedMotion();
  const { height: windowHeight } = useWindowDimensions();
  const languageListHeight = Math.min(320, windowHeight * 0.45);
  const [languageOpen, setLanguageOpen] = useState(false);
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  const chevron = (
    <Icon
      name={Icon.select({
        ios: 'chevron.forward',
        android: require('@expo/material-symbols/chevron_right.xml'),
      })}
      size={18}
      color={colors.muted}
    />
  );
  return (
    <PageFrame title={t('settings.title')} onBack={back} scrollsBehindHeader>
      <SettingsViewport>
        <UniversalHost
          // Recreate only this iOS form host when direction flips; reused native cells mirror text.
          key={Platform.OS === 'ios' ? direction : undefined}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1 }}
          testID="app-settings-content"
        >
          <FieldGroup
            modifiers={pageFormModifiers}
            style={{ backgroundColor: 'transparent' }}
            testID="app-settings-groups"
          >
            <FieldGroup.Section title={t('common.account')} titleUppercase>
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading label={t('common.account')} language={language} first />
              </FieldGroup.SectionHeader>
              <SettingsRow
                label={t(authenticated ? 'common.account' : 'auth.signIn')}
                testID="app-settings-account"
                onPress={() => router.push(authenticated ? '/account' : '/login')}
                trailing={chevron}
              />
            </FieldGroup.Section>
            <FieldGroup.Section
              title={t('settings.appearance')}
              titleUppercase
              testID="app-settings-appearance"
            >
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading label={t('settings.appearance')} language={language} />
              </FieldGroup.SectionHeader>
              <SettingsRow label={t('common.colorScheme')} trailing={<ColorSchemeControl />} />
              {Platform.OS === 'android' ? (
                <Column
                  spacing={spacing.sm}
                  modifiers={nativeFillWidth}
                  style={{ paddingVertical: spacing.lg }}
                >
                  <Text>{t('settings.headerBlur')}</Text>
                  <Text tone="muted" testID="app-settings-header-blur-value">
                    {t('settings.headerBlurValue', { value: headerBlur })}
                  </Text>
                  <Slider
                    value={headerBlur}
                    onValueChange={setHeaderBlur}
                    min={MIN_HEADER_BLUR}
                    max={MAX_HEADER_BLUR}
                    step={HEADER_BLUR_STEP}
                    disabled={!headerMotionReady}
                    modifiers={nativeFillWidth}
                    testID="app-settings-header-blur"
                  />
                </Column>
              ) : null}
              {design.header.artwork ? (
                <SettingsRow label={t('settings.headerMotion')} trailing={<HeaderMotionPicker />} />
              ) : null}
              <Switch
                label={t('settings.reduceMotion')}
                value={reducedMotion}
                onValueChange={setReducedMotion}
                disabled={!headerMotionReady}
                modifiers={Platform.OS === 'ios' ? nativeFillWidth : undefined}
                testID="app-settings-reduce-motion"
              />
              <SettingsRow
                label={t('common.language')}
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
              />
            </FieldGroup.Section>
            {developerScreensEnabled && (
              <FieldGroup.Section title={t('settings.components')} titleUppercase>
                <FieldGroup.SectionHeader>
                  <SettingsSectionHeading label={t('settings.components')} language={language} />
                </FieldGroup.SectionHeader>
                <SettingsRow
                  label={t('settings.componentList')}
                  testID="app-settings-component-list"
                  onPress={() => router.push('/ui')}
                  trailing={chevron}
                />
              </FieldGroup.Section>
            )}
            <FieldGroup.Section title={t('settings.about')} titleUppercase>
              <FieldGroup.SectionHeader>
                <SettingsSectionHeading label={t('settings.about')} language={language} />
              </FieldGroup.SectionHeader>
              <SettingsRow label={t('settings.appVersion')} detail={appVersion} />
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
                      <SettingsRow
                        key={value}
                        label={languageLabel(value)}
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
                                android: require('@expo/material-symbols/check.xml'),
                              })}
                              size={20}
                              color={colors.tint}
                            />
                          ) : undefined
                        }
                      />
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
}: {
  label: string;
  language: Language;
  first?: boolean;
}) {
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
function SettingsViewport({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      testID="app-settings-viewport"
      collapsable={false}
      style={{ flex: 1, overflow: 'hidden', ...screenInsets(insets) }}
    >
      {children}
    </View>
  );
}
