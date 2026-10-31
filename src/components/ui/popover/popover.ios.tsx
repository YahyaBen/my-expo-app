import { Popover as SwiftPopover } from '@expo/ui/swift-ui';
import { Column } from '@expo/ui';
import type { PopoverProps } from './popover.types';

export type { PopoverProps } from './popover.types';

export function Popover({ trigger, children, testID, ...props }: Readonly<PopoverProps>) {
  return (
    <SwiftPopover {...props} testID={testID}>
      <SwiftPopover.Trigger>{trigger}</SwiftPopover.Trigger>
      <SwiftPopover.Content>
        <Column testID={testID ? `${testID}-content` : undefined}>{children}</Column>
      </SwiftPopover.Content>
    </SwiftPopover>
  );
}
