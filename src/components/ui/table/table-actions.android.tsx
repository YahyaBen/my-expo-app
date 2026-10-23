import { DropdownMenu, DropdownMenuItem, OutlinedButton, Text } from '@expo/ui/jetpack-compose';
import { semantics, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { TableActionsProps } from './table-actions';

export function TableActions({ label, accessibilityLabel, actions, testID }: TableActionsProps) {
  const colors = useThemeColors(useHostColorScheme());
  const [expanded, setExpanded] = useState(false);
  const enabled = actions.length > 0;
  if (!enabled && expanded) setExpanded(false);

  return (
    <DropdownMenu expanded={enabled && expanded} onDismissRequest={() => setExpanded(false)}>
      <DropdownMenu.Trigger>
        <OutlinedButton
          enabled={enabled}
          colors={{ contentColor: colors.tint }}
          modifiers={[
            semantics({ contentDescription: accessibilityLabel }),
            ...(testID ? [nativeTestID(testID)] : []),
          ]}
          onClick={() => {
            if (enabled) setExpanded(true);
          }}
        >
          <Text>{label}</Text>
        </OutlinedButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Items>
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            enabled={!action.disabled}
            elementColors={action.destructive ? { textColor: colors.error } : undefined}
            modifiers={testID ? [nativeTestID(`${testID}-action-${action.id}`)] : undefined}
            onClick={() => {
              if (action.disabled) return;
              setExpanded(false);
              action.onPress();
            }}
          >
            <DropdownMenuItem.Text>
              <Text>{action.label}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </DropdownMenu.Items>
    </DropdownMenu>
  );
}

export type { TableAction, TableActionsProps } from './table-actions';
