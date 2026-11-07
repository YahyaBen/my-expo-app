import { Icon } from '../icon/icon';
import { Column, Text } from '@expo/ui/jetpack-compose';
import {
  animated,
  background,
  clip,
  fillMaxWidth,
  height,
  graphicsLayer,
  selectable,
  semantics,
  Shapes,
  size,
  testID as nativeTestID,
  tween,
} from '@expo/ui/jetpack-compose/modifiers';
import type { NavigationTabProps } from './navigation-tab';

export function NavigationTab({
  icon,
  label,
  selected,
  motionEnabled,
  color,
  selectedBackgroundColor,
  testID,
  onPress,
}: Readonly<NavigationTabProps>) {
  const scale = motionEnabled
    ? animated(selected ? 1.1 : 1, tween({ durationMillis: 160, easing: 'linearOutSlowIn' }))
    : 1;
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
          <Icon
            name={icon}
            size={22}
            color={color}
            modifiers={[graphicsLayer({ scaleX: scale, scaleY: scale })]}
          />
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
