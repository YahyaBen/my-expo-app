import { ListItem as NativeListItem } from '@expo/ui';
import type { ListItemProps } from './list-item';

export function ListItem({ colors, disabled = false, onPress, ...props }: Readonly<ListItemProps>) {
  return (
    <NativeListItem
      {...props}
      colors={{ ...colors, containerColor: colors?.containerColor ?? 'red' }}
      onPress={disabled ? undefined : onPress}
    />
  );
}

ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from './list-item';
