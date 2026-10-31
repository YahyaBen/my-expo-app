import {
  Column,
  ProgressIndicator,
  Text,
  UniversalButtonContent,
  UniversalHost,
  nativeFillWidth,
  type UniversalThemeProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

type Props = UniversalThemeProps & {
  variant: 'linear' | 'circular';
  value: number;
  indeterminate: boolean;
  color?: string;
};

function ProgressDemo({
  colorScheme,
  seedColor,
  value,
  indeterminate,
  variant,
  color,
}: Readonly<Props>) {
  const [progress, setProgress] = useState(value);
  const props = {
    testID: 'progress-demo-indicator',
    accessibilityLabel: 'Download progress',
    color,
  };
  return (
    <UniversalHost colorScheme={colorScheme} seedColor={seedColor}>
      <Column spacing={20} modifiers={nativeFillWidth} style={{ padding: 24 }}>
        {variant === 'circular' ? (
          <ProgressIndicator {...props} variant="circular" />
        ) : (
          <ProgressIndicator {...props} value={indeterminate ? undefined : progress} />
        )}
        <Text testID="progress-demo-value">
          {variant === 'circular' || indeterminate ? 'Working…' : `${Math.round(progress * 100)}%`}
        </Text>
        <UniversalButtonContent
          variant="primary"
          label="Advance progress"
          testID="progress-demo-advance"
          disabled={variant === 'circular' || indeterminate || progress >= 1}
          onPress={() => setProgress((previous) => Math.min(1, previous + 0.1))}
        />
        <UniversalButtonContent
          variant="secondary"
          label="Reset progress"
          testID="progress-demo-reset"
          onPress={() => setProgress(value)}
        />
      </Column>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Progress Indicator',
  component: ProgressDemo,
  args: { variant: 'linear', value: 0.4, indeterminate: false, colorScheme: 'dark' },
  argTypes: {
    variant: { control: 'select', options: ['linear', 'circular'] },
    value: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    color: { control: 'color' },
    seedColor: { control: 'color' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
  render: (args) => <ProgressDemo key={args.value} {...args} />,
} satisfies Meta<typeof ProgressDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
