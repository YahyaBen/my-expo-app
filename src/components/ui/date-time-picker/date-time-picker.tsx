import { Column } from '@expo/ui';
import { spacing } from '@/constants/layout';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';
import { NativeDateTimePicker } from './native-date-time-picker';

export type DateTimePickerMode = 'date' | 'time' | 'datetime';

export type DateTimePickerProps = {
  /** Controlled local date/time. Pass valid Date objects; the caller owns the value. */
  value: Date;
  onValueChange: (value: Date) => void;
  label: string;
  mode?: DateTimePickerMode;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  /** Inclusive calendar dates in date mode; exact instants in datetime mode. Ignored in time mode. */
  minimumDate?: Date;
  maximumDate?: Date;
  /** iOS picker locale and Android trigger formatting. Android dialogs use the system app locale. */
  locale?: string;
  /** Android clock format, 24-hour by default. iOS follows its locale. */
  is24Hour?: boolean;
  testID?: string;
};

function calendarBoundary(value: Date | undefined, end: boolean) {
  if (!value) return undefined;
  const result = new Date(value);
  result.setHours(end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0);
  return result;
}

/** Themed native field content. Compose inside an existing UniversalHost. */
export function DateTimePicker({
  value,
  onValueChange,
  label,
  mode = 'date',
  helperText,
  errorText,
  disabled = false,
  minimumDate,
  maximumDate,
  ...props
}: Readonly<DateTimePickerProps>) {
  const start =
    mode === 'time'
      ? undefined
      : mode === 'date'
        ? calendarBoundary(minimumDate, false)
        : minimumDate;
  const end =
    mode === 'time'
      ? undefined
      : mode === 'date'
        ? calendarBoundary(maximumDate, true)
        : maximumDate;
  if ([value, start, end].some((date) => date && !Number.isFinite(date.getTime()))) {
    throw new RangeError('DateTimePicker requires valid Date values.');
  }
  if (start && end && start > end) {
    throw new RangeError('DateTimePicker minimumDate must not exceed maximumDate.');
  }

  return (
    <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
      <Text tone={disabled ? 'disabled' : errorText ? 'error' : 'default'}>{label}</Text>
      <NativeDateTimePicker
        {...props}
        value={value}
        label={label}
        mode={mode}
        disabled={disabled}
        minimumDate={start}
        maximumDate={end}
        onValueChange={(selection) => {
          if (disabled || !Number.isFinite(selection.getTime())) return;
          // Native controls may include hidden components; retain those from the caller's value.
          let next = new Date(value);
          if (mode === 'date') {
            next.setFullYear(selection.getFullYear(), selection.getMonth(), selection.getDate());
          } else if (mode === 'time') {
            next.setHours(selection.getHours(), selection.getMinutes());
          } else {
            next = new Date(selection);
          }
          if (start && next < start) next = new Date(start);
          if (end && next > end) next = new Date(end);
          if (next.getTime() !== value.getTime()) onValueChange(next);
        }}
      />
      {errorText || helperText ? (
        <Text
          variant="caption"
          tone={errorText ? 'error' : 'muted'}
          testID={props.testID ? `${props.testID}-message` : undefined}
        >
          {errorText || helperText}
        </Text>
      ) : null}
    </Column>
  );
}

export type NativeDateTimePickerProps = Omit<DateTimePickerProps, 'helperText' | 'errorText'>;
