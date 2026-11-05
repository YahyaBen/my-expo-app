import { ListItem as NativeListItem } from '@expo/ui';
import { disabled as nativeDisabled } from '@expo/ui/swift-ui/modifiers';
import { nativeFillWidth } from '../native/native-fill-width';
import type { ListItemProps } from './list-item';

export function ListItem({
  disabled = false,
  onPress,
  modifiers,
  ...props
}: Readonly<ListItemProps>) {
  return (
    <NativeListItem
      {...props}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        ...nativeFillWidth,
        ...(modifiers ?? []),
        ...(disabled ? [nativeDisabled()] : []),
      ]}
    />
  );
}

ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from './list-item';
