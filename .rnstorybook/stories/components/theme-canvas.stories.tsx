import type { Meta, StoryObj } from '@storybook/react-native';
import { ThemeCanvas } from '@components/ui';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

function ThemeCanvasDemo(args: AnimatedComponentPreviewProps) {
  return (
    <AnimatedComponentPreview {...args}>
      <ThemeCanvas />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Theme Canvas',
  component: ThemeCanvasDemo,
  args: { colorScheme: 'light', rtl: false },
  argTypes: { rtl: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Switch dark mode rapidly, toggle Reduce motion and change RTL. The StoryTheme provider isolates these appearance changes from saved app preferences. The real Settings reveal remains in Appearance Canvas/Settings Screen Reveal.',
      },
    },
  },
} satisfies Meta<typeof ThemeCanvasDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
