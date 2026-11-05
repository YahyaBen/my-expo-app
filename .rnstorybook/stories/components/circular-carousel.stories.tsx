import type { Meta, StoryObj } from '@storybook/react-native';
import {
  CircularCarousel,
  Column,
  Icon,
  UniversalTextContent,
  type CircularCarouselItem,
  type PhotoItem,
} from '@components/ui';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { AnimatedComponentPreviewProps } from '../../components/animated-component-preview';
import { PhotoCarouselPreview } from '../../components/photo-carousel-preview';
import { photoFixtures, photoDatasets } from '../../components/photo-fixtures';
import { AnimatedComponentPreview } from '../../components/animated-component-preview';

type Props = AnimatedComponentPreviewProps & {
  items: readonly PhotoItem[];
  width: number;
  height?: number;
  dataset?: keyof typeof photoDatasets;
  artwork?: 'photos' | 'icons' | 'mixed';
};

function CircularCarouselDemo({
  items: initialItems,
  width,
  height,
  dataset = 'photos',
  artwork = 'photos',
  ...preview
}: Readonly<Props>) {
  if (artwork !== 'photos')
    return (
      <InteractiveCircularCarouselDemo
        {...preview}
        width={width}
        height={height}
        mixed={artwork === 'mixed'}
      />
    );
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
          accessibilityLabel="Circular Carousel photos"
          testID="story-circular-carousel"
        />
      )}
    </PhotoCarouselPreview>
  );
}

function InteractiveCircularCarouselDemo({
  width: requestedWidth,
  height,
  mixed,
  ...preview
}: Readonly<
  AnimatedComponentPreviewProps & {
    width: number;
    height?: number;
    mixed: boolean;
  }
>) {
  const window = useWindowDimensions();
  const width = Math.min(requestedWidth, window.width - 32);
  const [selected, setSelected] = useState<string>();
  const [previewName, setPreviewName] = useState('No swipe preview yet');
  const [pressed, setPressed] = useState('No item activated');
  const items: readonly CircularCarouselItem[] = [
    {
      id: 'button',
      label: 'Button',
      icon: Icon.select({ ios: 'square.grid.2x2', android: 'widgets' }),
    },
    ...(mixed ? [photoFixtures[0]] : []),
    { id: 'text', label: 'Text', icon: Icon.select({ ios: 'textformat', android: 'text_fields' }) },
    { id: 'icon', label: 'Icon', icon: Icon.select({ ios: 'star', android: 'star' }) },
    {
      id: 'generic',
      label: 'Generic component',
      icon: Icon.select({ ios: 'square.grid.2x2', android: 'widgets' }),
    },
  ];
  return (
    <AnimatedComponentPreview {...preview}>
      <CircularCarousel
        items={items}
        width={width}
        height={height}
        accessibilityLabel="Component pages"
        onPreviewIndexChange={(_, item) => setPreviewName(item.label)}
        onIndexChange={(_, item) => setSelected(item.label)}
        onItemPress={(_, item) => setPressed(`Activated ${item.label}`)}
        testID="story-interactive-circular-carousel"
      />
      <UniversalTextContent testID="story-carousel-preview-name">
        {previewName}
      </UniversalTextContent>
      {selected ? (
        <Column style={{ padding: 12, borderRadius: 12 }}>
          <UniversalTextContent testID="story-carousel-selected-name">
            {selected}
          </UniversalTextContent>
        </Column>
      ) : null}
      <UniversalTextContent testID="story-carousel-activation">{pressed}</UniversalTextContent>
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Circular Carousel',
  component: CircularCarouselDemo,
  args: {
    items: photoFixtures,
    width: 300,
    colorScheme: 'light',
    rtl: false,
    artwork: 'photos',
  },
  argTypes: {
    rtl: { control: 'boolean' },
    width: { control: { type: 'range', min: 160, max: 600, step: 10 } },
    items: { control: 'object' },
    artwork: { control: 'select', options: ['photos', 'icons', 'mixed'] },
    dataset: { control: 'select', options: ['photos', 'large-200', 'large-1000'] },
    height: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Caller-owned photos or icons, labels and dimensions. Icons/mixed: begin a slow drag to show the preview name immediately, then cross item centers or fling to update it. Settled selection changes only after scrolling stops. Same-item drags still preview; initial layout stays silent. Tap any circle to activate; swiping must never activate. Check circle edges and accessibility activate/increment/decrement. Photos: each changed settled selection gives one subtle tick. Replace/clear data and inspect large-200/large-1000 windows. Check live RTL and Reduce motion on both native platforms.',
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
