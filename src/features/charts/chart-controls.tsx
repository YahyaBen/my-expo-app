import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonContent,
  Collapsible,
  Column,
  Picker,
  Slider,
  Switch,
  UniversalTextContent as Text,
  nativeFillWidth,
  type SliderProps,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import type { ChartDataOptions, ChartStyleOptions } from './chart-model';

export type ChartPalette = 'theme' | 'ocean' | 'sunset';

export function ChartControls({
  dataOptions,
  styleOptions,
  palette,
  onDataChange,
  onStyleChange,
  onPaletteChange,
  onReset,
}: Readonly<{
  dataOptions: ChartDataOptions;
  styleOptions: ChartStyleOptions;
  palette: ChartPalette;
  onDataChange: (next: ChartDataOptions) => void;
  onStyleChange: (next: ChartStyleOptions) => void;
  onPaletteChange: (next: ChartPalette) => void;
  onReset: () => void;
}>) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const format = (value: number) => value.toLocaleString(i18n.resolvedLanguage);

  return (
    <Collapsible label={t('charts.customize')} isOpen={open} onOpenChange={setOpen}>
      <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="charts-controls">
        <Text variant="subtitle">{t('charts.dataControls')}</Text>
        <ChartSlider
          label={t('charts.pointCount')}
          valueLabel={t('charts.pointCountValue', { count: dataOptions.pointCount })}
          value={dataOptions.pointCount}
          min={4}
          max={24}
          step={1}
          onValueChange={(pointCount) => onDataChange({ ...dataOptions, pointCount })}
          testID="charts-samples"
        />
        <ChartSlider
          label={t('charts.baseline')}
          valueLabel={format(dataOptions.baseline)}
          value={dataOptions.baseline}
          min={10}
          max={100}
          step={1}
          onValueChange={(baseline) => onDataChange({ ...dataOptions, baseline })}
          testID="charts-baseline"
        />
        <ChartSlider
          label={t('charts.variation')}
          valueLabel={format(dataOptions.variation)}
          value={dataOptions.variation}
          min={0}
          max={60}
          step={1}
          onValueChange={(variation) => onDataChange({ ...dataOptions, variation })}
          testID="charts-variation"
        />
        <ButtonContent
          variant="secondary"
          label={t('charts.regenerate')}
          onPress={() => onDataChange({ ...dataOptions, seed: dataOptions.seed + 1 })}
          testID="charts-regenerate"
        />
        <Text variant="subtitle">{t('charts.styleControls')}</Text>
        <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
          <Text>{t('charts.palette')}</Text>
          <Picker<ChartPalette>
            selectedValue={palette}
            onValueChange={onPaletteChange}
            testID="charts-palette"
          >
            {(['theme', 'ocean', 'sunset'] as const).map((id) => (
              <Picker.Item key={id} value={id} label={t(`charts.palettes.${id}`)} />
            ))}
          </Picker>
        </Column>
        <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
          <Text>{t('charts.curve')}</Text>
          <Picker<ChartStyleOptions['curve']>
            selectedValue={styleOptions.curve}
            onValueChange={(curve) => onStyleChange({ ...styleOptions, curve })}
            testID="charts-curve"
          >
            {(['linear', 'natural', 'stepAfter'] as const).map((id) => (
              <Picker.Item key={id} value={id} label={t(`charts.curves.${id}`)} />
            ))}
          </Picker>
        </Column>
        <ChartSlider
          label={t('charts.strokeWidth')}
          valueLabel={t('charts.points', { value: format(styleOptions.strokeWidth) })}
          value={styleOptions.strokeWidth}
          min={1}
          max={6}
          step={1}
          onValueChange={(strokeWidth) => onStyleChange({ ...styleOptions, strokeWidth })}
          testID="charts-stroke-width"
        />
        <ChartSlider
          label={t('charts.opacity')}
          valueLabel={t('charts.percent', {
            value: format(Math.round(styleOptions.opacity * 100)),
          })}
          value={styleOptions.opacity}
          min={0.2}
          max={1}
          step={0.05}
          onValueChange={(opacity) => onStyleChange({ ...styleOptions, opacity })}
          testID="charts-opacity"
        />
        <Text variant="subtitle">{t('charts.seriesControls')}</Text>
        <ChartSlider
          label={t('charts.barWidth')}
          valueLabel={t('charts.percent', {
            value: format(Math.round(styleOptions.barWidth * 100)),
          })}
          value={styleOptions.barWidth}
          min={0.2}
          max={0.9}
          step={0.05}
          onValueChange={(barWidth) => onStyleChange({ ...styleOptions, barWidth })}
          testID="charts-bar-width"
        />
        <ChartSlider
          label={t('charts.innerRadius')}
          valueLabel={t('charts.percent', { value: format(styleOptions.innerRadius) })}
          value={styleOptions.innerRadius}
          min={0}
          max={80}
          step={5}
          onValueChange={(innerRadius) => onStyleChange({ ...styleOptions, innerRadius })}
          testID="charts-donut-hole"
        />
        <Switch
          label={t('charts.rounded')}
          value={styleOptions.rounded}
          onValueChange={(rounded) => onStyleChange({ ...styleOptions, rounded })}
          testID="charts-rounded"
        />
        <Switch
          label={t('charts.showGrid')}
          value={styleOptions.showGrid}
          onValueChange={(showGrid) => onStyleChange({ ...styleOptions, showGrid })}
          testID="charts-grid"
        />
        <Switch
          label={t('charts.showAxes')}
          value={styleOptions.showAxes}
          onValueChange={(showAxes) => onStyleChange({ ...styleOptions, showAxes })}
          testID="charts-axes"
        />
        <Switch
          label={t('charts.showPoints')}
          value={styleOptions.showPoints}
          onValueChange={(showPoints) => onStyleChange({ ...styleOptions, showPoints })}
          testID="charts-points"
        />
        <Switch
          label={t('charts.showValues')}
          value={styleOptions.showValues}
          onValueChange={(showValues) => onStyleChange({ ...styleOptions, showValues })}
          testID="charts-values"
        />
        <Switch
          label={t('charts.animated')}
          value={styleOptions.animated}
          onValueChange={(animated) => onStyleChange({ ...styleOptions, animated })}
          testID="charts-animate"
        />
        <Text variant="caption" tone="muted">
          {t('charts.animationsHint')}
        </Text>
        <ButtonContent
          variant="secondary"
          label={t('charts.reset')}
          onPress={onReset}
          testID="charts-reset"
        />
      </Column>
    </Collapsible>
  );
}

function ChartSlider({
  label,
  valueLabel,
  ...props
}: Readonly<SliderProps & { label: string; valueLabel: string }>) {
  return (
    <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
      <Text>{`${label}: ${valueLabel}`}</Text>
      <Slider {...props} accessibilityLabel={label} accessibilityValue={valueLabel} />
    </Column>
  );
}
