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
  return (
    <Button
      testID={testID}
      onPress={() => {
        if (!disabled) onPress();
      }}
      modifiers={[
        buttonStyle(selected || filled ? 'borderedProminent' : 'bordered'),
        ...(filled ? [tint(selected ? colors.primary : colors.surfaceRaised)] : []),
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
          ...(filled ? [foregroundStyle(selected ? colors.onPrimary : colors.text)] : []),
        ]}
      >
        {label}
      </Text>
    </Button>
  );
}
