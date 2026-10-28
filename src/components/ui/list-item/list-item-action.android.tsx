import { Column } from '@expo/ui';
import { Surface } from '@expo/ui/jetpack-compose';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { nativeFillWidth } from '../native/native-fill-width';
import type { ListItemActionProps } from './list-item-action';

export function ListItemAction({
  children,
  onPress,
  disabled = false,
  testID,
}: Readonly<ListItemActionProps>) {
  return (
    <Surface
      color="transparent"
      enabled={!disabled}
      onClick={
        onPress
          ? () => {
              if (!disabled) onPress();
            }
          : undefined
      }
      modifiers={[...nativeFillWidth, ...(testID ? [nativeTestID(testID)] : [])]}
    >
      <Column modifiers={nativeFillWidth}>{children}</Column>
    </Surface>
  );
}

export type { ListItemActionProps } from './list-item-action';
