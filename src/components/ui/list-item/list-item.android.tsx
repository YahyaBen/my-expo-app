import { ListItem as NativeListItem } from '@expo/ui';
import { nativeFillWidth } from '../native/native-fill-width';
import type { ListItemProps } from './list-item';

export function ListItem({
  colors,
  disabled = false,
  onPress,
  modifiers,
  ...props
}: Readonly<ListItemProps>) {
  return (
    <NativeListItem
      {...props}
      colors={{ ...colors, containerColor: colors?.containerColor ?? 'transparent' }}
      onPress={disabled ? undefined : onPress}
      modifiers={[...(modifiers ?? []), ...nativeFillWidth]}
    />
  );
}

// FieldGroup.Section checks the component type before applying its row styling.
ListItem.FieldRow = NativeListItem;
ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from './list-item';
