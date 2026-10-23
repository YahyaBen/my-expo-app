import type { Meta, StoryObj } from '@storybook/react-native';
import TokensScreen from '@/features/ui-showcase/tokens-screen';
import type { StoryThemeProps } from '../../components/story-theme';

const meta = {
  title: 'Components/Theme Tokens',
  component: TokensScreen,
  args: { themeId: 'altarea', colorScheme: 'light' },
  render: () => <TokensScreen />,
  parameters: {
    docs: {
      description: {
        story:
          'Production theme tokens and native controls. Enabled actions increment the count; the disabled action does not. The square button explicitly overrides the theme radius with zero. Edit and reset the local input draft, then inspect typography, shapes, shared spacing and semantic colors.',
      },
    },
  },
} satisfies Meta<StoryThemeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AltareaLight: Story = {};
export const AltareaDark: Story = { args: { colorScheme: 'dark' } };
export const UXLight: Story = { args: { themeId: 'ux' } };
export const UXDark: Story = { args: { themeId: 'ux', colorScheme: 'dark' } };
