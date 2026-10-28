import { ListItem as NativeListItem } from '@expo/ui';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { ListItemAction } from './list-item-action';
import type { ListItemProps } from './list-item';

/** The installed universal Android row does not forward testID. */
export function ListItem({
  disabled = false,
  onPress,
  testID,
  modifiers,
  ...props
}: Readonly<ListItemProps>) {
  const row = (
    <NativeListItem
      {...props}
      modifiers={[...(modifiers ?? []), ...(!onPress && testID ? [nativeTestID(testID)] : [])]}
    />
  );
  return onPress ? (
    <ListItemAction onPress={onPress} disabled={disabled} testID={testID}>
      {row}
    </ListItemAction>
  ) : (
    row
  );
}

ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from './list-item';
