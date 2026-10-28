import { Icon } from '../icon/icon';
import { Button, Text, VStack } from '@expo/ui/swift-ui';
import {
  accessibilityAddTraits,
  accessibilityLabel,
  background,
  buttonStyle,
  contentShape,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  shapes,
  truncationMode,
} from '@expo/ui/swift-ui/modifiers';
import type { NavigationTabProps } from './navigation-tab';

export function NavigationTab({
  icon,
  label,
  selected,
  color,
  selectedBackgroundColor,
  testID,
  onPress,
}: Readonly<NavigationTabProps>) {
  return (
    <Button
      testID={testID}
      onPress={onPress}
      modifiers={[
        buttonStyle('plain'),
        accessibilityLabel(label),
        accessibilityAddTraits(selected ? ['isSelected'] : []),
      ]}
    >
      <VStack
        spacing={3}
        modifiers={[
          frame({ height: 56 }),
          frame({ maxWidth: Infinity }),
          contentShape(shapes.rectangle()),
        ]}
      >
        <Icon
          name={icon}
          size={22}
          color={color}
          modifiers={[
            frame({ width: 44, height: 28 }),
            background(selected ? selectedBackgroundColor : 'transparent', shapes.capsule()),
          ]}
        />
        <Text
          modifiers={[
            font({ size: 11, weight: 'semibold' }),
            foregroundStyle(color),
            lineLimit(1),
            truncationMode('tail'),
          ]}
        >
          {label}
        </Text>
      </VStack>
    </Button>
  );
}
