import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Column, IosHomeGrid, ButtonContent, UniversalTextContent } from '@components/ui';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';
import { photoFixtures as photos, largePhotoFixtures } from '../../components/photo-fixtures';

type GridDemoProps = Omit<AnimatedComponentPreviewProps, 'rtl'> & {
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
          dismissHint="Drag down or use the X button to return."
          onSelect={(item, index) => setEvent(`Selected ${item.label} at index ${index}`)}
          onClose={(item, index) => setEvent(`Closed ${item.label} at index ${index}`)}
          testID="story-ios-home-grid"
        />
        <UniversalTextContent testID="story-ios-home-grid-event">{event}</UniversalTextContent>
        <ButtonContent
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
  args: { colorScheme: 'light', columns: 4, itemCount: 12 },
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 6, step: 1 } },
    itemCount: { control: 'select', options: [0, 1, 11, 12, 200, 1000] },
    contentWidth: { control: 'number' },
    viewportHeight: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'LTR grid with caller-owned photos, labels, width and columns. Photos expand over the entire screen, including page navigation, with an accessible X button inside the top-right safe area and no inline Close button. Check expansion from the narrow grid, the X before image display, Android Back, drag dismissal, callbacks, partial rows, edge taps, large text and Reduce motion. Counts 200/1000 use a bounded virtualized viewport with no surrounding vertical scroll. Inspect mounted photo selectors while scrolling, open a later row and return, then replace data while expanded using the controls. The thumbnail stays visible until the expanded image displays; also check slow/failed loads. Offline payloads repeat, so this measures view lifetime rather than unique image decoding.',
      },
    },
  },
} satisfies Meta<typeof IosHomeGridDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FullScreenFromNarrowGrid: Story = {
  args: { contentWidth: 240, columns: 3, itemCount: 11 },
};
