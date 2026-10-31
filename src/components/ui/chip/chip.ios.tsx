import { Button, Text } from '@expo/ui/swift-ui';
import {
  accessibilityAddTraits,
  accessibilityLabel as nativeLabel,
  buttonBorderShape,
  buttonStyle,
  controlSize,
  disabled as nativeDisabled,
  frame,
} from '@expo/ui/swift-ui/modifiers';
import type { ChipProps } from './chip.types';

export type { ChipProps } from './chip.types';

export function Chip({
  label,
  selected,
  disabled = false,
  onPress,
  testID,
  accessibilityLabel,
}: Readonly<ChipProps>) {
  return (
    <Button
      testID={testID}
      onPress={() => {
        if (!disabled) onPress();
      }}
      modifiers={[
        buttonStyle(selected ? 'borderedProminent' : 'bordered'),
        buttonBorderShape('capsule'),
        controlSize('regular'),
        nativeDisabled(disabled),
        ...(selected ? [accessibilityAddTraits(['isSelected'])] : []),
        ...(accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []),
      ]}
    >
      <Text modifiers={[frame({ minHeight: 32 })]}>{label}</Text>
    </Button>
  );
}
