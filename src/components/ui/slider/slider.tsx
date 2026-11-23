import { Slider as NativeSlider, type SliderProps as NativeSliderProps } from '@expo/ui';
import { sliderAccessibility } from './slider-accessibility';

export type SliderProps = NativeSliderProps & {
  accessibilityLabel?: string;
  accessibilityValue?: string;
};

export function Slider({
  disabled,
  onValueChange,
  modifiers,
  accessibilityLabel,
  accessibilityValue,
  ...props
}: Readonly<SliderProps>) {
  return (
    <NativeSlider
      {...props}
      disabled={disabled}
      modifiers={[
        ...(modifiers ?? []),
        ...sliderAccessibility(accessibilityLabel, accessibilityValue),
      ]}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
    />
  );
}
