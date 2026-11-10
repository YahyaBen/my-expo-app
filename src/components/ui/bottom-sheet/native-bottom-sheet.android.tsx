import { BottomSheet, Column } from '@expo/ui';
import { ModalBottomSheet } from '@expo/ui/jetpack-compose';
import { padding, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { NativeBottomSheetProps } from './native-bottom-sheet';

export function NativeBottomSheet({ dismissible, ...props }: Readonly<NativeBottomSheetProps>) {
  // The universal Android sheet does not expose sheetGesturesEnabled.
  if (dismissible) return <BottomSheet {...props} />;
  if (!props.isPresented) return null;

  const { children, onDismiss, testID, containerColor, contentColor } = props;
  return (
    <ModalBottomSheet
      onDismissRequest={onDismiss}
      containerColor={containerColor}
      contentColor={contentColor}
      sheetGesturesEnabled={false}
      showDragHandle={false}
      properties={{ shouldDismissOnBackPress: false, shouldDismissOnClickOutside: false }}
    >
      <Column modifiers={[padding(16, 16, 16, 0), ...(testID ? [nativeTestID(testID)] : [])]}>
        {children}
      </Column>
    </ModalBottomSheet>
  );
}
