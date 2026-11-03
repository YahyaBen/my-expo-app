import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Column, RNHostView } from '@expo/ui';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillWidth } from '../native/native-fill-width';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import { radii, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';

import type { PhotoItem } from '../photo/photo-item';
import { interpolatePhotoMotion } from '../photo/photo-motion';
import { PhotoScrollView } from '../photo/photo-scroll-view';
import { usePhotoSelection } from '../photo/use-photo-selection';

const motionInput = [-2, -1, 0, 1, 2] as const;
const scaleOutput = [0.5, 0.9, 1.2, 0.9, 0.5] as const;
const opacityOutput = [0.5, 1, 1, 1, 0.5] as const;

export type CircularCarouselProps = {
  /** Unique, stable IDs; an empty list renders nothing. */
  items: readonly PhotoItem[];
  /** Available viewport dimensions in native points/dp, supplied by the parent. */
  width: number;
  height?: number;
  itemSize?: number;
  accessibilityLabel: string;
  /** Format a zero-based index for both the visible caption and screen reader. */
  getPositionLabel?: (index: number, total: number) => string;
  /** Fires once when a user selects a different item, never on initial render. */
  onIndexChange?: (index: number, item: PhotoItem) => void;
  scaleEnabled?: boolean;
  testID?: string;
};

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/circular-carousel
export function CircularCarousel(props: Readonly<CircularCarouselProps>) {
  if (props.items.length === 0 || !Number.isFinite(props.width) || props.width <= 0) return null;
  // A changed data order starts a fresh selection; resizing keeps the current item.
  return (
    <CircularCarouselContent key={JSON.stringify(props.items.map((item) => item.id))} {...props} />
  );
}

function CircularCarouselContent({
  items,
  width: availableWidth,
  height: requestedHeight,
  itemSize: requestedItemSize,
  scaleEnabled = false,

  accessibilityLabel,
  getPositionLabel,
  onIndexChange,
  testID = 'circular-carousel',
}: Readonly<CircularCarouselProps>) {
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();

  const width = Math.max(1, availableWidth);
  const cardWidth = Math.max(1, Math.min(width, requestedItemSize ?? width / 4));
  const cardHeight = cardWidth;
  const height = Math.max(1, requestedHeight ?? cardWidth * 3);
  const {
    scrollRef,
    selectedIndex,
    scrollOffset,
    updateSelection,
    positionLabel,
    accessibilityProps,
  } = usePhotoSelection({
    items,
    itemWidth: cardWidth,
    reducedMotion,
    accessibilityLabel,
    getPositionLabel,
    onIndexChange,
    onSelectionFeedback: () => triggerHaptic('selection'),
  });

  const scaleProgress = useDerivedValue<number>(() => {
    if (reducedMotion) return 0;
    return withSpring(scaleEnabled ? 1 : 0, { duration: 400, dampingRatio: 1 });
  });

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <RNHostView matchContents>
        <View
          style={{ width, height, overflow: 'hidden', direction: 'ltr' }}
          {...accessibilityProps}
          testID={`${testID}-cards`}
        >
          <PhotoScrollView
            ref={scrollRef}
            items={items}
            width={width}
            height={height}
            itemWidth={cardWidth}
            rtl={rtl}
            selectedIndex={selectedIndex}
            scrollOffset={scrollOffset}
            onIndexChange={updateSelection}
            renderItem={({ item, index }) => (
              <PhotoCard
                item={item}
                index={index}
                width={cardWidth}
                height={cardHeight}
                inset={(width - cardWidth) / 2}
                scrollOffset={scrollOffset}
                sceneWidth={width}
                sceneHeight={height}
                scaleProgress={scaleProgress}
                rtl={rtl}
                reducedMotion={reducedMotion}
                testID={`${testID}-photo-${item.id}`}
              />
            )}
            testID={`${testID}-scroll`}
          />
        </View>
      </RNHostView>

      {positionLabel ? (
        <UniversalTextContent variant="caption" tone="muted" testID={`${testID}-position`}>
          {positionLabel}
        </UniversalTextContent>
      ) : null}
    </Column>
  );
}

function PhotoCard({
  item,
  index,
  width,
  height,
  inset,
  scrollOffset,
  scaleProgress,
  sceneWidth,
  sceneHeight,
  rtl,
  reducedMotion,
  testID,
}: Readonly<{
  item: PhotoItem;
  index: number;
  width: number;
  height: number;
  inset: number;
  scrollOffset: SharedValue<number>;
  scaleProgress: SharedValue<number>;
  sceneWidth: number;
  sceneHeight: number;
  rtl: boolean;
  reducedMotion: boolean;
  testID: string;
}>) {
  const colors = useThemeColors(useHostColorScheme());
  const insetX = inset + spacing.sm;
  const diameter = Math.max(1, width - spacing.lg);
  const left = rtl ? sceneWidth - insetX - diameter : insetX;
  const radius = diameter * 0.6;
  const translateYOutput = useMemo(() => [0, -width / 3, -width / 2, -width / 3, 0], [width]);
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollOffset.get() / width;
    const distance = position - index;
    const translateX = -distance * width * (rtl ? -1 : 1);
    // Include the largest possible scale so a card is never hidden while any
    // of its artwork can still enter the viewport.
    const centerX = left + diameter / 2 + translateX;
    if (centerX + radius <= 0 || centerX - radius >= sceneWidth) return { opacity: 0 };
    const scale = interpolatePhotoMotion(distance, motionInput, scaleOutput);
    return {
      opacity: reducedMotion ? 1 : interpolatePhotoMotion(distance, motionInput, opacityOutput),
      transform: [
        {
          translateY: reducedMotion
            ? 0
            : interpolatePhotoMotion(distance, motionInput, translateYOutput),
        },
        { scale: 1 + (scale - 1) * scaleProgress.get() },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: (sceneHeight - width) / 2 + spacing.sm,
          left: rtl ? undefined : insetX,
          right: rtl ? insetX : undefined,
          width: Math.max(1, width - spacing.lg),
          height: Math.max(1, height - spacing.lg),
          borderRadius: radii.pill,
          borderWidth: 2,
          borderColor: colors.background,
          overflow: 'hidden',
          backgroundColor: colors.surfaceVariant,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={item.source}
        contentFit="cover"
        cachePolicy="memory-disk"
        accessible={false}
        style={StyleSheet.absoluteFill}
        testID={testID}
      />
    </Animated.View>
  );
}
