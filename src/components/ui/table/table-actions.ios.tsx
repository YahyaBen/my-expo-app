import { Button, Menu } from '@expo/ui/swift-ui';
import {
  accessibilityLabel as nativeAccessibilityLabel,
  buttonStyle,
  controlSize,
  disabled,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { TableActionsProps } from './table-actions';

export function TableActions({
  label,
  accessibilityLabel,
  actions,
  testID,
}: Readonly<TableActionsProps>) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Menu
      label={label}
      testID={testID}
      modifiers={[
        buttonStyle('bordered'),
        controlSize('regular'),
        tint(colors.tint),
        nativeAccessibilityLabel(accessibilityLabel),
        disabled(actions.length === 0),
      ]}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          label={action.label}
          role={action.destructive ? 'destructive' : undefined}
          modifiers={[buttonStyle('automatic'), disabled(action.disabled ?? false)]}
          testID={testID ? `${testID}-action-${action.id}` : undefined}
          onPress={() => {
            if (!action.disabled) action.onPress();
          }}
        />
      ))}
    </Menu>
  );
}

export type { TableAction, TableActionsProps } from './table-actions';
