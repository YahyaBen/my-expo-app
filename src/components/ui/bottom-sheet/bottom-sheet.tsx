import { Column, BottomSheet as NativeBottomSheet } from '@expo/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { InlineBottomSheet } from './inline-bottom-sheet';
import type { BottomSheetProps } from './bottom-sheet.types';

export type { BottomSheetProps } from './bottom-sheet.types';

export function BottomSheet(props: Readonly<BottomSheetProps>) {
  const colors = useThemeColors(useHostColorScheme());
  if (props.presentation === 'inline') return <InlineBottomSheet {...props} />;
  const { children, isPresented, onDismiss, testID, contentHeight } = props;
  return (
    <NativeBottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      testID={testID}
      containerColor={colors.surface}
      contentColor={colors.text}
    >
      {contentHeight === undefined ? (
        children
      ) : (
        <Column modifiers={nativeFillWidth} style={{ height: contentHeight }}>
          {children}
        </Column>
      )}
    </NativeBottomSheet>
  );
}
