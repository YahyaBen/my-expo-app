import { Column } from '@expo/ui';
import { DatePickerDialog, TimePickerDialog } from '@expo/ui/jetpack-compose';
import { useState } from 'react';
import { spacing } from '@/constants/layout';
import { ButtonContent } from '../button/button';
import type { NativeDateTimePickerProps } from './date-time-picker';

/** Material calendars exchange UTC calendar days, while the public value is local. */
function calendarDay(value: Date) {
  const result = new Date(0);
  result.setUTCFullYear(value.getFullYear(), value.getMonth(), value.getDate());
  result.setUTCHours(0, 0, 0, 0);
  return result.toISOString();
}

export function NativeDateTimePicker({
  value,
  onValueChange,
  label,
  mode = 'date',
  disabled = false,
  minimumDate,
  maximumDate,
  locale,
  is24Hour = true,
  testID,
}: Readonly<NativeDateTimePickerProps>) {
  const [active, setActive] = useState<'date' | 'time' | null>(null);
  if (active && (disabled || (mode !== 'datetime' && mode !== active))) setActive(null);
  const dateLabel = value.toLocaleDateString(locale, { dateStyle: 'medium' });
  const timeLabel = value.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour,
  });
  const close = () => setActive(null);

  return (
    <Column spacing={spacing.sm}>
      {mode !== 'time' ? (
        <ButtonContent
          variant="secondary"
          label={dateLabel}
          accessibilityLabel={`${label}, ${dateLabel}`}
          disabled={disabled}
          onPress={() => setActive('date')}
          testID={mode === 'date' ? testID : testID ? `${testID}-date` : undefined}
        />
      ) : null}
      {mode !== 'date' ? (
        <ButtonContent
          variant="secondary"
          label={timeLabel}
          accessibilityLabel={`${label}, ${timeLabel}`}
          disabled={disabled}
          onPress={() => setActive('time')}
          testID={mode === 'time' ? testID : testID ? `${testID}-time` : undefined}
        />
      ) : null}
      {!disabled && active === 'date' && mode !== 'time' ? (
        <DatePickerDialog
          initialDate={calendarDay(value)}
          selectableDates={
            minimumDate || maximumDate ? { start: minimumDate, end: maximumDate } : undefined
          }
          onDismissRequest={close}
          onDateSelected={(day) => {
            close();
            if (!day || !Number.isFinite(day.getTime())) return;
            const next = new Date(value);
            next.setFullYear(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
            onValueChange(next);
          }}
        />
      ) : null}
      {!disabled && active === 'time' && mode !== 'date' ? (
        <TimePickerDialog
          initialDate={value.toISOString()}
          is24Hour={is24Hour}
          onDismissRequest={close}
          onDateSelected={(time) => {
            close();
            if (!time || !Number.isFinite(time.getTime())) return;
            const next = new Date(value);
            next.setHours(time.getHours(), time.getMinutes());
            onValueChange(next);
          }}
        />
      ) : null}
    </Column>
  );
}
