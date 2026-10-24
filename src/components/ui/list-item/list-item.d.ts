import type { ListItem as NativeListItem, ListItemProps as NativeListItemProps } from '@expo/ui';
import type { ReactElement } from 'react';

export type ListItemProps = NativeListItemProps & { disabled?: boolean };

export declare const ListItem: {
  (props: ListItemProps): ReactElement;
  Leading: typeof NativeListItem.Leading;
  Supporting: typeof NativeListItem.Supporting;
  Trailing: typeof NativeListItem.Trailing;
};
