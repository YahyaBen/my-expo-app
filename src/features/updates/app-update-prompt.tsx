import { getAppBrand } from '@/config/brand';
import { spacing } from '@/constants/layout';
import {
  BottomSheet,
  ButtonContent,
  Column,
  nativeFillSize,
  nativeFillWidth,
  nativeRowWeight,
  PageSection,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import { applicationName, nativeApplicationVersion } from 'expo-application';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useAppUpdates } from './app-updates';

/** Keep required updates presented through download, retry and restart. */
export function AppUpdatePrompt({ ready }: Readonly<{ ready: boolean }>) {
  const { t } = useTranslation();
  const updates = useAppUpdates();
  const [presented, setPresented] = useState(false);
  const storeAvailable = updates?.storeStatus === 'available';
  const otaAvailable = updates?.otaStatus === 'available' || updates?.otaStatus === 'ready';
  const pending = updates?.pending ?? null;

  // Retain presentation if downloading or opening the store backgrounds the app.
  if (!presented && ready && (storeAvailable || otaAvailable)) setPresented(true);

  if (!updates) return null;
  const appName = applicationName ?? getAppBrand().name;
  const isStore = storeAvailable;
  const updating = pending === 'download' || pending === 'restart' || pending === 'store';
  const downloaded = updates.otaStatus === 'ready';
  const label =
    pending === 'store'
      ? 'openingStore'
      : pending === 'download'
        ? 'downloading'
        : pending === 'restart'
          ? 'restarting'
          : isStore
            ? 'updateApp'
            : downloaded
              ? 'restart'
              : 'download';

  return (
    <UniversalHost
      // Modal content has no inline height; keep its native presenter laid out.
      matchContents={false}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      testID="app-update-presentation"
    >
      <BottomSheet
        // A release can be withdrawn between detection and download.
        isPresented={presented && (storeAvailable || otaAvailable || updating)}
        dismissible={false}
        heightFraction={0.65}
        onDismiss={() => {}}
        testID="app-update-prompt"
      >
        <Column spacing={0} modifiers={nativeFillSize} testID="app-update-content">
          <ScrollView
            modifiers={[...nativeFillWidth, ...nativeRowWeight]}
            testID="app-update-scroll"
          >
            <PageSection>
              <Text variant="title" testID="app-update-title">
                {t(isStore ? 'updates.newVersion' : 'updates.improvementsReady')}
              </Text>
              <Text tone="muted" testID="app-update-description">
                {t('updates.description', { appName })}
              </Text>
              <Text tone="muted" testID="app-update-message">
                {t(
                  isStore
                    ? 'updates.storeHint'
                    : downloaded
                      ? 'updates.restartHint'
                      : 'updates.downloadHint',
                )}
              </Text>
              {updates.actionError ? (
                <Text tone="error" testID="app-update-error">
                  {t(`updates.errors.${updates.actionError}`)}
                </Text>
              ) : null}
            </PageSection>
          </ScrollView>
          <PageSection>
            <ButtonContent
              variant="primary"
              label={t(`updates.${label}`)}
              fullWidth
              disabled={pending !== null}
              onPress={() =>
                void (isStore
                  ? updates.openStore()
                  : downloaded
                    ? updates.restartApp()
                    : updates.downloadUpdate())
              }
              testID="app-update-apply"
            />
            <Column alignment="center" spacing={spacing.xs} modifiers={nativeFillWidth}>
              <Text variant="label" tone="muted" testID="app-update-app-name">
                {appName}
              </Text>
              <Text variant="caption" tone="muted" testID="app-update-app-version">
                {t('common.appVersion', {
                  version: nativeApplicationVersion ?? t('updates.unknown'),
                })}
              </Text>
            </Column>
          </PageSection>
        </Column>
      </BottomSheet>
    </UniversalHost>
  );
}
