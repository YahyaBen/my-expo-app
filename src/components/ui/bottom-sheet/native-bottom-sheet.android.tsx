import { BottomSheet, Column, ScrollView } from '@expo/ui';
import { ModalBottomSheet, type ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { fillMaxHeight, padding, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useRef, useState } from 'react';
import { nativeFillWidth } from '../native/native-fill-width';
import type { NativeBottomSheetProps } from './native-bottom-sheet';

export function NativeBottomSheet({
  dismissible,
  heightFraction,
  edgeToEdge,
  fitScrollContent,
  ...props
}: Readonly<NativeBottomSheetProps>) {
  if (dismissible && heightFraction === undefined && !fitScrollContent)
    return <BottomSheet {...props} contentPadding={edgeToEdge ? 0 : undefined} />;
  return (
    <ControlledBottomSheet
      {...props}
      dismissible={dismissible}
      heightFraction={heightFraction}
      edgeToEdge={edgeToEdge}
      fitScrollContent={fitScrollContent}
    />
  );
}

function ControlledBottomSheet({
  children,
  isPresented,
  onDismiss,
  testID,
  containerColor,
  contentColor,
  dismissible,
  heightFraction,
  edgeToEdge,
  fitScrollContent,
}: Readonly<NativeBottomSheetProps>) {
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const [mounted, setMounted] = useState(isPresented);
  if (isPresented && !mounted) setMounted(true);

  useEffect(() => {
    if (isPresented) return;
    let cancelled = false;
    sheetRef.current?.hide().then(() => {
      if (!cancelled) setMounted(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isPresented]);

  if ((!dismissible && !isPresented) || !mounted) return null;

  return (
    <ModalBottomSheet
      ref={sheetRef}
      onDismissRequest={onDismiss}
      containerColor={containerColor}
      contentColor={contentColor}
      sheetGesturesEnabled={dismissible}
      showDragHandle={dismissible}
      skipPartiallyExpanded={
        !dismissible || heightFraction !== undefined || fitScrollContent !== undefined
      }
      properties={{
        shouldDismissOnBackPress: dismissible,
        shouldDismissOnClickOutside: dismissible,
      }}
    >
      <Column
        modifiers={[
          ...nativeFillWidth,
          // Size content, not the modal: its anchors need the full window height.
          ...(heightFraction === undefined ? [] : [fillMaxHeight(heightFraction)]),
          ...(edgeToEdge ? [] : [padding(16, dismissible ? 0 : 16, 16, 0)]),
          ...(testID ? [nativeTestID(testID)] : []),
        ]}
      >
        {fitScrollContent ? (
          <ScrollView modifiers={nativeFillWidth} testID={fitScrollContent.testID}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </Column>
    </ModalBottomSheet>
  );
}
