import {
  ButtonContent,
  Column,
  DateTimePicker,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillWidth,
  type DateTimePickerProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';
import {
  NativeStoryFrame,
  nativeThemeControls,
  type NativeStoryTheme,
} from '../../components/native-story-frame';

const initialDate = new Date(2030, 4, 15, 14, 30).getTime();

type Props = Omit<DateTimePickerProps, 'value' | 'minimumDate' | 'maximumDate'> &
  NativeStoryTheme & {
    value: number;
    bounded: boolean;
  };

function DateTimePickerDemo({
  value: initialValue,
  bounded,
  colorScheme,
  seedColor,
  ...props
}: Readonly<Props>) {
  const [value, setValue] = useState(() => new Date(initialValue));
  return (
    <UniversalHost colorScheme={colorScheme} seedColor={seedColor}>
      <Column spacing={20} modifiers={nativeFillWidth}>
        <DateTimePicker
          {...props}
          value={value}
          minimumDate={bounded ? new Date(2030, 4, 1, 9) : undefined}
          maximumDate={bounded ? new Date(2030, 4, 31, 18) : undefined}
          onValueChange={(next) => {
            setValue(next);
            props.onValueChange(next);
          }}
        />
        <Text testID={`${props.testID}-value`}>{value.toLocaleString(props.locale)}</Text>
        <Text variant="caption" tone="muted" testID={`${props.testID}-iso`}>
          {value.toISOString()}
        </Text>
        <ButtonContent
          variant="secondary"
          label="Reset value"
          onPress={() => setValue(new Date(initialValue))}
          testID={`${props.testID}-reset`}
        />
      </Column>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Date Time Picker',
  component: DateTimePickerDemo,
  args: {
    value: initialDate,
    mode: 'datetime',
    label: 'Appointment',
    helperText: 'Choose a date and local time.',
    errorText: '',
    locale: 'fr-FR',
    is24Hour: true,
    disabled: false,
    bounded: false,
    testID: 'date-time-picker-demo',
    onValueChange: action('date/time changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    value: { control: 'date' },
    mode: { control: 'select', options: ['date', 'time', 'datetime'] },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    locale: { control: 'select', options: ['fr-FR', 'en-US', 'ar-MA'] },
    is24Hour: { control: 'boolean' },
    disabled: { control: 'boolean' },
    bounded: {
      control: 'boolean',
      description:
        'Limit selection to May 2030 (09:00 on May 1 through 18:00 on May 31 in datetime mode).',
    },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <DateTimePickerDemo key={args.value} {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof DateTimePickerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
