import { SegmentedButton, SingleChoiceSegmentedButtonRow, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID } from '@expo/ui/jetpack-compose/modifiers';
import { triggerHaptic } from '@/lib/haptics';
import type { SegmentedControlProps } from './segmented-control';

export function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
}: Readonly<SegmentedControlProps>) {
  return (
    <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
      {options.map((option) => (
        <SegmentedButton
          key={option.value}
          selected={selectedValue === option.value}
          onClick={() => {
            if (option.value !== selectedValue) triggerHaptic('selection');
            onValueChange(option.value);
          }}
          modifiers={[testID(option.testID)]}
        >
          <SegmentedButton.Label>
            <Text>{option.label}</Text>
          </SegmentedButton.Label>
        </SegmentedButton>
      ))}
    </SingleChoiceSegmentedButtonRow>
  );
}
