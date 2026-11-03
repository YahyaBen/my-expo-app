import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { Slider, type SliderProps } from '@components/ui';

export type UniversalSliderProps = SliderProps & NativeStoryTheme;

export function UniversalSlider({
  colorScheme,
  seedColor,
  ...props
}: Readonly<UniversalSliderProps>) {
  return (
    <NativeStoryHost testID={props.testID} colorScheme={colorScheme} seedColor={seedColor}>
      <Slider {...props} />
    </NativeStoryHost>
  );
}
