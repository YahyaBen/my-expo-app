import { Column } from '@expo/ui';
import { DropdownMenu, Shape, Surface, useMaterialColors } from '@expo/ui/jetpack-compose';
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
  testID,
  isPresented,
  onIsPresentedChange,
}: Readonly<PopoverProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const { outlineVariant } = useMaterialColors();
  return (
    <DropdownMenu
      expanded={isPresented}
      onDismissRequest={() => onIsPresentedChange(false)}
      properties={{ focusable: true, dismissOnBackPress: true, dismissOnClickOutside: true }}
      modifiers={testID ? [nativeTestID(testID)] : undefined}
      color="transparent"
      shadowElevation={0}
    >
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Items>
        <Surface
          color={colors.surfaceRaised}
          shape={panelShape}
          border={{ color: colors.border ?? outlineVariant, width: 1 }}
        >
          <Column style={{ width }} testID={testID ? `${testID}-content` : undefined}>
            {children}
          </Column>
        </Surface>
      </DropdownMenu.Items>
    </DropdownMenu>
  );
}
