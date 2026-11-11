import { Picker as UniversalPicker, type PickerItemProps, type PickerItemValue } from '@expo/ui';
import { Picker as NativePicker, Text } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  disabled,
  onGeometryChange,
  pickerStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { isValidElement } from 'react';
import { flattenNativeChildren } from '../native/native-children';
import type { PickerProps } from './picker';

export function Picker<T extends PickerItemValue>({
  selectedValue,
  onValueChange,
  appearance = 'menu',
  enabled = true,
  children,
  testID,
  onLayoutChange,
}: Readonly<PickerProps<T>>) {
  const items = flattenNativeChildren(children).flatMap((child) =>
    isValidElement<PickerItemProps<T>>(child) && child.type === UniversalPicker.Item
      ? [child.props]
      : [],
  );
  return (
    <NativePicker
      selection={selectedValue}
      testID={testID}
      onSelectionChange={(value) => {
        if (enabled && value != null) onValueChange(value as T);
      }}
      modifiers={[
        pickerStyle(appearance),
        disabled(!enabled),
        ...(appearance === 'menu' ? [buttonStyle('glass')] : []),
        ...(onLayoutChange ? [onGeometryChange(onLayoutChange)] : []),
      ]}
    >
      {items.map((item) => (
        <Text key={`${typeof item.value}:${item.value}`} modifiers={[tag(item.value)]}>
          {item.label}
        </Text>
      ))}
    </NativePicker>
  );
}
Picker.Item = UniversalPicker.Item;
