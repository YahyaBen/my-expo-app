import {
  Badge,
  Column,
  EmptyState,
  Icon,
  PageScreen,
  PageSection,
  SegmentedControl,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';
import { paymentBadgeVariants, paymentDetails } from './table-payments';

const returnToTable = () =>
  router.canGoBack() ? router.back() : router.replace('/components/table');

export default function TablePaymentScreen({
  id,
  historySnapshot,
}: Readonly<{
  id?: string;
  historySnapshot?: string;
}>) {
  const { t, i18n } = useTranslation();
  const [segment, setSegment] = useState('detail');
  const payment = paymentDetails(id, historySnapshot);

  if (!payment) {
    return (
      <PageScreen title={t('componentCatalog.tables.title')} onBack={returnToTable}>
        <PageSection>
          <EmptyState
            icon={Icon.select({ ios: 'doc.text.magnifyingglass', android: 'search' })}
            title={t('componentCatalog.tables.notFound')}
            primaryAction={{
              label: t('common.goBack'),
              onPress: returnToTable,
              testID: 'table-payment-not-found-back',
            }}
            testID="table-payment-not-found"
          />
        </PageSection>
      </PageScreen>
    );
  }

  const amount = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'en', {
    style: 'currency',
    currency: 'USD',
  }).format(payment.amount);

  return (
    <PageScreen
      title={t('componentCatalog.tables.detailsFor', { id: payment.id })}
      onBack={returnToTable}
    >
      <PageSection>
        <Text variant="subtitle" testID="table-payment-email">
          {payment.email}
        </Text>
        <SegmentedControl
          label={t('componentCatalog.tables.detailsFor', { id: payment.id })}
          options={[
            {
              value: 'detail',
              label: t('componentCatalog.tables.detail'),
              testID: 'table-payment-segment-detail',
            },
            {
              value: 'history',
              label: t('componentCatalog.tables.history'),
              testID: 'table-payment-segment-history',
            },
          ]}
          selectedValue={segment}
          onValueChange={setSegment}
        />
        {segment === 'detail' ? (
          <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="table-payment-detail">
            <Column spacing={spacing.xs}>
              <Text variant="caption" tone="muted">
                {t('componentCatalog.tables.payment')}
              </Text>
              <Text>{`#${payment.id}`}</Text>
            </Column>
            <Column spacing={spacing.xs}>
              <Text variant="caption" tone="muted">
                {t('componentCatalog.tables.email')}
              </Text>
              <Text>{payment.email}</Text>
            </Column>
            <Column spacing={spacing.xs}>
              <Text variant="caption" tone="muted">
                {t('componentCatalog.tables.amount')}
              </Text>
              <Text variant="title" testID="table-payment-amount">
                {amount}
              </Text>
            </Column>
            <Column spacing={spacing.sm}>
              <Text variant="caption" tone="muted">
                {t('showcase.tableGallery.status')}
              </Text>
              <Badge
                label={t('componentCatalog.tables.statuses.' + payment.status)}
                variant={paymentBadgeVariants[payment.status]}
                testID="table-payment-status"
              />
            </Column>
          </Column>
        ) : (
          <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="table-payment-history">
            {payment.history.map((event, index) => (
              <Column
                key={`${index}-${event}`}
                spacing={spacing.xs}
                modifiers={nativeFillWidth}
                testID={`table-payment-history-${index}`}
              >
                <Text variant="caption" tone="muted">
                  {t('componentCatalog.tables.historyStep', { number: index + 1 })}
                </Text>
                <Text>{t('componentCatalog.tables.historyEvents.' + event)}</Text>
              </Column>
            ))}
          </Column>
        )}
      </PageSection>
    </PageScreen>
  );
}
