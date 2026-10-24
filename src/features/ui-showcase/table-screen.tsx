import { spacing } from '@/constants/layout';
import {
  Column,
  PageScreen,
  PageSection,
  Picker,
  Row,
  Table,
  TableActions,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
  type TableColumn,
} from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableOrderCharts } from './table-order-charts';

type OrderStatus = 'preparing' | 'ready';
type StatusFilter = 'all' | OrderStatus;
type DemoOrder = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
};

const sampleOrders: readonly DemoOrder[] = [
  { id: '1042', customer: 'Sofia Amrani', items: 3, total: 185, status: 'preparing' },
  { id: '1041', customer: 'Adam Benali', items: 2, total: 120, status: 'ready' },
  { id: '1040', customer: 'Nora Idrissi', items: 4, total: 240, status: 'preparing' },
  { id: '1039', customer: 'Youssef Alaoui', items: 1, total: 65, status: 'ready' },
  { id: '1038', customer: 'Lina El Fassi', items: 2, total: 145, status: 'preparing' },
];

export type TableDemoProps = {
  initialSearch?: string;
  initialStatus?: StatusFilter;
  readOnly?: boolean;
  testID?: string;
};

/** Interactive native content; the screen or story supplies its Host. */
export function TableDemo({
  initialSearch = '',
  initialStatus = 'all',
  readOnly = false,
  testID = 'demo-table',
}: TableDemoProps) {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState(sampleOrders);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readyId, setReadyId] = useState<string | null>(null);
  const query = search.trim().toLocaleLowerCase();
  const filteredOrders = orders.filter(
    (order) =>
      (status === 'all' || order.status === status) &&
      `#${order.id} ${order.customer}`.toLocaleLowerCase().includes(query),
  );
  const selectedOrder = orders.find((order) => order.id === selectedId);
  const hasFilters = search.length > 0 || status !== 'all';
  const currency = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'en', {
    style: 'currency',
    currency: 'MAD',
  });
  const clearFilters = () => {
    setSearch('');
    setStatus('all');
  };
  const columns: readonly TableColumn<DemoOrder>[] = [
    {
      id: 'order',
      header: t('showcase.tableGallery.order'),
      width: 112,
      renderCell: (order) => (
        <Text fontWeight="600" testID={`${testID}-order-${order.id}`}>
          {`#${order.id}`}
        </Text>
      ),
    },
    {
      id: 'customer',
      header: t('showcase.tableGallery.customer'),
      width: 184,
      renderCell: (order) => (
        <Column spacing={spacing.xs}>
          <Text>{order.customer}</Text>
          <Text variant="caption" tone="muted">
            {t('showcase.tableGallery.items', { total: order.items })}
          </Text>
        </Column>
      ),
    },
    {
      id: 'status',
      header: t('showcase.tableGallery.status'),
      width: 140,
      renderCell: (order) => (
        <Text
          tone={order.status === 'ready' ? 'success' : 'warning'}
          testID={`${testID}-status-${order.id}`}
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
      renderCell: (order) => <Text>{currency.format(order.total)}</Text>,
    },
  ];

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID={`${testID}-demo`}>
      <Text variant="title">{t('showcase.tableGallery.title')}</Text>
      <Table
        rows={filteredOrders}
        columns={columns}
        keyExtractor={(order) => order.id}
        testID={testID}
        toolbar={
          <Column spacing={spacing.md} modifiers={nativeFillWidth}>
            <TextInput
              label={t('showcase.tableGallery.search')}
              placeholder={t('showcase.tableGallery.searchPlaceholder')}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              testID={`${testID}-search`}
            />
            <Row spacing={spacing.md} modifiers={nativeFillWidth}>
              <Text>{t('showcase.tableGallery.status')}</Text>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                testID={`${testID}-filter-status`}
              >
                <Picker.Item label={t('showcase.tableGallery.all')} value="all" />
                <Picker.Item label={t('showcase.tableGallery.preparing')} value="preparing" />
                <Picker.Item label={t('showcase.tableGallery.ready')} value="ready" />
              </Picker>
            </Row>
            <UniversalButtonContent
              variant="tertiary"
              label={t('showcase.tableGallery.clearFilters')}
              disabled={!hasFilters}
              onPress={clearFilters}
              testID={`${testID}-clear-filters`}
            />
            <Text tone="muted" variant="caption" testID={`${testID}-result-count`}>
              {t('showcase.tableGallery.resultCount', {
                visible: filteredOrders.length,
                total: orders.length,
              })}
            </Text>
            <TableOrderCharts orders={filteredOrders} currency={currency} testID={testID} />
          </Column>
        }
        emptyState={
          <Column spacing={spacing.md} modifiers={nativeFillWidth}>
            <Text fontWeight="600" testID={`${testID}-empty-title`}>
              {t('showcase.tableGallery.empty')}
            </Text>
            <Text tone="muted">{t('showcase.tableGallery.emptyHint')}</Text>
            <UniversalButtonContent
              variant="secondary"
              label={t('showcase.tableGallery.clearFilters')}
              onPress={clearFilters}
              testID={`${testID}-empty-reset`}
            />
          </Column>
        }
        actionsHeader={t('showcase.tableGallery.actions')}
        actionsWidth={140}
        renderActions={
          readOnly
            ? undefined
            : (order) => (
                <TableActions
                  label={t('showcase.tableGallery.actions')}
                  accessibilityLabel={t('showcase.tableGallery.actionsFor', { id: order.id })}
                  testID={`${testID}-actions-${order.id}`}
                  actions={[
                    {
                      id: 'view',
                      label: t('showcase.tableGallery.viewDetails'),
                      onPress: () => setSelectedId(order.id),
                    },
                    {
                      id: 'ready',
                      label: t('showcase.tableGallery.markReady'),
                      disabled: order.status === 'ready',
                      onPress: () => {
                        setOrders((current) =>
                          current.map((row) =>
                            row.id === order.id ? { ...row, status: 'ready' } : row,
                          ),
                        );
                        setReadyId(order.id);
                      },
                    },
                  ]}
                />
              )
        }
      />
      <Text variant="caption" tone="muted">
        {t('showcase.tableGallery.scrollHint')}
      </Text>
      {readyId ? (
        <Text tone="success" testID={`${testID}-feedback`}>
          {t('showcase.tableGallery.readyFeedback', { id: readyId })}
        </Text>
      ) : null}
      {selectedOrder ? (
        <Column spacing={spacing.sm} modifiers={nativeFillWidth} testID={`${testID}-details`}>
          <Text variant="subtitle">
            {t('showcase.tableGallery.detailsTitle', { id: selectedOrder.id })}
          </Text>
          <Text>{selectedOrder.customer}</Text>
          <Text tone="muted">
            {t('showcase.tableGallery.detailsSummary', {
              items: selectedOrder.items,
              total: currency.format(selectedOrder.total),
              status: t(`showcase.tableGallery.${selectedOrder.status}`),
            })}
          </Text>
          <UniversalButtonContent
            variant="tertiary"
            label={t('showcase.tableGallery.closeDetails')}
            onPress={() => setSelectedId(null)}
            testID={`${testID}-close-details`}
          />
        </Column>
      ) : null}
    </Column>
  );
}

export default function TableScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('showcase.table')} description={t('showcase.tableDescription')}>
      <PageSection>
        <TableDemo />
      </PageSection>
    </PageScreen>
  );
}
