import type { Meta, StoryObj } from '@storybook/react-native';
import { StoryList } from '@components/ui';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

function StoryListDemo(args: AnimatedComponentPreviewProps) {
  return (
    <AnimatedComponentPreview {...args}>
      <StoryList />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Story List',
  component: StoryListDemo,
  args: { colorScheme: 'light', rtl: false },
  argTypes: { rtl: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Swipe the Picsum cards, resize, switch RTL, and toggle Reduce motion. Check selected-photo retention and screen-reader increment/decrement actions on iOS and Android.',
      },
    },
  },
} satisfies Meta<typeof StoryListDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
