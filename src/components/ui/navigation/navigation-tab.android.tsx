import { Icon } from '@expo/ui';
import { Column, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxWidth,
  height,
  selectable,
  semantics,
  Shapes,
  size,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import type { NavigationTabProps } from './navigation-tab';

export function NavigationTab({
  icon,
  label,
  selected,
  color,
  selectedBackgroundColor,
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
          modifiers={[
            size(44, 28),
            clip(Shapes.RoundedCorner(14)),
            background(selected ? selectedBackgroundColor : 'transparent'),
          ]}
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
