import { TableDemo, type TableDemoProps } from '@/features/ui-showcase/table-screen';
import { UniversalHost, type UniversalThemeProps } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';

type TableStoryProps = TableDemoProps & Pick<UniversalThemeProps, 'colorScheme'>;

function TableStory({ colorScheme = 'light', ...props }: Readonly<TableStoryProps>) {
  return (
    <NativeStoryFrame colorScheme={colorScheme} testID="table-story">
      <UniversalHost colorScheme={colorScheme}>
        <TableDemo {...props} />
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
  },
  argTypes: {
    colorScheme: { control: 'radio', options: ['light', 'dark'] },
    initialSearch: { control: false },
    initialStatus: { control: false },
    readOnly: { control: 'boolean' },
    testID: { control: false },
  },
} satisfies Meta<typeof TableStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Clear filters restores all rows; native search keeps the same field instance. */
export const Empty: Story = {
  args: { initialSearch: 'missing-order', testID: 'story-table-empty' },
};

export const ReadOnly: Story = {
  args: { readOnly: true, testID: 'story-table-read-only' },
};

export const Dark: Story = {
  args: { colorScheme: 'dark', testID: 'story-table-dark' },
};

/** A single bar and full status ring follow the same filter as the table. */
export const SingleOrder: Story = {
  args: { initialSearch: 'Sofia', testID: 'story-table-single-order' },
};

/** Marking a filtered preparing order ready removes it from the table and charts. */
export const PreparingOrders: Story = {
  args: { initialStatus: 'preparing', testID: 'story-table-preparing-orders' },
};

export const ReadyOrders: Story = {
  args: { initialStatus: 'ready', testID: 'story-table-ready-orders' },
};
