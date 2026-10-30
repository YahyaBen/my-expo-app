import { TableDemo, type TableDemoProps } from '../../components/catalog/table-preview';
import { UniversalHost, type UniversalThemeProps } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';

type TableStoryProps = TableDemoProps & Pick<UniversalThemeProps, 'colorScheme'>;

function TableStory({ colorScheme = 'light', ...props }: Readonly<TableStoryProps>) {
  return (
    <NativeStoryFrame colorScheme={colorScheme} testID="table-story">
      <UniversalHost colorScheme={colorScheme}>
        <TableDemo key={`${props.initialSearch}-${props.initialStatus}`} {...props} />
      </UniversalHost>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Components/Table',
  component: TableStory,
  args: {
    colorScheme: 'light',
    initialSearch: '',
    readOnly: false,
    testID: 'story-table',
    initialStatus: 'all',
  },
  argTypes: {
    colorScheme: { control: 'radio', options: ['light', 'dark'] },
    initialSearch: { control: 'text' },
    initialStatus: { control: 'select', options: ['all', 'preparing', 'ready'] },
    readOnly: { control: 'boolean' },
    testID: { control: false },
  },
} satisfies Meta<typeof TableStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
