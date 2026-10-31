import {
  Chip,
  Column,
  Row,
  ScrollView,
  Text,
  UniversalButtonContent,
  UniversalHost,
  nativeFillWidth,
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

const chipOptions = [
  { id: 'nearby', label: 'Available nearby' },
  { id: 'open-now', label: 'Open now' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'top-rated', label: 'Top rated' },
];

function ChipDemo({ colorScheme, seedColor, layoutDirection, ...args }: Readonly<Props>) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  const [actions, setActions] = useState(0);
  const selectedCount = chipOptions.filter((chip) => selected[chip.id] ?? args.selected).length;
  return (
    <UniversalHost
      colorScheme={colorScheme}
      seedColor={seedColor}
      layoutDirection={layoutDirection}
    >
      <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
        <ScrollView direction="horizontal" modifiers={nativeFillWidth} testID="chip-demo-scroll">
          <Row spacing={8} alignment="center">
            {chipOptions.map((chip) => {
              if (removed.includes(chip.id)) return null;
              const props = {
                label: chip.id === 'nearby' ? args.label : chip.label,
                disabled: args.disabled,
                testID: chip.id === 'nearby' ? 'chip-demo-control' : `chip-demo-control-${chip.id}`,
                onPress: () => {
                  action('chip pressed')({ variant: args.variant, id: chip.id });
                  if (args.variant === 'input') setRemoved((previous) => [...previous, chip.id]);
                  else if (args.variant === 'filter')
                    setSelected((previous) => ({
                      ...previous,
                      [chip.id]: !(previous[chip.id] ?? args.selected),
                    }));
                  else setActions((previous) => previous + 1);
                },
              };
              return args.variant === 'filter' || args.variant === 'input' ? (
                <Chip
                  key={chip.id}
                  {...props}
                  variant={args.variant}
                  selected={selected[chip.id] ?? args.selected}
                />
              ) : (
                <Chip key={chip.id} {...props} variant={args.variant} />
              );
            })}
            {removed.length === chipOptions.length ? <Text>All chips removed.</Text> : null}
          </Row>
        </ScrollView>
        <Text testID="chip-demo-state">
          {args.variant === 'input'
            ? `${chipOptions.length - removed.length} chips remaining.`
            : args.variant === 'filter'
              ? `${selectedCount} chips selected.`
              : `Actions: ${actions}.`}
        </Text>
        <Text>
          {args.variant === 'input'
            ? 'Press an input chip to remove its token.'
            : 'Scroll sideways to explore the chips. Each filter has its own selection.'}
        </Text>
        <UniversalButtonContent
          label="Reset chips"
          variant="secondary"
          testID="chip-demo-reset"
          onPress={() => {
            setSelected({});
            setRemoved([]);
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
