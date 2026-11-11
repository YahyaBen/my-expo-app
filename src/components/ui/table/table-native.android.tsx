import { semantics } from '@expo/ui/jetpack-compose/modifiers';
import { Checkbox } from '../checkbox/checkbox';
import { ListItem } from '../list-item/list-item';
import type { TableCheckboxProps, TableRowProps } from './table-native';

export { onSizeChanged as onTableViewportLayout } from '@expo/ui/jetpack-compose/modifiers';

// Material ListItem adds these insets around its headline slot.
export const tableRowInsets = { start: 16, end: 16 };

export function TableCheckbox({ accessibilityLabel, ...props }: Readonly<TableCheckboxProps>) {
  return (
    <Checkbox {...props} modifiers={[semantics({ contentDescription: accessibilityLabel })]} />
  );
}

export function TableRow({ accessibilityLabel, ...props }: Readonly<TableRowProps>) {
  return (
    <ListItem
      {...props}
      modifiers={accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []}
    />
  );
}
