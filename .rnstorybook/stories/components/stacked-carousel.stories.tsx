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
import { photoFixtures } from '../../components/photo-fixtures';

type Props = AnimatedComponentPreviewProps & {
  items: readonly PhotoItem[];
  width: number;
  height?: number;
  itemWidth?: number;
};

function StackedCarouselDemo({
  items: initialItems,
  width: requestedWidth,
  height,
  itemWidth,
  ...preview
}: Readonly<Props>) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.max(1, Math.min(requestedWidth, screenWidth - spacing.lg * 2));
  const [replacement, setReplacement] = useState<readonly PhotoItem[] | null>(null);
  const items = replacement ?? initialItems;
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
  args: { items: photoFixtures, width: 300, colorScheme: 'light', rtl: false },
  argTypes: {
    rtl: { control: 'boolean' },
    width: { control: { type: 'range', min: 160, max: 600, step: 10 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned images, labels and dimensions. Swipe or use accessibility actions: each changed settled selection gives one subtle tick. Initial render, resizing, data replacement and selecting the current photo stay silent. Replace/clear data and watch the callback count. Check live RTL and Reduce motion on native devices.',
      },
    },
  },
} satisfies Meta<typeof StackedCarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
export const Compact: Story = { args: { width: 220, height: 180 } };
export const OpaqueCardLayers: Story = {
  args: {
    items: ['#e11d48', '#2563eb', '#15803d', '#7e22ce'].map((color, index) => ({
      id: `opaque-card-${index}`,
      label: `Card ${index + 1}`,
      source: `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="${color}"/><text x="300" y="250" text-anchor="middle" font-size="160" font-weight="bold" fill="white">${index + 1}</text></svg>`,
      )}`,
    })),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Before swiping and after each settled selection, the front card must stay fully visible; tilted rear cards may only peek out below it. Drag slowly forward and backward, pausing halfway: colors and numbers must stay solid, with the next card visible only outside the outgoing card. Repeat with Reduce motion, RTL and the compact size.',
      },
    },
  },
};
export const Empty: Story = { args: { items: [] } };
export const SinglePhoto: Story = { args: { items: photoFixtures.slice(0, 1) } };
