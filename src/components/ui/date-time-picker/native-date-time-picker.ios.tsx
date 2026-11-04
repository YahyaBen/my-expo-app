import { DatePicker } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  datePickerStyle,
  disabled as nativeDisabled,
  environment,
  labelsHidden,
} from '@expo/ui/swift-ui/modifiers';
import type { NativeDateTimePickerProps } from './date-time-picker';

export function NativeDateTimePicker({
  value,
  onValueChange,
  label,
  mode = 'date',
  disabled = false,
  minimumDate,
  maximumDate,
  locale,
  testID,
}: Readonly<NativeDateTimePickerProps>) {
  return (
    <DatePicker
      title={label}
      selection={value}
      displayedComponents={
        mode === 'date' ? ['date'] : mode === 'time' ? ['hourAndMinute'] : ['date', 'hourAndMinute']
      }
      range={minimumDate || maximumDate ? { start: minimumDate, end: maximumDate } : undefined}
      onDateChange={onValueChange}
      testID={testID}
      modifiers={[
        datePickerStyle('compact'),
        labelsHidden(),
        accessibilityLabel(label),
        nativeDisabled(disabled),
        ...(locale ? [environment('locale', locale)] : []),
      ]}
    />
  );
}
