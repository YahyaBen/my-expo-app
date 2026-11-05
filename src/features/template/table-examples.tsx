import {
  ButtonContent,
  Collapsible,
  Column,
  EmptyState,
  Icon,
  Popover,
  Row,
  Table,
  TextInput,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  type TableColumn,
} from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

type PaymentStatus = 'success' | 'processing' | 'failed';
type ExamplePayment = {
  id: string;
  email: string;
  amount: number;
  status: PaymentStatus;
};

const initialPayments: readonly ExamplePayment[] = [
  { id: '1042', email: 'ken99@example.com', amount: 316, status: 'success' },
  { id: '1041', email: 'abe45@example.com', amount: 242, status: 'success' },
  { id: '1040', email: 'monserrat44@example.com', amount: 837, status: 'processing' },
  { id: '1039', email: 'silas22@example.com', amount: 874, status: 'success' },
  { id: '1038', email: 'carmella@example.com', amount: 721, status: 'failed' },
];

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
  const [tableOpen, setTableOpen] = useState(true);
  const [popoverId, setPopoverId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
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
      width: 112,
      renderCell: (payment) => (
        <Text
          variant="body"
          fontSize={14}
          textStyle={{ color: colors.tableText }}
          testID={'component-table-status-' + payment.id}
        >
          {t('componentCatalog.tables.statuses.' + payment.status)}
        </Text>
      ),
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
    if (readOnly) return;
    setPayments((current) =>
      current.map((row) => (row.id === payment.id ? { ...row, status } : row)),
    );
    setFeedback({ email: payment.email, status });
    setPopoverId(null);
  }

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
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
      <Collapsible
        label={t('componentCatalog.tables.title')}
        isOpen={tableOpen}
        onOpenChange={(open) => {
          setTableOpen(open);
          setPopoverId(null);
        }}
      >
        <Table
          rows={visiblePayments}
          columns={columns}
          keyExtractor={(payment) => payment.id}
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
                <Collapsible
                  label={t('componentCatalog.tables.detailsFor', { id: payment.id })}
                  isOpen={detailsId === payment.id}
                  onOpenChange={(open) => setDetailsId(open ? payment.id : null)}
                >
                  <Column
                    spacing={spacing.sm}
                    modifiers={nativeFillWidth}
                    testID={'component-table-details-' + payment.id}
                  >
                    <Text variant="caption">
                      {t('componentCatalog.tables.detailsSummary', {
                        id: payment.id,
                        amount: currency.format(payment.amount),
                        status: t('componentCatalog.tables.statuses.' + payment.status),
                      })}
                    </Text>
                  </Column>
                </Collapsible>
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
      </Collapsible>
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
          setTableOpen(true);
          setPopoverId(null);
          setDetailsId(null);
          setFeedback(null);
        }}
        testID="component-table-reset"
      />
    </Column>
  );
}
