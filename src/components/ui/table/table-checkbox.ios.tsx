import { accessibilityLabel as nativeLabel, frame } from '@expo/ui/swift-ui/modifiers';
import { Checkbox } from '../checkbox/checkbox';
import type { TableCheckboxProps } from './table-checkbox';

export function TableCheckbox({ accessibilityLabel, ...props }: Readonly<TableCheckboxProps>) {
  return (
    <Checkbox {...props} modifiers={[nativeLabel(accessibilityLabel), frame({ minHeight: 44 })]} />
  );
}
