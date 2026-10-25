import { Icon } from '@expo/ui';
import { Column, Text } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height,
  selectable,
  semantics,
  size,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import type { NavigationTabProps } from './navigation-tab';

export function NavigationTab({
  icon,
  label,
  selected,
  color,
  testID,
  onPress,
}: NavigationTabProps) {
  return (
    <Column
      horizontalAlignment="center"
      verticalArrangement="center"
      modifiers={[
        fillMaxWidth(),
        height(56),
        selectable(selected, onPress, 'tab'),
        nativeTestID(testID),
        semantics({ contentDescription: label }),
      ]}
    >
      <Column horizontalAlignment="center" verticalArrangement={{ spacedBy: 3 }}>
        <Column
          horizontalAlignment="center"
          verticalArrangement="center"
          modifiers={[size(44, 28)]}
        >
          <Icon name={icon} size={22} color={color} />
        </Column>
        <Text
          color={color}
          maxLines={1}
          overflow="ellipsis"
          style={{ fontSize: 11, fontWeight: '600' }}
        >
          {label}
        </Text>
      </Column>
    </Column>
  );
}
