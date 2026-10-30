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
import { photoFixtures as photos, largePhotoFixtures } from '../../components/photo-fixtures';

type GridDemoProps = AnimatedComponentPreviewProps & {
  columns: number;
  itemCount: number;
  contentWidth?: number;
  viewportHeight?: number;
};

function IosHomeGridDemo({
  columns,
  itemCount,
  contentWidth,
  viewportHeight,
  ...preview
}: Readonly<GridDemoProps>) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth =
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2;
  const width = Math.max(1, Math.min(availableWidth, contentWidth ?? availableWidth));
  const [replaced, setReplaced] = useState(false);
  const [event, setEvent] = useState('No selection yet');
  const items = (replaced ? photos.slice(4) : largePhotoFixtures).slice(0, Math.max(0, itemCount));
  const boundedHeight =
    viewportHeight ?? (itemCount > photos.length ? Math.min(320, windowHeight * 0.4) : undefined);

  return (
    <AnimatedComponentPreview {...preview} scrollable={boundedHeight === undefined}>
      <Column spacing={spacing.md}>
        <IosHomeGrid
          items={items}
          width={width}
          viewportHeight={boundedHeight}
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
    itemCount: { control: 'select', options: [0, 1, 11, 12, 200, 1000] },
    contentWidth: { control: 'number' },
    viewportHeight: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned photos, labels, width and columns. Counts 200/1000 use a bounded virtualized viewport with no surrounding vertical scroll. Inspect mounted photo selectors while scrolling, open a later row and return, then replace data while expanded. The thumbnail stays visible until the expanded image displays. Also check slow/failed loads, Close before display, callbacks, partial rows, edge taps, RTL, large text and Reduce motion. Offline payloads repeat, so this measures view lifetime rather than unique image decoding.',
      },
    },
  },
} satisfies Meta<typeof IosHomeGridDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
