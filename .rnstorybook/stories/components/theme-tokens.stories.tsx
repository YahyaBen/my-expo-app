import type { Meta, StoryObj } from '@storybook/react-native';
import TokensScreen from '../../components/catalog/tokens-preview';
import type { StoryThemeProps } from '../../components/story-theme';

const meta = {
  title: 'Components/Theme Tokens',
  component: TokensScreen,
  args: { themeId: 'ux', colorScheme: 'light' },
  render: () => <TokensScreen />,
  parameters: {
    docs: {
      description: {
        story:
          'Production theme tokens and native controls. UX uses neutral surfaces with a purple accent; native tones follow the Host seed. Inspect text hierarchy, line heights, disabled text and surface contrast. Toggle field and submit errors to inspect icon-and-text feedback. Enabled actions increment the count; the disabled action does not. Drafts and error state remain local to the preview.',
      },
    },
  },
} satisfies Meta<StoryThemeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
