import { Column } from '@expo/ui';
import { accessibilityLabel as nativeLabel, frame } from '@expo/ui/swift-ui/modifiers';
import { ListItem } from '../list-item/list-item';
import type { TableRowProps } from './table-row';

// ListItem's headline is followed by its native spacing and flexible spacer.
export const tableRowInsets = { start: 0, end: 32 };

export function TableRow({ children, accessibilityLabel, ...props }: Readonly<TableRowProps>) {
  return (
    <ListItem {...props} modifiers={accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []}>
      <Column modifiers={[frame({ minHeight: 44 })]}>{children}</Column>
    </ListItem>
  );
}
