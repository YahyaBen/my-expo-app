import { Column, ListItem as NativeListItem } from '@expo/ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';
import { nativeFillWidth } from '../native/native-fill-width';
import type { ListItemProps } from './list-item';

export function ListItem({
  disabled = false,
  onPress,
  modifiers,
  ...props
}: Readonly<ListItemProps>) {
  const defaultStyle =
    onPress && !modifiers?.some((modifier) => modifier.$type === 'buttonStyle')
      ? [buttonStyle('automatic')]
      : [];
  return (
    <Column disabled={disabled} modifiers={nativeFillWidth}>
      <NativeListItem
        {...props}
        onPress={disabled ? undefined : onPress}
        modifiers={[...defaultStyle, ...(modifiers ?? [])]}
      />
    </Column>
  );
}

ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from './list-item';
