import { EmptyState, Icon, ScrollView, UniversalHost, type EmptyStateProps } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';

type Props = EmptyStateProps & { colorScheme: 'light' | 'dark' };

function EmptyStateDemo({ colorScheme, ...props }: Readonly<Props>) {
  return (
    <UniversalHost colorScheme={colorScheme} matchContents={false} style={{ flex: 1 }}>
      <ScrollView>
        <EmptyState {...props} />
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Empty State',
  component: EmptyStateDemo,
  args: {
    title: 'No Projects Yet',
    description:
      "You haven't created any projects yet.\nGet started by creating your first project.",
    primaryAction: { label: 'Create Project', onPress: action('create project') },
    secondaryAction: { label: 'Import Project', onPress: action('import project') },
    footerAction: { label: 'Learn More', onPress: action('learn more'), external: true },
    colorScheme: 'light',
    testID: 'empty-state-demo',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    icon: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
    footerAction: { control: false },
  },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const DisabledActions: Story = {
  args: {
    primaryAction: { label: 'Create Project', onPress: action('disabled create'), disabled: true },
    secondaryAction: {
      label: 'Import Project',
      onPress: action('disabled import'),
      disabled: true,
    },
    footerAction: {
      label: 'Learn More',
      onPress: action('disabled learn more'),
      disabled: true,
      external: true,
    },
  },
};
export const NoActions: Story = {
  args: { primaryAction: undefined, secondaryAction: undefined, footerAction: undefined },
};
export const SearchResults: Story = {
  args: {
    title: 'No results found',
    description: 'Try another search or clear your filters to see all results.',
    icon: Icon.select({ ios: 'magnifyingglass', android: 'search' }),
    primaryAction: { label: 'Clear filters', onPress: action('clear filters') },
    secondaryAction: undefined,
    footerAction: undefined,
  },
};
