import type { Meta, StoryObj } from '@storybook/react-native';
import TemplateScreen from '@/features/template/template-screen';
import type { StoryThemeProps } from '../../components/story-theme';

const meta = {
  title: 'Wireframes/Template',
  args: { themeId: 'ux', colorScheme: 'light' },
  render: () => <TemplateScreen />,
} satisfies Meta<Parameters<typeof TemplateScreen>[0] & StoryThemeProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
