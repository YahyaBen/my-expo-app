import { BottomSheet } from '@expo/ui';
import { interactiveDismissDisabled } from '@expo/ui/swift-ui/modifiers';
import type { NativeBottomSheetProps } from './native-bottom-sheet';

export function NativeBottomSheet({
  dismissible,
  heightFraction,
  edgeToEdge,
  ...props
}: Readonly<NativeBottomSheetProps>) {
  return (
    <BottomSheet
      {...props}
      contentPadding={edgeToEdge ? 0 : undefined}
      snapPoints={heightFraction === undefined ? undefined : [{ fraction: heightFraction }]}
      showDragIndicator={dismissible}
      modifiers={dismissible ? undefined : [interactiveDismissDisabled()]}
    />
  );
}
