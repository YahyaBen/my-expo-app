import {
  BottomSheet,
  ButtonContent,
  PageSection,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
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
        onDismiss={() => {}}
        testID="app-update-prompt"
      >
        <PageSection>
          <Text variant="title" testID="app-update-title">
            {t(isStore ? 'updates.newVersion' : 'updates.improvementsReady')}
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
        </PageSection>
      </BottomSheet>
    </UniversalHost>
  );
}
