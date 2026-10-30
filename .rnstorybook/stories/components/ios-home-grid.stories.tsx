import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Column, IosHomeGrid, UniversalButtonContent, UniversalTextContent } from '@components/ui';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';
import { photoFixtures as photos } from '../../components/photo-fixtures';

type GridDemoProps = AnimatedComponentPreviewProps & {
  columns: number;
  itemCount: number;
  contentWidth?: number;
};

function IosHomeGridDemo({
  columns,
  itemCount,
  contentWidth,
  ...preview
}: Readonly<GridDemoProps>) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth =
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2;
  const width = Math.max(1, Math.min(availableWidth, contentWidth ?? availableWidth));
  const [replaced, setReplaced] = useState(false);
  const [event, setEvent] = useState('No selection yet');
  const items = (replaced ? photos.slice(4) : photos).slice(0, Math.max(0, itemCount));

  return (
    <AnimatedComponentPreview {...preview}>
      <Column spacing={spacing.md}>
        <IosHomeGrid
          items={items}
          width={width}
          columns={columns}
          closeLabel="Close photo"
          dismissHint="Drag down or use Close photo to return."
          onSelect={(item, index) => setEvent(`Selected ${item.label} at index ${index}`)}
          onClose={(item, index) => setEvent(`Closed ${item.label} at index ${index}`)}
          testID="story-ios-home-grid"
        />
        <UniversalTextContent testID="story-ios-home-grid-event">{event}</UniversalTextContent>
        <UniversalButtonContent
          variant="secondary"
          label="Replace photos"
          onPress={() => setReplaced((value) => !value)}
          testID="story-ios-home-grid-replace"
        />
      </Column>
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/iOS Home Grid',
  component: IosHomeGridDemo,
  args: { colorScheme: 'light', rtl: false, columns: 4, itemCount: 12 },
  argTypes: {
    rtl: { control: 'boolean' },
    columns: { control: { type: 'number', min: 1, max: 6, step: 1 } },
    itemCount: { control: { type: 'number', min: 0, max: 12, step: 1 } },
    contentWidth: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned photos, labels, width and columns. On first and repeated opens, the thumbnail stays visible until the expanded image displays, then zooms. Check slow/failed image loads and Close before display, then replace the dataset while expanded. Verify callbacks, partial rows, empty/one-item data, native photo/label edge taps, RTL, large text and Reduce motion on devices.',
      },
    },
  },
} satisfies Meta<typeof IosHomeGridDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
