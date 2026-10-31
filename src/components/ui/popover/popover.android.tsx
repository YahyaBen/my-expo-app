import { Column } from '@expo/ui';
import { DropdownMenu } from '@expo/ui/jetpack-compose';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { PopoverProps } from './popover.types';

export type { PopoverProps } from './popover.types';

export function Popover({
  trigger,
  children,
  testID,
  isPresented,
  onIsPresentedChange,
}: Readonly<PopoverProps>) {
  return (
    <DropdownMenu
      expanded={isPresented}
      onDismissRequest={() => onIsPresentedChange(false)}
      properties={{ focusable: true, dismissOnBackPress: true, dismissOnClickOutside: true }}
      modifiers={testID ? [nativeTestID(testID)] : undefined}
    >
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Items>
        <Column testID={testID ? `${testID}-content` : undefined}>{children}</Column>
      </DropdownMenu.Items>
    </DropdownMenu>
  );
}
