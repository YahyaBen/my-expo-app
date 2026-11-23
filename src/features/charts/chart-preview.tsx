import { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Group, RoundedRect, Text as SkiaText, matchFont, type SkFont } from 'react-native-skia';
import {
  Area,
  AreaRange,
  Bar,
  BarGroup,
  Candlestick,
  CartesianChart,
  HorizontalBar,
  HorizontalBarGroup,
  HorizontalStackedBar,
  Line,
  Pie,
  PolarChart,
  Scatter,
  StackedArea,
  StackedBar,
  type CartesianChartRenderArg,
  type ChartBounds,
  type PieSliceData,
} from 'victory-native';
import type { ChartDatum, ChartKind, ChartStyleOptions } from './chart-model';

export const CHART_HEIGHT = 260;

type ValueKey = Exclude<keyof ChartDatum, 'x'>;
type ChartPreviewProps = {
  kind: ChartKind;
  data: ChartDatum[];
  options: ChartStyleOptions;
  width: number;
  animate: boolean;
  palette: readonly [string, string, string];
  textColor: string;
  gridColor: string;
  accessibilityLabel: string;
  locale: string;
  backgroundColor: string;
};

/** Only Skia artwork lives in this bridge; the gallery owns its native controls and labels. */
export function ChartPreview({
  kind,
  data,
  options,
  width,
  animate,
  palette,
  textColor,
  gridColor,
  accessibilityLabel,
  locale,
  backgroundColor,
}: Readonly<ChartPreviewProps>) {
  const { fontScale } = useWindowDimensions();
  const font = useMemo(() => matchFont({ fontSize: 11 * fontScale }), [fontScale]);
  const animation =
    animate && options.animated ? { type: 'timing' as const, duration: 300 } : undefined;
  const horizontal = kind.startsWith('horizontal-');
  const polar = kind === 'pie' || kind === 'donut';
  const pieDiameter = Math.max(1, Math.min(width, CHART_HEIGHT) - 24);
  const stacked = kind.includes('stacked');
  const multiple =
    stacked || kind.includes('grouped') || kind === 'multi-line' || kind === 'scatter';
  const range = kind === 'range-area' || kind === 'candlestick';
  const valueKeys: ValueKey[] = range
    ? ['primary', 'low', 'high', 'open', 'close']
    : multiple
      ? ['primary', 'secondary', 'tertiary']
      : ['primary'];
  const maximum = Math.max(
    1,
    ...data.map((datum) =>
      stacked
        ? datum.primary + datum.secondary + datum.tertiary
        : range
          ? datum.high
          : multiple
            ? Math.max(datum.primary, datum.secondary, datum.tertiary)
            : datum.primary,
    ),
  );
  const roundedCorners = options.rounded
    ? { topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4 }
    : undefined;
  const size = { width, height: CHART_HEIGHT };
  const axes = {
    font: options.showAxes ? font : undefined,
    labelColor: textColor,
    tickCount: 4,
    lineColor: gridColor,
    lineWidth: options.showGrid ? 0.5 : 0,
    labelOffset: 4,
  };
  const format = (value: number) => value.toLocaleString(locale, { maximumFractionDigits: 1 });

  function values({
    points,
    chartBounds,
    xScale,
    yScale,
  }: CartesianChartRenderArg<ChartDatum, ValueKey>) {
    const numericValues = data.map((datum) =>
      stacked
        ? datum.primary + datum.secondary + datum.tertiary
        : kind === 'candlestick'
          ? datum.close
          : datum.primary,
    );
    const span = horizontal
      ? chartBounds.bottom - chartBounds.top
      : chartBounds.right - chartBounds.left;
    // Match Victory's first bar center: three series, with 12% within-group padding.
    const groupWidth = (options.barWidth * span) / Math.max(1, data.length);
    const primaryOffset = kind.includes('grouped') ? -groupWidth / 2 + (0.88 * groupWidth) / 6 : 0;
    const source = kind === 'candlestick' ? points.close : points.primary;
    const positions = source.map((point, index) => ({
      x:
        horizontal && stacked
          ? xScale(numericValues[index])
          : point.x + (!horizontal ? primaryOffset : 0),
      y:
        !horizontal && stacked
          ? yScale(numericValues[index])
          : point.y == null
            ? null
            : point.y + (horizontal ? primaryOffset : 0),
    }));
    const labelSpacing = horizontal
      ? font.getSize() + 14
      : Math.max(...numericValues.map((value) => font.measureText(format(value)).width)) + 14;
    const stride = Math.max(1, Math.ceil((data.length * labelSpacing) / Math.max(1, span)));

    return positions.map((point, index) => {
      if (point.y == null || index % stride !== 0) return null;
      const text = format(numericValues[index]);
      return (
        <ValueLabel
          key={index}
          text={text}
          x={point.x + (horizontal ? font.measureText(text).width / 2 + 9 : 0)}
          y={point.y - (horizontal ? 0 : font.getSize() + 10)}
          font={font}
          color={textColor}
          backgroundColor={backgroundColor}
          bounds={chartBounds}
        />
      );
    });
  }

  function marks({ points, chartBounds }: CartesianChartRenderArg<ChartDatum, ValueKey>) {
    const series = [points.primary, points.secondary, points.tertiary];
    const commonLine = {
      curveType: options.curve,
      strokeWidth: options.strokeWidth,
      animate: animation,
    };
    switch (kind) {
      case 'line':
      case 'multi-line':
        return (
          <>
            {(kind === 'multi-line' ? series : [points.primary]).map((values, index) => (
              <Group key={index}>
                <Line points={values} color={palette[index]} {...commonLine} />
                {options.showPoints ? (
                  <Scatter
                    points={values}
                    color={palette[index]}
                    radius={options.strokeWidth + 2}
                    animate={animation}
                  />
                ) : null}
              </Group>
            ))}
          </>
        );
      case 'area':
        return (
          <>
            <Area
              points={points.primary}
              y0={chartBounds.bottom}
              color={palette[0]}
              curveType={options.curve}
              animate={animation}
            />
            <Line points={points.primary} color={palette[0]} {...commonLine} />
            {options.showPoints ? (
              <Scatter
                points={points.primary}
                color={palette[0]}
                radius={options.strokeWidth + 2}
                animate={animation}
              />
            ) : null}
          </>
        );
      case 'stacked-area':
        return (
          <StackedArea
            points={series}
            y0={chartBounds.bottom}
            colors={[...palette]}
            curveType={options.curve}
            animate={animation}
          />
        );
      case 'range-area':
        return (
          <>
            <AreaRange
              upperPoints={points.high}
              lowerPoints={points.low}
              color={palette[0]}
              curveType={options.curve}
              animate={animation}
            />
            <Line points={points.high} color={palette[0]} {...commonLine} />
            <Line points={points.low} color={palette[0]} {...commonLine} />
            <Line points={points.primary} color={palette[1]} {...commonLine} />
            {options.showPoints ? (
              <Scatter
                points={points.primary}
                color={palette[1]}
                radius={options.strokeWidth + 2}
                animate={animation}
              />
            ) : null}
          </>
        );
      case 'bar':
        return (
          <Bar
            points={points.primary}
            chartBounds={chartBounds}
            color={palette[0]}
            innerPadding={1 - options.barWidth}
            roundedCorners={roundedCorners}
            animate={animation}
          />
        );
      case 'grouped-bar':
        return (
          <BarGroup
            chartBounds={chartBounds}
            betweenGroupPadding={1 - options.barWidth}
            withinGroupPadding={0.12}
            roundedCorners={roundedCorners}
          >
            {series.map((values, index) => (
              <BarGroup.Bar
                key={index}
                points={values}
                color={palette[index]}
                animate={animation}
              />
            ))}
          </BarGroup>
        );
      case 'stacked-bar':
        return (
          <StackedBar
            points={series}
            chartBounds={chartBounds}
            colors={[...palette]}
            innerPadding={1 - options.barWidth}
            barOptions={() => ({ roundedCorners })}
            animate={animation}
          />
        );
      case 'horizontal-bar':
        return (
          <HorizontalBar
            points={points.primary}
            chartBounds={chartBounds}
            color={palette[0]}
            innerPadding={1 - options.barWidth}
            roundedCorners={roundedCorners}
            animate={animation}
          />
        );
      case 'horizontal-grouped-bar':
        return (
          <HorizontalBarGroup
            chartBounds={chartBounds}
            betweenGroupPadding={1 - options.barWidth}
            withinGroupPadding={0.12}
            roundedCorners={roundedCorners}
          >
            {series.map((values, index) => (
              <HorizontalBarGroup.Bar
                key={index}
                points={values}
                color={palette[index]}
                animate={animation}
              />
            ))}
          </HorizontalBarGroup>
        );
      case 'horizontal-stacked-bar':
        return (
          <HorizontalStackedBar
            points={series}
            chartBounds={chartBounds}
            colors={[...palette]}
            innerPadding={1 - options.barWidth}
            barOptions={() => ({ roundedCorners })}
            animate={animation}
          />
        );
      case 'scatter':
        return (
          <>
            {series.map((values, index) => (
              <Scatter
                key={index}
                points={values}
                color={palette[index]}
                radius={options.strokeWidth + 3}
                shape={index === 0 ? 'circle' : index === 1 ? 'square' : 'star'}
                animate={animation}
              />
            ))}
          </>
        );
      case 'candlestick':
        return (
          <Candlestick
            openPoints={points.open}
            closePoints={points.close}
            highPoints={points.high}
            lowPoints={points.low}
            chartBounds={chartBounds}
            candleRatio={options.barWidth}
            candleColors={{ positive: palette[0], negative: palette[1], neutral: palette[2] }}
            wickStrokeWidth={options.strokeWidth}
            animate={animation}
          />
        );
      default:
        return null;
    }
  }

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      testID={`chart-preview-${kind}`}
      style={size}
    >
      <View
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={size}
      >
        {polar ? (
          <PolarChart
            data={data.map((datum, index) => ({
              value: datum.primary,
              color: palette[index % palette.length],
              label: String(index),
            }))}
            valueKey="value"
            colorKey="color"
            labelKey="label"
            explicitSize={size}
          >
            <Pie.Chart
              innerRadius={kind === 'donut' ? `${options.innerRadius}%` : 0}
              size={pieDiameter}
            >
              {({ slice }) => (
                <PieSegment
                  slice={slice}
                  showValue={options.showValues}
                  text={format(slice.value)}
                  font={font}
                  textColor={textColor}
                  backgroundColor={backgroundColor}
                  gridColor={gridColor}
                  opacity={options.opacity}
                  animation={animation}
                />
              )}
            </Pie.Chart>
          </PolarChart>
        ) : (
          <CartesianChart
            data={data}
            xKey="x"
            yKeys={valueKeys}
            orientation={horizontal ? 'horizontal' : 'vertical'}
            explicitSize={size}
            padding={12}
            domain={horizontal ? { x: [0, maximum * 1.1] } : { y: [0, maximum * 1.1] }}
            domainPadding={horizontal ? { top: 10, bottom: 10 } : { left: 12, right: 12 }}
            xAxis={{
              ...axes,
              tickValues: horizontal ? undefined : data.map((sample) => sample.x),
              formatXLabel: format,
              title: options.showAxes ? { text: 'X' } : undefined,
            }}
            yAxis={[
              {
                ...axes,
                formatYLabel: format,
                title: options.showAxes ? { text: 'Y' } : undefined,
              },
            ]}
            frame={{ lineColor: gridColor, lineWidth: options.showAxes ? 0.5 : 0 }}
          >
            {(args) => (
              <>
                <Group opacity={options.opacity}>{marks(args)}</Group>
                {options.showValues ? values(args) : null}
              </>
            )}
          </CartesianChart>
        )}
      </View>
    </View>
  );
}

