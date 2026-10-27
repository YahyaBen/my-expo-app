import type { Meta, StoryObj } from '@storybook/react-native';
import { CircularCarousel } from '@components/ui';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

function CircularCarouselDemo(args: AnimatedComponentPreviewProps) {
  return (
    <AnimatedComponentPreview {...args}>
      <CircularCarousel />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Circular Carousel',
  component: CircularCarouselDemo,
  args: { colorScheme: 'light', rtl: false },
  argTypes: { rtl: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Swipe the circular Picsum images and toggle Scale photos. Reduce motion disables scaling and flattens the arc. Check RTL and screen-reader selection on both native platforms.',
      },
    },
  },
} satisfies Meta<typeof CircularCarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
