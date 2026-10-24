import { radii, spacing } from '@/constants/layout';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { useThemeColors } from '@/hooks/use-theme';
import {
  Column,
  RNHostView,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  useHostLayoutDirection,
} from '@components/ui';
import { Canvas, Circle, Group, Path, RoundedRect, Skia } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

type ChartOrder = {
  id: string;
  total: number;
  status: 'preparing' | 'ready';
};

const barHeight = 12;
const donutHeight = 160;
const donutStrokeWidth = 20;

/** The bounded native parent sizes the RN bridge, including in narrower story canvases. */
function ChartPlot({
  height,
  testID,
  children,
}: {
  height: number;
  testID: string;
  children: (width: number) => ReactNode;
}) {
  const [width, setWidth] = useMeasuredWidth();

  return (
    <Column modifiers={nativeFillWidth}>
      {/* Keep height separate: iOS fill-width modifiers override style-derived frames. */}
      <Column style={{ height }}>
        <RNHostView matchContents={false}>
          <View
            style={{ flex: 1 }}
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            testID={testID}
          >
            <Canvas style={{ flex: 1 }} pointerEvents="none" accessible={false}>
              {width > 0 ? children(width) : null}
            </Canvas>
          </View>
        </RNHostView>
      </Column>
    </Column>
  );
}

/** Feature-local plots; titles, values and legends stay in the owning Expo UI Host. */
export function TableOrderCharts({
  orders,
  currency,
  testID,
}: {
  orders: readonly ChartOrder[];
  currency: Intl.NumberFormat;
  testID: string;
}) {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const isRTL = useHostLayoutDirection() === 'rightToLeft';
  const locale = i18n.resolvedLanguage ?? 'en';
  const number = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
  const totalValue = orders.reduce((total, order) => total + order.total, 0);
  const maxValue = orders.reduce((maximum, order) => Math.max(maximum, order.total), 0);
  const ready = orders.filter((order) => order.status === 'ready').length;
  const preparing = orders.length - ready;
  const readyRatio = orders.length > 0 ? ready / orders.length : 0;
  const cardStyle = {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.card,
  };

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={`${testID}-charts`}>
      <Text variant="subtitle">{t('showcase.tableGallery.charts.title')}</Text>
      <Text variant="caption" tone="muted">
        {t('showcase.tableGallery.charts.hint')}
      </Text>
      <Text fontWeight="600" testID={`${testID}-charts-total`}>
        {t('showcase.tableGallery.charts.totalValue', { total: currency.format(totalValue) })}
      </Text>
      {orders.length === 0 ? (
        <Text tone="muted" testID={`${testID}-charts-empty`}>
          {t('showcase.tableGallery.charts.empty')}
        </Text>
      ) : (
        <>
          <Column spacing={spacing.md} modifiers={nativeFillWidth} style={cardStyle}>
            <Text variant="label">{t('showcase.tableGallery.charts.valueTitle')}</Text>
            {orders.map((order) => (
              <Column key={order.id} spacing={spacing.sm} modifiers={nativeFillWidth}>
                <Text variant="caption" testID={`${testID}-chart-order-${order.id}-value`}>
                  {t('showcase.tableGallery.charts.orderValue', {
                    id: order.id,
                    total: currency.format(order.total),
                  })}
                </Text>
                <ChartPlot height={barHeight} testID={`${testID}-chart-order-${order.id}`}>
                  {(width) => {
                    const fillWidth = maxValue > 0 ? (order.total / maxValue) * width : 0;
                    return (
                      <>
                        <RoundedRect
                          x={0}
                          y={0}
                          width={width}
                          height={barHeight}
                          r={barHeight / 2}
                          color={colors.surfaceVariant}
                        />
                        {fillWidth > 0 ? (
                          <RoundedRect
                            x={isRTL ? width - fillWidth : 0}
                            y={0}
                            width={fillWidth}
                            height={barHeight}
                            r={barHeight / 2}
                            color={colors.tint}
                          />
                        ) : null}
                      </>
                    );
                  }}
                </ChartPlot>
              </Column>
            ))}
            <Text variant="caption" tone="muted">
              {t('showcase.tableGallery.charts.scale', {
                min: currency.format(0),
                max: currency.format(maxValue),
              })}
            </Text>
          </Column>
          <Column spacing={spacing.md} modifiers={nativeFillWidth} style={cardStyle}>
            <Text variant="label">{t('showcase.tableGallery.charts.statusTitle')}</Text>
            <ChartPlot height={donutHeight} testID={`${testID}-chart-status`}>
              {(width) => {
                const center = { x: width / 2, y: donutHeight / 2 };
                const radius = Math.max(
                  0,
                  (Math.min(width, donutHeight) - donutStrokeWidth) / 2 - 4,
                );
                const ring = Skia.Path.Circle(center.x, center.y, radius);
                return (
                  <>
                    <Circle
                      cx={center.x}
                      cy={center.y}
                      r={radius}
                      style="stroke"
                      strokeWidth={donutStrokeWidth}
                      color={colors.warning}
                    />
                    <Group origin={center} transform={[{ rotate: -Math.PI / 2 }]}>
                      <Path
                        path={ring}
                        style="stroke"
                        strokeWidth={donutStrokeWidth}
                        end={readyRatio}
                        color={colors.success}
                      />
                    </Group>
                  </>
                );
              }}
            </ChartPlot>
            <Text tone="success" testID={`${testID}-chart-ready`}>
              {t('showcase.tableGallery.charts.statusCount', {
                status: t('showcase.tableGallery.ready'),
                total: number.format(ready),
                percent: percent.format(readyRatio),
              })}
            </Text>
            <Text tone="warning" testID={`${testID}-chart-preparing`}>
              {t('showcase.tableGallery.charts.statusCount', {
                status: t('showcase.tableGallery.preparing'),
                total: number.format(preparing),
                percent: percent.format(1 - readyRatio),
              })}
            </Text>
          </Column>
        </>
      )}
    </Column>
  );
}
