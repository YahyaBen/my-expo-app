import { Picker as UniversalPicker, type PickerItemProps, type PickerItemValue } from '@expo/ui';
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Text,
  TextField,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import {
  menuAnchor,
  onGloballyPositioned,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import { isValidElement, useEffect, useState } from 'react';
import { flattenNativeChildren } from '../native/native-children';
import type { PickerProps } from './picker';

export function Picker<T extends PickerItemValue>({
  selectedValue,
  onValueChange,
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
  const [expanded, setExpanded] = useState(false);
  const selectedLabel = items.find((item) => item.value === selectedValue)?.label ?? '';
  const labelState = useNativeState(selectedLabel);
  useEffect(() => {
    labelState.set(selectedLabel);
  }, [labelState, selectedLabel]);
  if (!enabled && expanded) setExpanded(false);
  return (
    <ExposedDropdownMenuBox
      expanded={enabled && expanded}
      onExpandedChange={enabled ? setExpanded : undefined}
    >
      <TextField
        value={labelState}
        readOnly
        enabled={enabled}
        modifiers={[
          menuAnchor(),
          ...(testID ? [nativeTestID(testID)] : []),
          ...(onLayoutChange ? [onGloballyPositioned(onLayoutChange)] : []),
        ]}
      />
      <ExposedDropdownMenu
        expanded={enabled && expanded}
        onDismissRequest={() => setExpanded(false)}
      >
        {items.map((item, index) => (
          <DropdownMenuItem
            key={`${typeof item.value}:${item.value}`}
            enabled={enabled}
            modifiers={testID ? [nativeTestID(`${testID}-option-${index}`)] : undefined}
            onClick={
              enabled
                ? () => {
                    onValueChange(item.value);
                    setExpanded(false);
                  }
                : undefined
            }
          >
            <DropdownMenuItem.Text>
              <Text>{item.label}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  );
}
Picker.Item = UniversalPicker.Item;
