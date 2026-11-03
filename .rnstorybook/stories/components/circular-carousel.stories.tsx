import type { Meta, StoryObj } from '@storybook/react-native';
import { CircularCarousel, type PhotoItem } from '@components/ui';
import type { AnimatedComponentPreviewProps } from '../../components/animated-component-preview';
import { PhotoCarouselPreview } from '../../components/photo-carousel-preview';
import { photoFixtures, photoDatasets } from '../../components/photo-fixtures';

type Props = AnimatedComponentPreviewProps & {
  items: readonly PhotoItem[];
  width: number;
  height?: number;
  scaleEnabled?: boolean;
  dataset?: keyof typeof photoDatasets;
};

function CircularCarouselDemo({
  items: initialItems,
  width,
  height,
  scaleEnabled,
  dataset = 'photos',
  ...preview
}: Readonly<Props>) {
  return (
    <PhotoCarouselPreview
      {...preview}
      items={dataset === 'photos' ? initialItems : photoDatasets[dataset]}
      width={width}
      testID="circular-carousel"
    >
      {(photoProps) => (
        <CircularCarousel
          {...photoProps}
          height={height}
          scaleEnabled={scaleEnabled}
          accessibilityLabel="Circular Carousel photos"
          testID="story-circular-carousel"
        />
      )}
    </PhotoCarouselPreview>
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
    items: { control: 'object' },
    dataset: { control: 'select', options: ['photos', 'large-200', 'large-1000'] },
    height: { control: { type: 'number', min: 1 } },
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
    <CircularCarouselDemo key={JSON.stringify([args.items, args.dataset])} {...args} />
  ),
} satisfies Meta<typeof CircularCarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
