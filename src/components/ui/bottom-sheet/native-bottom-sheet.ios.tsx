import { BottomSheet } from '@expo/ui';
import { interactiveDismissDisabled } from '@expo/ui/swift-ui/modifiers';
import type { NativeBottomSheetProps } from './native-bottom-sheet';

export function NativeBottomSheet({
  dismissible,
  heightFraction,
  ...props
}: Readonly<NativeBottomSheetProps>) {
  return (
    <BottomSheet
      {...props}
      snapPoints={heightFraction === undefined ? undefined : [{ fraction: heightFraction }]}
      showDragIndicator={dismissible}
      modifiers={dismissible ? undefined : [interactiveDismissDisabled()]}
    />
  );
}