function ValueLabel({
  text,
  x,
  y,
  font,
  color,
  backgroundColor,
  bounds,
}: Readonly<{
  text: string;
  x: number;
  y: number;
  font: SkFont;
  color: string;
  backgroundColor: string;
  bounds: ChartBounds;
}>) {
  const metrics = font.getMetrics();
  const width = font.measureText(text).width + 8;
  const height = metrics.descent - metrics.ascent + 6;
  const left = Math.max(bounds.left, Math.min(x - width / 2, bounds.right - width));
  const top = Math.max(bounds.top, Math.min(y - height / 2, bounds.bottom - height));
  return (
    <Group>
      <RoundedRect x={left} y={top} width={width} height={height} r={4} color={backgroundColor} />
      <SkiaText x={left + 4} y={top + 3 - metrics.ascent} text={text} font={font} color={color} />
    </Group>
  );
}

function PieSegment({
  slice,
  showValue,
  text,
  font,
  textColor,
  backgroundColor,
  gridColor,
  opacity,
  animation,
}: Readonly<{
  slice: PieSliceData;
  showValue: boolean;
  text: string;
  font: SkFont;
  textColor: string;
  backgroundColor: string;
  gridColor: string;
  opacity: number;
  animation: { type: 'timing'; duration: number } | undefined;
}>) {
  const labelRadius = (slice.innerRadius + slice.radius) / 2;
  const textWidth = font.measureText(text).width + 12;
  const arcLength = (slice.sweepAngle / 180) * Math.PI * labelRadius;
  const fits = arcLength > textWidth && slice.radius - slice.innerRadius > font.getSize() + 8;
  return (
    <>
      <Group opacity={opacity}>
        <Pie.Slice animate={animation} />
        <Pie.SliceAngularInset
          angularInset={{ angularStrokeWidth: 1, angularStrokeColor: gridColor }}
          animate={animation}
        />
      </Group>
      {showValue && fits ? (
        <Pie.Label radiusOffset={labelRadius / slice.radius}>
          {({ x, y }) => (
            <ValueLabel
              text={text}
              x={x}
              y={y}
              font={font}
              color={textColor}
              backgroundColor={backgroundColor}
              bounds={{
                left: slice.center.x - slice.radius,
                right: slice.center.x + slice.radius,
                top: slice.center.y - slice.radius,
                bottom: slice.center.y + slice.radius,
              }}
            />
          )}
        </Pie.Label>
      ) : null}
    </>
  );
}
