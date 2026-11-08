import {
  AssistChip,
  FilterChip,
  InputChip,
  SuggestionChip,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { semantics, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { ChipProps } from './chip.types';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

export type { ChipProps } from './chip.types';

export function Chip({
  variant = 'assist',
  label,
  selected,
  disabled = false,
  onPress,
  testID,
  accessibilityLabel,
  appearance = 'native',
}: Readonly<ChipProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const nativeColors = useMaterialColors();
  const surface =
    appearance === 'filled'
      ? {
          containerColor: colors.surfaceRaised ?? nativeColors.surfaceContainerHigh,
          labelColor: colors.text ?? nativeColors.onSurface,
        }
      : undefined;
  const selection = surface
    ? { ...surface, selectedContainerColor: colors.primary, selectedLabelColor: colors.onPrimary }
    : undefined;
  const props = {
    colors: surface,
    border: surface ? { width: 0, color: surface.containerColor } : undefined,
    enabled: !disabled,
    onClick: () => {
      if (!disabled) onPress();
    },
    modifiers: [
      ...(testID ? [nativeTestID(testID)] : []),
      ...(accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []),
    ],
  };
  if (variant === 'filter') {
    return (
      <FilterChip {...props} colors={selection} selected={Boolean(selected)}>
        <FilterChip.Label>
          <Text>{label}</Text>
        </FilterChip.Label>
      </FilterChip>
    );
  }
  if (variant === 'input') {
    return (
      <InputChip {...props} colors={selection} selected={selected}>
        <InputChip.Label>
          <Text>{label}</Text>
        </InputChip.Label>
      </InputChip>
    );
  }
  if (variant === 'suggestion') {
    return (
      <SuggestionChip {...props}>
        <SuggestionChip.Label>
          <Text>{label}</Text>
        </SuggestionChip.Label>
      </SuggestionChip>
    );
  }
  return (
    <AssistChip {...props}>
      <AssistChip.Label>
        <Text>{label}</Text>
      </AssistChip.Label>
    </AssistChip>
  );
}
