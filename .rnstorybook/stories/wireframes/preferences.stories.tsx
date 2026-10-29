import type { Meta, StoryObj } from '@storybook/react-native';
import SettingsPreview from '../../components/device/settings-preview';
import type { StoryThemeProps } from '../../components/story-theme';

const meta = {
  title: 'Wireframes/Preferences',
  component: SettingsPreview,
  args: { themeId: 'ux', colorScheme: 'light' },
  render: () => <SettingsPreview />,
  parameters: {
    docs: {
      description: {
        story:
          'Appearance stays inside the story. Language and device feature switches use saved preferences; permission, location and notification actions use the real device only when requested.',
      },
    },
  },
} satisfies Meta<StoryThemeProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Preferences: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
