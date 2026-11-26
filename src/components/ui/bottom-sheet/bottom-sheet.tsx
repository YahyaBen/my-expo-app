import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, ScrollView } from '@expo/ui';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillSize, nativeFillWidth } from '../native/native-fill-width';
import type { BottomSheetProps } from './bottom-sheet.types';
import { NativeBottomSheet } from './native-bottom-sheet';

export type { BottomSheetProps } from './bottom-sheet.types';

export function BottomSheet(props: Readonly<BottomSheetProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const {
    children,
    isPresented,
    onDismiss,
    testID,
    contentHeight,
    heightFraction,
    dismissible = true,
    banner,
    header,
    actions,
    footer,
    scrollable = false,
    scrollTestID = testID ? `${testID}-scroll` : undefined,
  } = props;
  const fitScrollContent =
    scrollable && contentHeight === undefined && heightFraction === undefined;
  const hasBanner = banner != null && banner !== false;
  const bannerLayout =
    hasBanner && heightFraction !== undefined && contentHeight === undefined && !scrollable
      ? nativeFillSize
      : nativeFillWidth;
  const body =
    banner !== undefined ||
    header !== undefined ||
    actions !== undefined ||
    footer !== undefined ? (
      <Column
        spacing={spacing.lg}
        modifiers={bannerLayout}
        style={hasBanner ? { padding: spacing.lg } : undefined}
      >
        {header}
        {actions}
        {children}
        {footer}
      </Column>
    ) : (
      children
    );
  const content = hasBanner ? (
    <Column spacing={0} modifiers={bannerLayout}>
      {banner}
      {body}
    </Column>
  ) : (
    body
  );

  return (
    <NativeBottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      dismissible={dismissible}
      heightFraction={heightFraction}
      fitScrollContent={fitScrollContent ? { testID: scrollTestID } : undefined}
      edgeToEdge={hasBanner}
      testID={testID}
      containerColor={colors.surface}
      contentColor={colors.text}
    >
      {scrollable && !fitScrollContent ? (
        <ScrollView
          modifiers={nativeFillWidth}
          style={contentHeight === undefined ? undefined : { height: contentHeight }}
          testID={scrollTestID}
        >
          {content}
        </ScrollView>
      ) : contentHeight === undefined ? (
        content
      ) : (
        <Column modifiers={nativeFillWidth} style={{ height: contentHeight }}>
          {content}
        </Column>
      )}
    </NativeBottomSheet>
  );
}
