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
          'Settings shares PageScreen with Home and Discover while its bounded native FieldGroup owns scrolling. Check first-section header clearance, final-row reachability and keyboard access; use the wireframe Settings tab to check the raised dock action. Choose UX Template or System in Appearance > Theme to change the preview immediately. Palette and light/dark choices stay inside the story. Language and device feature switches use saved preferences; permission, location and notification actions use the real device only when requested. Check switching themes with a language sheet open, RTL and large text.',
      },
    },
  },
} satisfies Meta<StoryThemeProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Preferences: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
