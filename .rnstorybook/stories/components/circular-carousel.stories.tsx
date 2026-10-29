import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  CircularCarousel,
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
  scaleEnabled?: boolean;
};

function CircularCarouselDemo({
  items: initialItems,
  width: requestedWidth,
  height,
  scaleEnabled,
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
      <CircularCarousel
        items={items}
        width={width}
        height={height}
        scaleEnabled={scaleEnabled}
        accessibilityLabel="Circular Carousel photos"
        getPositionLabel={(index, total) => `Photo ${index + 1} of ${total}`}
        onIndexChange={(index, item) => {
          setEvents((count) => count + 1);
          setSelection(`${item.label} at index ${index}`);
        }}
        testID="story-circular-carousel"
      />
      <UniversalTextContent testID="circular-carousel-selection">
        {`${selection}; ${events} callbacks`}
      </UniversalTextContent>
      <UniversalButtonContent
        variant="secondary"
        label="Replace with the last two photos"
        onPress={() => setReplacement(photoFixtures.slice(-2))}
        testID="circular-carousel-replace"
      />
      <UniversalButtonContent
        variant="secondary"
        label="Clear photos"
        onPress={() => setReplacement([])}
        testID="circular-carousel-clear"
      />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Circular Carousel',
  component: CircularCarouselDemo,
  args: { items: photoFixtures, width: 300, colorScheme: 'light', rtl: false, scaleEnabled: false },
  argTypes: {
    rtl: { control: 'boolean' },
    width: { control: { type: 'range', min: 160, max: 600, step: 10 } },
    scaleEnabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned images, labels and dimensions. Swipe or use accessibility actions: each changed settled selection gives one subtle tick. Initial render, resizing, data replacement and selecting the current photo stay silent. Replace/clear data and watch the callback count. Check live RTL and Reduce motion on native devices.',
      },
    },
  },
} satisfies Meta<typeof CircularCarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
export const Compact: Story = { args: { width: 220 } };
export const Empty: Story = { args: { items: [] } };
export const SinglePhoto: Story = { args: { items: photoFixtures.slice(0, 1) } };
