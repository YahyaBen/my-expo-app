import type { Meta, StoryObj } from '@storybook/react-native';
import NotFoundScreen from '@/features/template/not-found-screen';
import type { StoryThemeProps } from '../../components/story-theme';

const meta = {
  title: 'Wireframes/404 Not Found',
  component: NotFoundScreen,
  args: { themeId: 'ux', colorScheme: 'light' },
  render: () => <NotFoundScreen />,
} satisfies Meta<StoryThemeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
