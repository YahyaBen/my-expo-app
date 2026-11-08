import { Button, Text } from '@expo/ui/swift-ui';
import {
  accessibilityAddTraits,
  accessibilityLabel as nativeLabel,
  buttonBorderShape,
  buttonStyle,
  controlSize,
  disabled as nativeDisabled,
  frame,
  foregroundStyle,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import type { ChipProps } from './chip.types';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

export type { ChipProps } from './chip.types';

export function Chip({
  label,
  selected,
  disabled = false,
  onPress,
  testID,
  accessibilityLabel,
  appearance = 'native',
}: Readonly<ChipProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const filled = appearance === 'filled';
  const color = selected ? colors.primary : colors.surfaceRaised;
  const contentColor = selected ? colors.onPrimary : colors.text;
  return (
    <Button
      testID={testID}
      onPress={() => {
        if (!disabled) onPress();
      }}
      modifiers={[
        buttonStyle(selected || filled ? 'borderedProminent' : 'bordered'),
        ...(filled && color !== undefined ? [tint(color)] : []),
        buttonBorderShape('capsule'),
        controlSize('regular'),
        nativeDisabled(disabled),
        ...(selected ? [accessibilityAddTraits(['isSelected'])] : []),
        ...(accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []),
      ]}
    >
      <Text
        modifiers={[
          frame({ minHeight: 32 }),
          ...(filled && contentColor !== undefined ? [foregroundStyle(contentColor)] : []),
        ]}
      >
        {label}
      </Text>
    </Button>
  );
}
