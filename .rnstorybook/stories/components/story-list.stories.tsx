import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  StoryList,
  UniversalButtonContent,
  UniversalTextContent,
  type PhotoItem,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';
import { photoFixtures, photoDatasets } from '../../components/photo-fixtures';

type Props = AnimatedComponentPreviewProps & {
  items: readonly PhotoItem[];
  width: number;
  height?: number;
  itemWidth?: number;
  dataset?: keyof typeof photoDatasets;
};

function StoryListDemo({
  items: initialItems,
  width: requestedWidth,
  height,
  itemWidth,
  dataset = 'photos',
  ...preview
}: Readonly<Props>) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.max(1, Math.min(requestedWidth, screenWidth - spacing.lg * 2));
  const [replacement, setReplacement] = useState<readonly PhotoItem[] | null>(null);
  const items = replacement ?? (dataset === 'photos' ? initialItems : photoDatasets[dataset]);
  const [selection, setSelection] = useState('No selection callback yet');
  const [events, setEvents] = useState(0);
  return (
    <AnimatedComponentPreview {...preview}>
      <StoryList
        items={items}
        width={width}
        height={height}
        itemWidth={itemWidth}
        accessibilityLabel="Story List photos"
        getPositionLabel={(index, total) => `Photo ${index + 1} of ${total}`}
        onIndexChange={(index, item) => {
          setEvents((count) => count + 1);
          setSelection(`${item.label} at index ${index}`);
        }}
        testID="story-story-list"
      />
      <UniversalTextContent testID="story-list-selection">
        {`${selection}; ${events} callbacks`}
      </UniversalTextContent>
      <UniversalButtonContent
        variant="secondary"
        label="Replace with the last two photos"
        onPress={() => setReplacement(photoFixtures.slice(-2))}
        testID="story-list-replace"
      />
      <UniversalButtonContent
        variant="secondary"
        label="Clear photos"
        onPress={() => setReplacement([])}
        testID="story-list-clear"
      />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Story List',
  component: StoryListDemo,
  args: { items: photoFixtures, width: 300, colorScheme: 'light', rtl: false },
  argTypes: {
    rtl: { control: 'boolean' },
    width: { control: { type: 'range', min: 160, max: 600, step: 10 } },
    items: { control: 'object' },
    dataset: { control: 'select', options: ['photos', 'large-200', 'large-1000'] },
    height: { control: { type: 'number', min: 1 } },
    itemWidth: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned images, labels and dimensions. Swipe or use accessibility actions, resize, replace/clear data and watch the callback count. Select large-200 or large-1000 and inspect mounted photo selectors while swiping to later items and back. Offline payloads repeat; unique image decoding needs separate measurement. Check live RTL and Reduce motion on native devices.',
      },
    },
  },

  render: (args) => <StoryListDemo key={JSON.stringify([args.items, args.dataset])} {...args} />,
} satisfies Meta<typeof StoryListDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
