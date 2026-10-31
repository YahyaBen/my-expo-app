import { AssistChip, FilterChip, InputChip, SuggestionChip, Text } from '@expo/ui/jetpack-compose';
import { semantics, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { ChipProps } from './chip.types';

export type { ChipProps } from './chip.types';

export function Chip({
  variant = 'assist',
  label,
  selected,
  disabled = false,
  onPress,
  testID,
  accessibilityLabel,
}: Readonly<ChipProps>) {
  const props = {
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
      <FilterChip {...props} selected={Boolean(selected)}>
        <FilterChip.Label>
          <Text>{label}</Text>
        </FilterChip.Label>
      </FilterChip>
    );
  }
  if (variant === 'input') {
    return (
      <InputChip {...props} selected={selected}>
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
