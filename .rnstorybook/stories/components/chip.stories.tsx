import {
  Chip,
  Column,
  Text,
  UniversalButtonContent,
  UniversalHost,
  type UniversalThemeProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';

type Props = UniversalThemeProps & {
  variant: 'assist' | 'filter' | 'input' | 'suggestion';
  label: string;
  selected: boolean;
  disabled: boolean;
  layoutDirection: 'leftToRight' | 'rightToLeft';
};

function ChipDemo({ colorScheme, seedColor, layoutDirection, ...args }: Readonly<Props>) {
  const [selected, setSelected] = useState(args.selected);
  const [removed, setRemoved] = useState(false);
  const [actions, setActions] = useState(0);
  const props = {
    label: args.label,
    disabled: args.disabled,
    testID: 'chip-demo-control',
    onPress: () => {
      action('chip pressed')(args.variant);
      if (args.variant === 'input') setRemoved(true);
      else if (args.variant === 'filter') setSelected((previous) => !previous);
      else setActions((previous) => previous + 1);
    },
  };
  return (
    <UniversalHost
      colorScheme={colorScheme}
      seedColor={seedColor}
      layoutDirection={layoutDirection}
    >
      <Column spacing={16} style={{ padding: 24 }}>
        {!removed &&
          (args.variant === 'filter' || args.variant === 'input' ? (
            <Chip {...props} variant={args.variant} selected={selected} />
          ) : (
            <Chip {...props} variant={args.variant} />
          ))}
        <Text testID="chip-demo-state">
          {removed ? 'Token removed' : `Selected: ${selected}. Actions: ${actions}.`}
        </Text>
        <Text>Input chips in this example remove their token when pressed.</Text>
        <UniversalButtonContent
          label="Reset chip"
          variant="secondary"
          testID="chip-demo-reset"
          onPress={() => {
            setSelected(args.selected);
            setRemoved(false);
            setActions(0);
          }}
        />
      </Column>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Chip',
  component: ChipDemo,
  args: {
    variant: 'filter',
    label: 'Available nearby',
    selected: false,
    disabled: false,
    colorScheme: 'dark',
    layoutDirection: 'leftToRight',
  },
  argTypes: {
    variant: { control: 'select', options: ['assist', 'filter', 'input', 'suggestion'] },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    layoutDirection: { control: 'select', options: ['leftToRight', 'rightToLeft'] },
    seedColor: { control: 'color' },
  },
  render: (args) => <ChipDemo key={`${args.variant}-${args.selected}`} {...args} />,
} satisfies Meta<typeof ChipDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
