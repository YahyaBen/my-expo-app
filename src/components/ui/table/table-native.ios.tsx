import { Column } from '@expo/ui';
import { accessibilityLabel as nativeLabel, frame } from '@expo/ui/swift-ui/modifiers';
import { Checkbox } from '../checkbox/checkbox';
import { ListItem } from '../list-item/list-item';
import type { TableCheckboxProps, TableRowProps } from './table-native';

export { onGeometryChange as onTableViewportLayout } from '@expo/ui/swift-ui/modifiers';

// ListItem's headline is followed by its native spacing and flexible spacer.
export const tableRowInsets = { start: 0, end: 32 };

export function TableCheckbox({ accessibilityLabel, ...props }: Readonly<TableCheckboxProps>) {
  return (
    <Checkbox {...props} modifiers={[nativeLabel(accessibilityLabel), frame({ minHeight: 44 })]} />
  );
}

export function TableRow({ children, accessibilityLabel, ...props }: Readonly<TableRowProps>) {
  return (
    <ListItem {...props} modifiers={accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []}>
      <Column modifiers={[frame({ minHeight: 44 })]}>{children}</Column>
    </ListItem>
  );
}
