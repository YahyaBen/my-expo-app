import { useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { ButtonContent, UniversalTextContent, type PhotoItem } from '@components/ui';
import { spacing } from '@/constants/layout';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from './animated-component-preview';
import { photoFixtures } from './photo-fixtures';

type PhotoPreviewProps = {
  items: readonly PhotoItem[];
  width: number;
  getPositionLabel: (index: number, total: number) => string;
  onIndexChange: (index: number, item: PhotoItem) => void;
};

type PhotoCarouselPreviewProps = AnimatedComponentPreviewProps & {
  items: readonly PhotoItem[];
  width: number;
  testID: string;
  children: (props: PhotoPreviewProps) => ReactNode;
};

const getPositionLabel = (index: number, total: number) => `Photo ${index + 1} of ${total}`;

/** Shared replacement controls and callback feedback for the photo carousel stories. */
export function PhotoCarouselPreview({
  items: initialItems,
  width: requestedWidth,
  testID,
  children,
  ...preview
}: Readonly<PhotoCarouselPreviewProps>) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.max(1, Math.min(requestedWidth, screenWidth - spacing.lg * 2));
  const [replacement, setReplacement] = useState<readonly PhotoItem[] | null>(null);
  const [selection, setSelection] = useState('No selection callback yet');
  const [events, setEvents] = useState(0);

  return (
    <AnimatedComponentPreview {...preview}>
      {children({
        items: replacement ?? initialItems,
        width,
        getPositionLabel,
        onIndexChange: (index, item) => {
          setEvents((count) => count + 1);
          setSelection(`${item.label} at index ${index}`);
        },
      })}
      <UniversalTextContent testID={`${testID}-selection`}>
        {`${selection}; ${events} callbacks`}
      </UniversalTextContent>
      <ButtonContent
        variant="secondary"
        label="Replace with the last two photos"
        onPress={() => setReplacement(photoFixtures.slice(-2))}
        testID={`${testID}-replace`}
      />
      <ButtonContent
        variant="secondary"
        label="Clear photos"
        onPress={() => setReplacement([])}
        testID={`${testID}-clear`}
      />
    </AnimatedComponentPreview>
  );
}
