import {
  Column,
  Shape,
  Text,
  UniversalHost,
  type ShapeProps,
  type UniversalThemeProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

type Props = ShapeProps & UniversalThemeProps;

function ShapeDemo({ colorScheme, seedColor, ...props }: Readonly<Props>) {
  return (
    <UniversalHost colorScheme={colorScheme} seedColor={seedColor}>
      <Column spacing={20} alignment="center" style={{ padding: 24 }}>
        <Shape {...props} />
        <Text>Native filled geometry on iOS and Android.</Text>
      </Column>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Shape',
  component: ShapeDemo,
  args: {
    variant: 'roundedRectangle',
    width: 120,
    height: 80,
    cornerRadius: 16,
    colorScheme: 'dark',
    testID: 'shape-demo-control',
  },
  argTypes: {
    variant: { control: 'select', options: ['circle', 'rectangle', 'roundedRectangle', 'capsule'] },
    width: { control: { type: 'number', min: 1, max: 280 } },
    height: { control: { type: 'number', min: 1, max: 280 } },
    cornerRadius: { control: { type: 'number', min: 0, max: 100 } },
    color: { control: 'color' },
    seedColor: { control: 'color' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof ShapeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
