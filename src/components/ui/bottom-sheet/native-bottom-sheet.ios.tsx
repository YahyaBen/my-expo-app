import { spacing } from '@/constants/layout';
import { BottomSheet, Column, ScrollView } from '@expo/ui';
import { interactiveDismissDisabled, onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { nativeFillWidth } from '../native/native-fill-width';
import type { NativeBottomSheetProps } from './native-bottom-sheet';

export function NativeBottomSheet({
  children,
  dismissible,
  heightFraction,
  edgeToEdge,
  fitScrollContent,
  ...props
}: Readonly<NativeBottomSheetProps>) {
  return (
    <BottomSheet
      {...props}
      contentPadding={edgeToEdge ? 0 : undefined}
      snapPoints={heightFraction === undefined ? undefined : [{ fraction: heightFraction }]}
      showDragIndicator={dismissible}
      modifiers={dismissible ? undefined : [interactiveDismissDisabled()]}
    >
      {fitScrollContent ? (
        <FittedScrollView testID={fitScrollContent.testID}>{children}</FittedScrollView>
      ) : (
        children
      )}
    </BottomSheet>
  );
}

function FittedScrollView({
  children,
  testID,
}: Readonly<{ children: ReactNode; testID?: string }>) {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState<number>();
  const heightLimit = Math.max(1, height - top - bottom - spacing.xxl);

  return (
    <ScrollView
      modifiers={nativeFillWidth}
      style={
        contentHeight === undefined ? undefined : { height: Math.min(contentHeight, heightLimit) }
      }
      testID={testID}
    >
      <Column
        spacing={0}
        modifiers={[
          ...nativeFillWidth,
          onGeometryChange(({ height }) => {
            // Scroll position changes also emit geometry events. Only resize on a height change.
            const nextHeight = Math.ceil(height);
            if (nextHeight > 0 && nextHeight !== contentHeight) {
              setContentHeight(nextHeight);
            }
          }),
        ]}
      >
        {children}
      </Column>
    </ScrollView>
  );
}
