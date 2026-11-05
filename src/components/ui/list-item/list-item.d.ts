import type { ListItem as NativeListItem, ListItemProps as NativeListItemProps } from '@expo/ui';
import type { ReactElement } from 'react';

export type ListItemProps = NativeListItemProps & { disabled?: boolean };

export declare const ListItem: {
  (props: Readonly<ListItemProps>): ReactElement;
  /** Direct child of FieldGroup.Section. Omit onPress for a disabled row. */
  FieldRow: (props: Readonly<NativeListItemProps>) => ReactElement;
  Leading: typeof NativeListItem.Leading;
  Supporting: typeof NativeListItem.Supporting;
  Trailing: typeof NativeListItem.Trailing;
};
