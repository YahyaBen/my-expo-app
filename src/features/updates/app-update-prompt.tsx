import {
  BottomSheet,
  ButtonContent,
  PageSection,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useAppUpdates } from './app-updates';

/** Offer updates once each session; Settings keeps the actions available after dismissal. */
export function AppUpdatePrompt({ ready }: Readonly<{ ready: boolean }>) {
  const { t } = useTranslation();
  const updates = useAppUpdates();
  const offered = useRef(false);
  const [kind, setKind] = useState<'store' | 'ota' | null>(null);
  const [presented, setPresented] = useState(false);
  const storeAvailable = updates?.storeStatus === 'available';
  const otaAvailable = updates?.otaStatus === 'available' || updates?.otaStatus === 'ready';
  const pending = updates?.pending ?? null;

  useEffect(() => {
    // A slow store check must not hide an OTA result that has already arrived.
    if (
      !ready ||
      offered.current ||
      (pending !== null && pending !== 'check') ||
      (!storeAvailable && !otaAvailable)
    )
      return;
    offered.current = true;
    setKind(storeAvailable ? 'store' : 'ota');
    setPresented(true);
  }, [ready, pending, storeAvailable, otaAvailable]);

  if (!updates) return null;
  const isStore = kind === 'store';
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
        isPresented={presented && !(kind === 'ota' && updates.otaStatus === 'current' && !pending)}
        onDismiss={() => setPresented(false)}
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
          <ButtonContent
            variant="tertiary"
            label={t('updates.later')}
            fullWidth
            onPress={() => setPresented(false)}
            testID="app-update-later"
          />
        </PageSection>
      </BottomSheet>
    </UniversalHost>
  );
}
