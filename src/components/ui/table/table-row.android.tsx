import { semantics } from '@expo/ui/jetpack-compose/modifiers';
import { ListItem } from '../list-item/list-item';
import type { TableRowProps } from './table-row';

// Material ListItem adds these insets around its headline slot.
export const tableRowInsets = { start: 16, end: 16 };

export function TableRow({ accessibilityLabel, ...props }: Readonly<TableRowProps>) {
  return (
    <ListItem
      {...props}
      modifiers={accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []}
    />
  );
}
