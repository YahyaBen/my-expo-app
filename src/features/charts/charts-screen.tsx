import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import {
  Collapsible,
  Column,
  List,
  ListForEach,
  PageScreen,
  PageSection,
  RNHostView,
  Table,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  usePageHeaderInset,
  type TableColumn,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { ChartControls, type ChartPalette } from './chart-controls';
import {
  chartKinds,
  defaultDataOptions,
  defaultStyleOptions,
  generateChartData,
  type ChartDatum,
  type ChartKind,
  type ChartStyleOptions,
} from './chart-model';
import { ChartPreview, CHART_HEIGHT } from './chart-preview';

const chartKey = (kind: ChartKind) => kind;
const sampleKey = (sample: ChartDatum) => String(sample.x);

export default function ChartsScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('charts.title')} scrollable={false}>
      <ChartGallery />
    </PageScreen>
  );
}

function ChartGallery() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const headerInset = usePageHeaderInset();
  const { fontScale } = useWindowDimensions();
  const [dataOptions, setDataOptions] = useState(defaultDataOptions);
  const [styleOptions, setStyleOptions] = useState(defaultStyleOptions);
  const [palette, setPalette] = useState<ChartPalette>('theme');
  const animate = useMotionEnabled(focused && styleOptions.animated);
  const data = generateChartData(dataOptions);
  const renderChart = useCallback(
    ({ item }: { item: ChartKind }) => (
      <ChartCard
        key={item}
        kind={item}
        data={data}
        options={styleOptions}
        paletteId={palette}
        animate={animate}
        focused={focused}
      />
    ),
    [data, styleOptions, palette, animate, focused],
  );

  return (
    <List testID="charts-gallery">
      <PageSection style={{ paddingTop: headerInset + spacing.lg }}>
        <Text>{t('charts.intro')}</Text>
        <Text variant="caption" tone="muted">
          {`${t('charts.sampleData')} · ${t('charts.pointCountValue', { count: data.length })}`}
        </Text>
        <ChartControls
          dataOptions={dataOptions}
          styleOptions={styleOptions}
          palette={palette}
          onDataChange={setDataOptions}
          onStyleChange={setStyleOptions}
          onPaletteChange={setPalette}
          onReset={() => {
            setDataOptions(defaultDataOptions);
            setStyleOptions(defaultStyleOptions);
            setPalette('theme');
          }}
        />
      </PageSection>
      <ListForEach
        data={chartKinds}
        keyExtractor={chartKey}
        estimatedItemSize={600 * Math.max(1, fontScale)}
        overscanCount={1}
      >
        {renderChart}
      </ListForEach>
      <SampleValues data={data} />
    </List>
  );
}

function ChartCard({
  kind,
  data,
  options,
  paletteId,
  animate,
  focused,
}: Readonly<{
  kind: ChartKind;
  data: ChartDatum[];
  options: ChartStyleOptions;
  paletteId: ChartPalette;
  animate: boolean;
  focused: boolean;
}>) {
  const { t, i18n } = useTranslation();
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const [width, updateWidth] = useMeasuredWidth();
  const format = (value: number) =>
    value.toLocaleString(i18n.resolvedLanguage, { maximumFractionDigits: 1 });
  const palette: readonly [string, string, string] =
    paletteId === 'theme'
      ? [colors.info ?? '#0369A1', colors.success ?? '#0F766E', colors.warning ?? '#8A5A00']
      : paletteId === 'ocean'
        ? scheme === 'dark'
          ? ['#38BDF8', '#2DD4BF', '#A5B4FC']
          : ['#0369A1', '#0F766E', '#6D28D9']
        : scheme === 'dark'
          ? ['#FB923C', '#FB7185', '#C084FC']
          : ['#C2410C', '#BE123C', '#7E22CE'];
  const summary = {
    latest: format(data[data.length - 1].primary),
    min: format(Math.min(...data.map((sample) => sample.primary))),
    max: format(Math.max(...data.map((sample) => sample.primary))),
  };
  const title = t(`charts.kinds.${kind}`);
  const legend =
    kind === 'candlestick'
      ? (['positive', 'negative', 'neutral'] as const)
      : kind === 'multi-line' ||
          kind.includes('stacked') ||
          kind.includes('grouped') ||
          kind === 'scatter'
        ? (['series.primary', 'series.secondary', 'series.tertiary'] as const)
        : [];
  const polar = kind === 'pie' || kind === 'donut';
  const horizontal = kind.startsWith('horizontal-');

  return (
    <PageSection spacing={spacing.md} testID={`chart-card-${kind}`}>
      <Text variant="subtitle">{title}</Text>
      <Text variant="caption" tone="muted">
        {t(`charts.descriptions.${kind}`)}
      </Text>
      {!polar && options.showAxes ? (
        <Text variant="caption" tone="muted" testID={`chart-axis-labels-${kind}`}>
          {`X: ${t(horizontal ? 'charts.value' : 'charts.sample')} · Y: ${t(horizontal ? 'charts.sample' : 'charts.value')}`}
        </Text>
      ) : null}
      <RNHostView matchContents={{ vertical: true }}>
        <View
          style={{ height: CHART_HEIGHT, width: '100%' }}
          onLayout={({ nativeEvent }) => updateWidth(nativeEvent.layout.width)}
        >
          {width > 0 && focused ? (
            <ChartPreview
              key={kind}
              kind={kind}
              data={data}
              options={options}
              width={width}
              animate={animate}
              palette={palette}
              textColor={colors.muted ?? '#737373'}
              gridColor={colors.border ?? '#E5E5E5'}
              backgroundColor={colors.surface ?? (scheme === 'dark' ? '#171717' : '#FFFFFF')}
              locale={i18n.resolvedLanguage ?? 'en'}
              accessibilityLabel={t('charts.accessibility', {
                chart: title,
                count: data.length,
                ...summary,
              })}
            />
          ) : null}
        </View>
      </RNHostView>
      {legend.length > 0 ? (
        <Column spacing={spacing.xs} modifiers={nativeFillWidth}>
          {legend.map((label, index) => (
            <Text key={label} variant="caption" textStyle={{ color: palette[index] }}>
              {t(`charts.${label}`)}
            </Text>
          ))}
        </Column>
      ) : null}
      <Text variant="caption" tone="muted">
        {`${t('charts.series.primary')}: ${t('charts.summary', summary)}`}
      </Text>
    </PageSection>
  );
}

function SampleValues({ data }: Readonly<{ data: ChartDatum[] }>) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const fields = ['x', 'primary', 'secondary', 'tertiary', 'open', 'high', 'low', 'close'] as const;
  const labels = [
    'sample',
    'value',
    'secondaryValue',
    'tertiaryValue',
    'open',
    'high',
    'low',
    'close',
  ];
  const columns: TableColumn<ChartDatum>[] = fields.map((field, index) => ({
    id: field,
    header: t(`charts.${labels[index]}`),
    width: 112,
    renderCell: (sample) =>
      sample[field].toLocaleString(i18n.resolvedLanguage, { maximumFractionDigits: 1 }),
  }));
  return (
    <PageSection>
      <Collapsible label={t('charts.dataPreview')} isOpen={open} onOpenChange={setOpen}>
        {open ? (
          <Table
            rows={data}
            columns={columns}
            keyExtractor={sampleKey}
            emptyState={t('charts.empty')}
            testID="charts-sample-values"
          />
        ) : null}
      </Collapsible>
    </PageSection>
  );
}
