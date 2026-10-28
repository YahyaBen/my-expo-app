import { Button, VStack } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  contentShape,
  disabled as nativeDisabled,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import { nativeFillWidth } from '../native/native-fill-width';
import type { ListItemActionProps } from './list-item-action';

export function ListItemAction({
  children,
  onPress,
  disabled = false,
  testID,
}: Readonly<ListItemActionProps>) {
  return (
    <Button
      onPress={disabled ? undefined : onPress}
      testID={testID}
      modifiers={[buttonStyle('automatic'), nativeDisabled(disabled)]}
    >
      <VStack spacing={0} modifiers={[...nativeFillWidth, contentShape(shapes.rectangle())]}>
        {children}
      </VStack>
    </Button>
  );
}

export type { ListItemActionProps } from './list-item-action';
