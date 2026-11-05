import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import { Column, Row, ScrollView, Spacer } from '@expo/ui';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorBoundaryProps } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonContent } from '../button/button';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillSize } from '../native/native-fill-width';
import { PageFrame } from '../page/page-frame';
import { PageSection } from '../page/page-section';
import { UniversalTextContent as Text } from '../text/universal-text';
import { EmptyState } from './empty-state';
import { LoadingIndicator } from './loading-indicator';

export function LoadingContent({
  label,
  testID = 'loading-state',
}: Readonly<{
  label?: string;
  testID?: string;
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Row spacing={spacing.md} alignment="center" testID={testID}>
      <LoadingIndicator color={colors.tint} />
      <Text>{label ?? t('common.loading')}</Text>
    </Row>
  );
}

/** Fullscreen fallback for native route/Suspense boundaries. */
export function LoadingScreen({
  label,
  colorScheme,
}: Readonly<{
  label?: string;
  colorScheme?: 'light' | 'dark';
}>) {
  const scheme = useHostColorScheme(colorScheme);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors(scheme);
  return (
    <UniversalHost
      colorScheme={scheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ flex: 1, backgroundColor: colors.background, ...screenInsets(insets) }}
    >
      <Column alignment="center" modifiers={nativeFillSize}>
        <Spacer flexible />
        <PageSection alignment="center">
          <LoadingContent label={label} />
        </PageSection>
        <Spacer flexible />
      </Column>
    </UniversalHost>
  );
}

export type ContentQuery<T> = Pick<
  UseQueryResult<T, Error>,
  'data' | 'error' | 'fetchStatus' | 'isFetching' | 'isEnabled'
> & { refetch: () => unknown };

function resolvedQueryContent(
  data: unknown,
  empty: boolean | undefined,
  emptyContent: ReactNode,
  children: ReactNode,
) {
  if (data === undefined) return null;
  if (empty) return emptyContent;
  return children;
}

export function QueryContent<T>({
  query,
  empty,
  children,
  disabledMessage,
  emptyMessage,
  emptyState,
  testID,
}: Readonly<{
  query: ContentQuery<T>;
  empty?: boolean;
  disabledMessage?: string;
  emptyMessage?: string;
  /** Optional feature-specific empty presentation, including caller-owned actions. */
  emptyState?: ReactNode;
  /** Prefix for this composition's status and retry controls. */
  testID?: string;
  children: ReactNode;
}>) {
  const { t } = useTranslation();
  return (
    <Column spacing={spacing.lg} testID={testID}>
      {query.error ? (
        <>
          <Text testID={testID ? `${testID}-error` : 'query-error'}>
            {query.data === undefined ? t('query.failed') : t('query.refreshFailed')}
          </Text>
          <ButtonContent
            variant="secondary"
            testID={testID ? `${testID}-retry` : 'query-retry'}
            label={t('common.retry')}
            onPress={() => {
              void query.refetch();
            }}
            disabled={query.isFetching || !query.isEnabled || query.fetchStatus === 'paused'}
          />
        </>
      ) : null}
      {query.fetchStatus === 'paused' ? (
        <Text testID={testID ? `${testID}-offline` : 'query-offline'}>
          {query.data === undefined ? t('query.offline') : t('query.offlineCached')}
        </Text>
      ) : null}
      {query.fetchStatus === 'fetching' ? (
        <LoadingContent
          testID={testID ? `${testID}-loading` : undefined}
          label={query.data === undefined ? t('common.loading') : t('common.refreshing')}
        />
      ) : null}
      {query.data === undefined && !query.error && query.fetchStatus === 'idle' ? (
        <Text testID={testID ? `${testID}-idle` : 'query-idle'}>
          {query.isEnabled ? t('query.waiting') : (disabledMessage ?? t('query.disabled'))}
        </Text>
      ) : null}
      {resolvedQueryContent(
        query.data,
        empty,
        emptyState ?? (
          <EmptyState
            title={emptyMessage ?? t('query.empty')}
            description={t('query.emptyHint')}
            testID={testID ? `${testID}-empty` : 'query-empty'}
          />
        ),
        children,
      )}
    </Column>
  );
}

/** Recovery UI uses the same native Expo UI controls as the rest of the app. */
export function ScreenError({ error, retry }: Readonly<ErrorBoundaryProps>) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <PageFrame title={t('recovery.title')}>
      <UniversalHost
        testID="screen-error"
        matchContents={false}
        ignoreSafeArea="all"
        style={{ flex: 1, ...screenInsets(insets, { headerShown: true }) }}
      >
        <ScrollView>
          <PageSection>
            <Text variant="title">{t('recovery.failed')}</Text>
            <Text>{t('recovery.description')}</Text>
            {__DEV__ ? <Text textStyle={{ color: colors.error }}>{error.message}</Text> : null}
            <ButtonContent
              variant="secondary"
              label={t('common.tryAgain')}
              testID="screen-error-retry"
              onPress={() => {
                void retry();
              }}
            />
          </PageSection>
        </ScrollView>
      </UniversalHost>
    </PageFrame>
  );
}
