import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { Picker, type PickerProps, type PickerItemValue } from '@components/ui';

export type UniversalPickerProps = Omit<PickerProps, 'children'> &
  NativeStoryTheme & {
    options: { label: string; value: PickerItemValue }[];
  };

export function UniversalPicker({
  colorScheme,
  seedColor,
  options,
  ...props
}: Readonly<UniversalPickerProps>) {
  return (
    <NativeStoryHost testID={props.testID} colorScheme={colorScheme} seedColor={seedColor}>
      <Picker {...props}>
        {options.map((item) => (
          <Picker.Item key={`${typeof item.value}:${item.value}`} {...item} />
        ))}
      </Picker>
    </NativeStoryHost>
  );
}
