import type { Meta, StoryObj } from '@storybook/react-native';
import { IosHomeGrid } from '@components/ui';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

function IosHomeGridDemo(args: AnimatedComponentPreviewProps) {
  return (
    <AnimatedComponentPreview {...args}>
      <IosHomeGrid />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/iOS Home Grid',
  component: IosHomeGridDemo,
  args: { colorScheme: 'light', rtl: false },
  argTypes: { rtl: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Tap photo centers and edges, drag the expanded photo down, or use Close. Check reopening from every row, canceled drags, RTL, large text and Reduce motion on iOS and Android.',
      },
    },
  },
} satisfies Meta<typeof IosHomeGridDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
