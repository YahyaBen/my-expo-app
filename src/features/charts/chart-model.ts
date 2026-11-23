export const chartKinds = [
  'line',
  'multi-line',
  'area',
  'stacked-area',
  'range-area',
  'bar',
  'grouped-bar',
  'stacked-bar',
  'horizontal-bar',
  'horizontal-grouped-bar',
  'horizontal-stacked-bar',
  'scatter',
  'candlestick',
  'pie',
  'donut',
] as const;

export type ChartKind = (typeof chartKinds)[number];

export type ChartDatum = {
  x: number;
  primary: number;
  secondary: number;
  tertiary: number;
  low: number;
  high: number;
  open: number;
  close: number;
};

export type ChartDataOptions = {
  pointCount: number;
  baseline: number;
  variation: number;
  seed: number;
};

export const defaultDataOptions: ChartDataOptions = {
  pointCount: 12,
  baseline: 50,
  variation: 25,
  seed: 1,
};

export type ChartStyleOptions = {
  curve: 'linear' | 'natural' | 'stepAfter';
  strokeWidth: number;
  opacity: number;
  barWidth: number;
  rounded: boolean;
  innerRadius: number;
  showGrid: boolean;
  showAxes: boolean;
  showPoints: boolean;
  showValues: boolean;
  animated: boolean;
};

export const defaultStyleOptions: ChartStyleOptions = {
  curve: 'natural',
  strokeWidth: 3,
  opacity: 0.65,
  barWidth: 0.65,
  rounded: true,
  innerRadius: 55,
  showGrid: true,
  showAxes: true,
  showPoints: false,
  showValues: true,
  animated: false,
};

/** Shared, repeatable sample data keeps comparisons between chart families meaningful. */
export function generateChartData({ pointCount, baseline, variation, seed }: ChartDataOptions) {
  const value = (amount: number) => Math.round(Math.max(1, amount) * 10) / 10;
  return Array.from({ length: Math.min(60, Math.max(2, Math.round(pointCount))) }, (_, index) => {
    const phase = index * 0.71 + seed * 0.83;
    const primary = value(
      baseline + variation * (Math.sin(phase) * 0.7 + Math.cos(phase * 0.47) * 0.3),
    );
    const secondary = value(baseline * 0.7 + variation * Math.cos(phase + 0.8) * 0.55);
    const tertiary = value(baseline * 0.4 + variation * Math.sin(phase * 0.8 + 1.5) * 0.35);
    const open = value(primary + Math.sin(phase + 1.2) * variation * 0.3);
    const close = primary;
    const low = value(Math.min(open, close) - Math.abs(Math.sin(phase)) * variation * 0.2 - 1);
    const high = value(Math.max(open, close) + Math.abs(Math.cos(phase)) * variation * 0.2 + 1);
    return { x: index + 1, primary, secondary, tertiary, open, close, low, high };
  });
}
