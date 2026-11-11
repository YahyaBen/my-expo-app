import type { PickerItemValue, PickerProps as NativePickerProps } from '@expo/ui';

export type PickerLayout = { x: number; y: number; width: number; height: number };
export interface PickerProps<
  T extends PickerItemValue = PickerItemValue,
> extends NativePickerProps<T> {
  /** Native frame relative to the window, in points/dp. */
  onLayoutChange?: (layout: PickerLayout) => void;
}
export declare function Picker<T extends PickerItemValue>(
  props: Readonly<PickerProps<T>>,
): import('react').ReactElement;
export declare namespace Picker {
  const Item: typeof import('@expo/ui').Picker.Item;
}
export type { PickerItemProps, PickerItemValue } from '@expo/ui';
