import type { Meta, StoryObj } from '@storybook/react-native';
import { StoryList, type PhotoItem } from '@components/ui';
import type { AnimatedComponentPreviewProps } from '../../components/animated-component-preview';
import { PhotoCarouselPreview } from '../../components/photo-carousel-preview';
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
  width,
  height,
  itemWidth,
  dataset = 'photos',
  ...preview
}: Readonly<Props>) {
  return (
    <PhotoCarouselPreview
      {...preview}
      items={dataset === 'photos' ? initialItems : photoDatasets[dataset]}
      width={width}
      testID="story-list"
    >
      {(photoProps) => (
        <StoryList
          {...photoProps}
          height={height}
          itemWidth={itemWidth}
          accessibilityLabel="Story List photos"
          testID="story-story-list"
        />
      )}
    </PhotoCarouselPreview>
  );
}

const meta = {
  title: 'Components/Story List',
  component: StoryListDemo,
  args: { items: photoFixtures, width: 400, colorScheme: 'light', rtl: false },
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
