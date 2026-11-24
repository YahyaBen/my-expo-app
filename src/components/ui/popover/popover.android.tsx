import { Column, ScrollView } from '@expo/ui';
import {
  Box,
  DropdownMenuPopup,
  Shape,
  Surface,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { radii } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { PopoverProps } from './popover.types';

export type { PopoverProps } from './popover.types';

const panelShape = Shape.RoundedCorner({
  cornerRadii: { topStart: radii.sm, topEnd: radii.sm, bottomStart: radii.sm, bottomEnd: radii.sm },
});

export function Popover({
  trigger,
  children,
  width,
  scrollable,
  testID,
  isPresented,
  onIsPresentedChange,
}: Readonly<PopoverProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const materialColors = useMaterialColors();
  const Content = scrollable ? ScrollView : Column;

  return (
    <Box modifiers={testID ? [nativeTestID(testID)] : undefined}>
      {trigger}
      <DropdownMenuPopup
        expanded={isPresented}
        onDismissRequest={() => onIsPresentedChange(false)}
        properties={{ focusable: true, dismissOnBackPress: true, dismissOnClickOutside: true }}
      >
        {children != null && (
          <Surface
            color={colors.surfaceRaised}
            shape={panelShape}
            border={{ color: colors.border ?? materialColors.outlineVariant, width: 1 }}
            shadowElevation={3}
          >
            <Content style={{ width }} testID={testID ? `${testID}-content` : undefined}>
              {children}
            </Content>
          </Surface>
        )}
      </DropdownMenuPopup>
    </Box>
  );
}
