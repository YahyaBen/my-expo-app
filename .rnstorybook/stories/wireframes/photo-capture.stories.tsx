import ComponentScreen from '@/features/template/component-screen';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'Wireframes/Photo Capture',
  component: ComponentScreen,
  args: { id: 'circular-carousel' },
  argTypes: {
    id: {
      control: 'select',
      options: ['circular-carousel', 'stacked-carousel', 'story-list', 'ios-home-grid'],
    },
  },
  render: (args) => <ComponentScreen key={args.id} {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use a physical device to take several photos or choose multiple library images. Switch the native layout picker between circular, stacked, story list and photo grid; the same collection stays available. Cancel the camera/picker and deny camera access to check draft retention and translated feedback. Check Clear, grid expansion/Close, light/dark, RTL, large text and Reduce Motion on iOS/Android. Camera and photo actions respect App Settings opt-outs. Photos are local to this screen session. On Android, also check activity recreation with Don’t keep activities enabled.',
      },
    },
  },
} satisfies Meta<typeof ComponentScreen>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Circular: Story = {};
export const Stacked: Story = { args: { id: 'stacked-carousel' } };
export const StoryList: Story = { args: { id: 'story-list' } };
export const PhotoGrid: Story = { args: { id: 'ios-home-grid' } };
