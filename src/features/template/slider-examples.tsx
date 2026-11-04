import {
  ButtonContent,
  Column,
  Icon,
  Row,
  Slider,
  Switch,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  type IconName,
  type SliderProps,
} from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

export function SliderExamples() {
  const { t } = useTranslation();
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(0.65);
  const [textSize, setTextSize] = useState(18);
  const [disabled, setDisabled] = useState(false);

  return (
    <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
      <Text variant="caption" tone="muted">
        {t('componentCatalog.sliders.hint')}
      </Text>
      <Switch
        label={t('componentCatalog.sliders.disable')}
        value={disabled}
        onValueChange={setDisabled}
        testID="component-slider-disable"
      />
      <SliderExample
        title={t('componentCatalog.sliders.volume')}
        description={t('componentCatalog.sliders.bothIcons')}
        valueLabel={t('showcase.gallery.percent', { value: volume })}
        value={volume}
        onValueChange={setVolume}
        min={0}
        max={100}
        step={1}
        disabled={disabled}
        startIcon={Icon.select({ ios: 'speaker.fill', android: 'volume_mute' })}
        endIcon={Icon.select({ ios: 'speaker.wave.3.fill', android: 'volume_up' })}
        testID="component-slider"
      />
      <SliderExample
        title={t('componentCatalog.sliders.brightness')}
        description={t('componentCatalog.sliders.startIcon')}
        valueLabel={t('showcase.gallery.percent', { value: Math.round(brightness * 100) })}
        value={brightness}
        onValueChange={setBrightness}
        min={0}
        max={1}
        disabled={disabled}
        startIcon={Icon.select({ ios: 'sun.max.fill', android: 'brightness_7' })}
        testID="component-slider-brightness"
      />
      <SliderExample
        title={t('componentCatalog.sliders.textSize')}
        description={t('componentCatalog.sliders.endIcon')}
        valueLabel={t('componentCatalog.sliders.points', { value: textSize })}
        value={textSize}
        onValueChange={setTextSize}
        min={14}
        max={30}
        step={2}
        disabled={disabled}
        endIcon={Icon.select({ ios: 'textformat.size.larger', android: 'text_increase' })}
        testID="component-slider-text-size"
      />
      <Text variant="body" fontSize={textSize} testID="component-slider-text-preview">
        {t('componentCatalog.sliders.textPreview')}
      </Text>
      <ButtonContent
        variant="secondary"
        label={t('componentCatalog.sliders.reset')}
        disabled={disabled}
        fullWidth
        onPress={() => {
          setVolume(50);
          setBrightness(0.65);
          setTextSize(18);
        }}
        testID="component-slider-reset"
      />
    </Column>
  );
}

type SliderExampleProps = Omit<SliderProps, 'modifiers' | 'testID'> & {
  title: string;
  description: string;
  valueLabel: string;
  startIcon?: IconName;
  endIcon?: IconName;
  testID: string;
};

function SliderExample({
  title,
  description,
  valueLabel,
  startIcon,
  endIcon,
  testID,
  ...props
}: Readonly<SliderExampleProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const iconColor = props.disabled ? colors.textDisabled : colors.text;

  return (
    <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
      <Text variant="subtitle">{title}</Text>
      <Text variant="caption" tone="muted">
        {description}
      </Text>
      <Text testID={`${testID}-value`}>{valueLabel}</Text>
      <Row spacing={spacing.md} alignment="center" modifiers={nativeFillWidth}>
        {startIcon && <Icon name={startIcon} color={iconColor} testID={`${testID}-start-icon`} />}
        <Column modifiers={nativeRowWeight}>
          <Slider {...props} modifiers={nativeFillWidth} testID={testID} />
        </Column>
        {endIcon && <Icon name={endIcon} color={iconColor} testID={`${testID}-end-icon`} />}
      </Row>
    </Column>
  );
}
