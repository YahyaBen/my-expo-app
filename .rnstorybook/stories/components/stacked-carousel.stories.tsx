import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  StackedCarousel,
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
import { svgImageSource } from '../../components/svg-image-source';

const opaqueCards = ['#e11d48', '#2563eb', '#15803d', '#7e22ce'].map((color, index) => ({
  id: `opaque-card-${index}`,
  label: `Card ${index + 1}`,
  source: svgImageSource(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="${color}"/><text x="300" y="250" text-anchor="middle" font-size="160" font-weight="bold" fill="white">${index + 1}</text></svg>`,
  ),
}));

type Props = AnimatedComponentPreviewProps & {
  items: readonly PhotoItem[];
  width: number;
  height?: number;
  itemWidth?: number;
  dataset?: keyof typeof photoDatasets | 'opaque-cards';
};

function StackedCarouselDemo({
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
  const items =
    replacement ??
    (dataset === 'opaque-cards'
      ? opaqueCards
      : dataset === 'photos'
        ? initialItems
        : photoDatasets[dataset]);
  const [selection, setSelection] = useState('No selection callback yet');
  const [events, setEvents] = useState(0);
  return (
    <AnimatedComponentPreview {...preview}>
      <StackedCarousel
        items={items}
        width={width}
        height={height}
        itemWidth={itemWidth}
        accessibilityLabel="Stacked Carousel photos"
        getPositionLabel={(index, total) => `Photo ${index + 1} of ${total}`}
        onIndexChange={(index, item) => {
          setEvents((count) => count + 1);
          setSelection(`${item.label} at index ${index}`);
        }}
        testID="story-stacked-carousel"
      />
      <UniversalTextContent testID="stacked-carousel-selection">
        {`${selection}; ${events} callbacks`}
      </UniversalTextContent>
      <UniversalButtonContent
        variant="secondary"
        label="Replace with the last two photos"
        onPress={() => setReplacement(photoFixtures.slice(-2))}
        testID="stacked-carousel-replace"
      />
      <UniversalButtonContent
        variant="secondary"
        label="Clear photos"
        onPress={() => setReplacement([])}
        testID="stacked-carousel-clear"
      />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Stacked Carousel',
  component: StackedCarouselDemo,
  args: {
    items: photoFixtures,
    width: 300,
    colorScheme: 'light',
    rtl: false,
    dataset: 'photos',
  },
  argTypes: {
    rtl: { control: 'boolean' },
    width: { control: { type: 'range', min: 160, max: 600, step: 10 } },
    items: { control: 'object' },
    height: { control: { type: 'number', min: 1 } },
    itemWidth: { control: { type: 'number', min: 1 } },
    dataset: { control: 'select', options: ['photos', 'opaque-cards', 'large-200', 'large-1000'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned images, labels and dimensions. Swipe or use accessibility actions: each changed settled selection gives one subtle tick. Initial render, resizing, data replacement and selecting the current photo stay silent. Replace/clear data and watch the callback count. Select large-200 or large-1000 and inspect mounted photo selectors while swiping to later items and back. Offline payloads repeat; unique image decoding needs separate measurement. Check live RTL and Reduce motion on native devices.',
      },
    },
  },

  render: (args) => (
    <StackedCarouselDemo key={JSON.stringify([args.items, args.dataset])} {...args} />
  ),
} satisfies Meta<typeof StackedCarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
