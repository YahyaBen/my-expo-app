import { Column, ScrollView } from '@expo/ui';
import { Popover as SwiftPopover } from '@expo/ui/swift-ui';
import { frame, onGeometryChange, strokeBorder } from '@expo/ui/swift-ui/modifiers';
import { useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { radii } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { PopoverProps } from './popover.types';

export type { PopoverProps } from './popover.types';

function PopoverScroll({ children }: Readonly<{ children: ReactNode }>) {
  const { height } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState<number>();
  const heightLimit = Math.floor(height * 0.65);

  return (
    <ScrollView
      modifiers={[frame({ maxHeight: Math.min(contentHeight ?? heightLimit, heightLimit) })]}
    >
      <Column spacing={0} modifiers={[onGeometryChange(({ height }) => setContentHeight(height))]}>
        {children}
      </Column>
    </ScrollView>
  );
}

export function Popover({
  trigger,
  children,
  width,
  scrollable,
  testID,
  ...props
}: Readonly<PopoverProps>) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <SwiftPopover {...props} testID={testID}>
      <SwiftPopover.Trigger>{trigger}</SwiftPopover.Trigger>
      <SwiftPopover.Content>
        {children != null && (
          <Column
            spacing={0}
            style={{ width, backgroundColor: colors.surfaceRaised, borderRadius: radii.sm }}
            modifiers={
              colors.border
                ? [
                    strokeBorder({
                      content: colors.border,
                      shape: 'roundedRectangle',
                      cornerRadius: radii.sm,
                      style: { lineWidth: 1 },
                    }),
                  ]
                : undefined
            }
            testID={testID ? `${testID}-content` : undefined}
          >
            {scrollable ? <PopoverScroll>{children}</PopoverScroll> : children}
          </Column>
        )}
      </SwiftPopover.Content>
    </SwiftPopover>
  );
}
