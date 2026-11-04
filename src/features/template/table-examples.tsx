import {
  ButtonContent,
  Collapsible,
  Column,
  Popover,
  Table,
  TextInput,
  UniversalTextContent as Text,
  nativeFillWidth,
  type TableColumn,
} from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';

type OrderStatus = 'preparing' | 'ready';
type ExampleOrder = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
};

const initialOrders: readonly ExampleOrder[] = [
  { id: '1042', customer: 'Sofia Amrani', items: 3, total: 185, status: 'preparing' },
  { id: '1041', customer: 'Adam Benali', items: 2, total: 120, status: 'ready' },
  { id: '1040', customer: 'Nora Idrissi', items: 4, total: 240, status: 'preparing' },
  { id: '1039', customer: 'Youssef Alaoui', items: 1, total: 65, status: 'ready' },
];

export function TableExamples({ contentWidth }: Readonly<{ contentWidth: number }>) {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [tableOpen, setTableOpen] = useState(true);
  const [popoverId, setPopoverId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; status: OrderStatus } | null>(null);
  const query = search.trim().toLocaleLowerCase();
  const visibleOrders = orders.filter((order) =>
    `#${order.id} ${order.customer}`.toLocaleLowerCase().includes(query),
  );
  const currency = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'en', {
    style: 'currency',
    currency: 'MAD',
  });
  const columns: readonly TableColumn<ExampleOrder>[] = [
    {
      id: 'order',
      header: t('showcase.tableGallery.order'),
      width: 112,
      renderCell: (order) => `#${order.id}`,
    },
    {
      id: 'customer',
      header: t('showcase.tableGallery.customer'),
      width: 184,
      renderCell: (order) => order.customer,
    },
    {
      id: 'items',
      header: t('componentCatalog.tables.itemsHeader'),
      width: 88,
      align: 'center',
      renderCell: (order) => order.items,
    },
    {
      id: 'status',
      header: t('showcase.tableGallery.status'),
      width: 140,
      renderCell: (order) => (
        <Text
          tone={order.status === 'ready' ? 'success' : 'warning'}
          testID={`component-table-status-${order.id}`}
        >
          {t(`showcase.tableGallery.${order.status}`)}
        </Text>
      ),
    },
    {
      id: 'total',
      header: t('showcase.tableGallery.total'),
      width: 144,
      align: 'end',
      renderCell: (order) => currency.format(order.total),
    },
  ];

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
    setFeedback({ id, status });
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
        label={t('showcase.tableGallery.search')}
        placeholder={t('showcase.tableGallery.searchPlaceholder')}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        testID="component-table-search"
      />
      <Text variant="caption" testID="component-table-result-count">
        {t('showcase.tableGallery.resultCount', {
          visible: visibleOrders.length,
          total: orders.length,
        })}
      </Text>
      <Collapsible
        label={t('showcase.tableGallery.title')}
        isOpen={tableOpen}
        onOpenChange={(open) => {
          setTableOpen(open);
          setPopoverId(null);
        }}
      >
        <Table
          rows={visibleOrders}
          columns={columns}
          keyExtractor={(order) => order.id}
          emptyState={
            <Column spacing={spacing.md} modifiers={nativeFillWidth}>
              <Text>{t('showcase.tableGallery.empty')}</Text>
              <ButtonContent
                variant="secondary"
                label={t('showcase.tableGallery.clearFilters')}
                onPress={() => setSearch('')}
                testID="component-table-empty-reset"
              />
            </Column>
          }
          actionsHeader={t('showcase.tableGallery.actions')}
          actionsWidth={144}
          testID="component-table"
          renderActions={(order) => (
            <Popover
              isPresented={popoverId === order.id}
              onIsPresentedChange={(open) =>
                setPopoverId((current) => (open ? order.id : current === order.id ? null : current))
              }
              testID={`component-table-popover-${order.id}`}
              trigger={
                <ButtonContent
                  variant="secondary"
                  label={t('showcase.tableGallery.actions')}
                  accessibilityLabel={t('showcase.tableGallery.actionsFor', { id: order.id })}
                  onPress={() => setPopoverId(order.id)}
                  testID={`component-table-actions-${order.id}`}
                />
              }
            >
              <Column
                spacing={spacing.md}
                style={{ width: Math.min(280, contentWidth), padding: spacing.lg }}
              >
                <Text variant="subtitle">
                  {t('showcase.tableGallery.detailsTitle', { id: order.id })}
                </Text>
                <Collapsible
                  label={t('componentCatalog.tables.detailsFor', { id: order.id })}
                  isOpen={detailsId === order.id}
                  onOpenChange={(open) => setDetailsId(open ? order.id : null)}
                >
                  <Column
                    spacing={spacing.sm}
                    modifiers={nativeFillWidth}
                    testID={`component-table-details-${order.id}`}
                  >
                    <Text>{order.customer}</Text>
                    <Text variant="caption" tone="muted">
                      {t('showcase.tableGallery.detailsSummary', {
                        items: order.items,
                        total: currency.format(order.total),
                        status: t(`showcase.tableGallery.${order.status}`),
                      })}
                    </Text>
                  </Column>
                </Collapsible>
                <ButtonContent
                  variant="primary"
                  label={t('showcase.tableGallery.markReady')}
                  disabled={order.status === 'ready'}
                  fullWidth
                  onPress={() => updateStatus(order.id, 'ready')}
                  testID={`component-table-ready-${order.id}`}
                />
                <ButtonContent
                  variant="secondary"
                  label={t('componentCatalog.tables.markPreparing')}
                  disabled={order.status === 'preparing'}
                  fullWidth
                  onPress={() => updateStatus(order.id, 'preparing')}
                  testID={`component-table-preparing-${order.id}`}
                />
                <ButtonContent
                  variant="tertiary"
                  label={t('common.close')}
                  fullWidth
                  onPress={() => setPopoverId(null)}
                  testID={`component-table-close-${order.id}`}
                />
              </Column>
            </Popover>
          )}
        />
      </Collapsible>
      <Text variant="caption" tone="muted">
        {t('showcase.tableGallery.scrollHint')}
      </Text>
      {feedback && (
        <Text tone="success" testID="component-table-feedback">
          {t('componentCatalog.tables.statusUpdated', {
            id: feedback.id,
            status: t(`showcase.tableGallery.${feedback.status}`),
          })}
        </Text>
      )}
      <ButtonContent
        variant="secondary"
        label={t('componentCatalog.tables.reset')}
        fullWidth
        onPress={() => {
          setOrders(initialOrders);
          setSearch('');
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
