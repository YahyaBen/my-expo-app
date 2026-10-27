import type { Meta, StoryObj } from '@storybook/react-native';
import { StackedCarousel } from '@components/ui';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

function StackedCarouselDemo(args: AnimatedComponentPreviewProps) {
  return (
    <AnimatedComponentPreview {...args}>
      <StackedCarousel />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Stacked Carousel',
  component: StackedCarouselDemo,
  args: { colorScheme: 'light', rtl: false },
  argTypes: { rtl: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Swipe between stacked Picsum cards and compare the page dots and photo count. Check RTL, resizing, Reduce motion and screen-reader selection on iOS and Android.',
      },
    },
  },
} satisfies Meta<typeof StackedCarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
