import {
  Badge,
  ButtonContent,
  Column,
  EmptyState,
  Icon,
  PageSection,
  Popover,
  Row,
  Table,
  TextInput,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  type TableColumn,
} from '@components/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import {
  initialPayments,
  paymentBadgeVariants,
  type ExamplePayment,
  type PaymentStatus,
} from './table-payments';

export function TableExamples({
  contentWidth,
  readOnly = false,
}: Readonly<{ contentWidth: number; readOnly?: boolean }>) {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<readonly string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [popoverId, setPopoverId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ email: string; status: PaymentStatus } | null>(null);
  const query = search.trim().toLocaleLowerCase();
  const filteredPayments = payments.filter((payment) =>
    ('#' + payment.id + ' ' + payment.email).toLocaleLowerCase().includes(query),
  );
  const visiblePayments = sortDirection
    ? [...filteredPayments].sort(
        (a, b) => a.email.localeCompare(b.email) * (sortDirection === 'asc' ? 1 : -1),
      )
    : filteredPayments;
  const visibleSelectedCount = visiblePayments.filter((payment) =>
    selectedKeys.includes(payment.id),
  ).length;
  const currency = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'en', {
    style: 'currency',
    currency: 'USD',
  });
  const sortIcon = Icon.select(
    sortDirection === 'asc'
      ? { ios: 'arrow.up', android: 'arrow_upward' }
      : sortDirection === 'desc'
        ? { ios: 'arrow.down', android: 'arrow_downward' }
        : { ios: 'arrow.up.arrow.down', android: 'swap_vert' },
  );
  const columns: readonly TableColumn<ExamplePayment>[] = [
    {
      id: 'status',
      header: t('showcase.tableGallery.status'),
      width: 176,
      renderCell: (payment) => (
        <Badge
          label={t('componentCatalog.tables.statuses.' + payment.status)}
          variant={paymentBadgeVariants[payment.status]}
          testID={'component-table-status-' + payment.id}
        />
      ),
    },
    {
      id: 'payment',
      header: t('componentCatalog.tables.payment'),
      width: 112,
      renderCell: (payment) => `#${payment.id}`,
    },
    {
      id: 'email',
      header: t('componentCatalog.tables.email'),
      width: 256,
      renderHeader: () => (
        <ButtonContent
          variant="tertiary"
          color={colors.tableText}
          contentColor={colors.tableText}
          contentPadding={0}
          accessibilityLabel={t(
            'componentCatalog.tables.' +
              (sortDirection === 'asc' ? 'sortDescending' : 'sortAscending'),
          )}
          onPress={() => setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))}
          testID="component-table-sort-email"
        >
          <Row spacing={spacing.xs} alignment="center">
            <Text variant="label" fontWeight="500" textStyle={{ color: colors.tableText }}>
              {t('componentCatalog.tables.email')}
            </Text>
            <Icon name={sortIcon} size={16} />
          </Row>
        </ButtonContent>
      ),
      renderCell: (payment) => payment.email,
    },
    {
      id: 'amount',
      header: t('componentCatalog.tables.amount'),
      width: 128,
      align: 'end',
      renderCell: (payment) => (
        <Text variant="body" fontSize={14} fontWeight="600" textStyle={{ color: colors.tableText }}>
          {currency.format(payment.amount)}
        </Text>
      ),
    },
  ];

  function updateStatus(payment: ExamplePayment, status: PaymentStatus) {
    if (readOnly || payment.status === status) return;
    setPayments((current) =>
      current.map((row) =>
        row.id === payment.id ? { ...row, status, history: [...row.history, status] } : row,
      ),
    );
    setFeedback({ email: payment.email, status });
    setPopoverId(null);
  }

  function openDetails(payment: ExamplePayment) {
    setPopoverId(null);
    router.push({
      pathname: '/table/[id]',
      params: { id: payment.id, history: payment.history.join(',') },
    });
  }

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <PageSection style={{ paddingVertical: 0 }}>
        <Text variant="heading">{t('componentCatalog.tables.title')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.tables.hint')}
        </Text>
        <TextInput
          value={search}
          onChangeText={(next) => {
            setSearch(next);
            setPopoverId(null);
          }}
          label={t('componentCatalog.tables.search')}
          placeholder={t('componentCatalog.tables.searchPlaceholder')}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          testID="component-table-search"
        />
        <Text variant="caption" testID="component-table-result-count">
          {t('componentCatalog.tables.resultCount', {
            visible: visiblePayments.length,
            total: payments.length,
          })}
        </Text>
      </PageSection>
      <Table
        rows={visiblePayments}
        columns={columns}
        keyExtractor={(payment) => payment.id}
        onRowPress={readOnly ? undefined : openDetails}
        rowAccessibilityLabel={(payment) =>
          t('componentCatalog.tables.openDetails', { id: payment.id, email: payment.email })
        }
        selection={{
          selectedKeys,
          disabled: readOnly,
          selectAllLabel: t('componentCatalog.tables.selectAll'),
          rowLabel: (payment) => t('componentCatalog.tables.selectRow', { email: payment.email }),
          onSelectRow: (payment, selected) => {
            if (readOnly) return;
            setSelectedKeys((current) =>
              selected
                ? current.includes(payment.id)
                  ? current
                  : [...current, payment.id]
                : current.filter((id) => id !== payment.id),
            );
          },
          onSelectAll: (rows, selected) => {
            if (readOnly) return;
            const visibleKeys = rows.map((row) => row.id);
            setSelectedKeys((current) => {
              const hiddenKeys = current.filter((id) => !visibleKeys.includes(id));
              return selected ? [...hiddenKeys, ...visibleKeys] : hiddenKeys;
            });
          },
        }}
        emptyState={
          <EmptyState
            icon={Icon.select({ ios: 'magnifyingglass', android: 'search' })}
            title={t('componentCatalog.tables.empty')}
            description={t('query.searchEmptyHint')}
            primaryAction={{
              label: t('showcase.tableGallery.clearFilters'),
              onPress: () => setSearch(''),
              testID: 'component-table-empty-reset',
            }}
            testID="component-table-empty-content"
          />
        }
        actionsWidth={80}
        testID="component-table"
        renderActions={(payment) => (
          <Popover
            isPresented={popoverId === payment.id}
            onIsPresentedChange={(open) =>
              setPopoverId((current) =>
                open ? payment.id : current === payment.id ? null : current,
              )
            }
            testID={'component-table-popover-' + payment.id}
            trigger={
              <ButtonContent
                variant="tertiary"
                color={colors.tableText}
                contentColor={colors.tableText}
                contentPadding={0}
                disabled={readOnly}
                accessibilityLabel={t('componentCatalog.tables.actionsFor', {
                  email: payment.email,
                })}
                onPress={() => setPopoverId(payment.id)}
                testID={'component-table-actions-' + payment.id}
              >
                <Icon name={Icon.select({ ios: 'ellipsis', android: 'more_horiz' })} size={18} />
              </ButtonContent>
            }
          >
            <Column
              spacing={spacing.md}
              style={{ width: Math.min(280, contentWidth), padding: spacing.lg }}
            >
              <Text variant="label">{payment.email}</Text>
              <ButtonContent
                variant="tertiary"
                label={t('componentCatalog.tables.detailsFor', { id: payment.id })}
                fullWidth
                onPress={() => openDetails(payment)}
                testID={'component-table-details-' + payment.id}
              />
              {(['success', 'processing', 'failed'] as const).map((status) => (
                <ButtonContent
                  key={status}
                  variant="tertiary"
                  label={t('componentCatalog.tables.actions.' + status)}
                  disabled={payment.status === status}
                  fullWidth
                  onPress={() => updateStatus(payment, status)}
                  testID={'component-table-' + status + '-' + payment.id}
                />
              ))}
              <ButtonContent
                variant="tertiary"
                label={t('common.close')}
                fullWidth
                onPress={() => setPopoverId(null)}
                testID={'component-table-close-' + payment.id}
              />
            </Column>
          </Popover>
        )}
      />
      <PageSection style={{ paddingVertical: 0 }}>
        <Text variant="caption" tone="muted" testID="component-table-selection-count">
          {t('componentCatalog.tables.selectionCount', {
            selected: visibleSelectedCount,
            total: visiblePayments.length,
          })}
        </Text>
        <ButtonContent
          variant="tertiary"
          label={t('componentCatalog.tables.clearSelection')}
          disabled={readOnly || selectedKeys.length === 0}
          onPress={() => setSelectedKeys([])}
          testID="component-table-clear-selection"
        />
        <Text variant="caption" tone="muted">
          {t('showcase.tableGallery.scrollHint')}
        </Text>
        {feedback && (
          <Text testID="component-table-feedback">
            {t('componentCatalog.tables.statusUpdated', {
              email: feedback.email,
              status: t('componentCatalog.tables.statuses.' + feedback.status),
            })}
          </Text>
        )}
        <ButtonContent
          variant="secondary"
          label={t('componentCatalog.tables.reset')}
          fullWidth
          disabled={readOnly}
          onPress={() => {
            setPayments(initialPayments);
            setSearch('');
            setSelectedKeys([]);
            setSortDirection(null);
            setPopoverId(null);
            setFeedback(null);
          }}
          testID="component-table-reset"
        />
      </PageSection>
    </Column>
  );
}
