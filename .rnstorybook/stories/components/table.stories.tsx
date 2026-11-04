import { TableDemo, type TableDemoProps } from '../../components/catalog/table-preview';
import { UniversalHost } from '@components/ui';
import { TableExamples } from '@/features/template/table-examples';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame, type NativeStoryTheme } from '../../components/native-story-frame';

type TableStoryProps = TableDemoProps &
  Pick<NativeStoryTheme, 'colorScheme'> & {
    example: 'selection' | 'orders';
  };

function TableStory({ colorScheme = 'light', example, ...props }: Readonly<TableStoryProps>) {
  return (
    <NativeStoryFrame colorScheme={colorScheme} testID="table-story">
      <UniversalHost colorScheme={colorScheme}>
        {example === 'selection' ? (
          <TableExamples contentWidth={280} readOnly={props.readOnly} />
        ) : (
          <TableDemo key={`${props.initialSearch}-${props.initialStatus}`} {...props} />
        )}
      </UniversalHost>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Components/Table',
  component: TableStory,
  args: {
    colorScheme: 'light',
    example: 'selection',
    initialSearch: '',
    readOnly: false,
    testID: 'story-table',
    initialStatus: 'all',
  },
  argTypes: {
    example: { control: 'select', options: ['selection', 'orders'] },
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
