import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Column, RNHostView, Row } from '@expo/ui';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillWidth, nativeFillWidthCenter } from '../native/native-fill-width';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';

import { radii, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';

import type { PhotoItem } from '../photo/photo-item';
import { interpolatePhotoMotion } from '../photo/photo-motion';
import { PhotoScrollView } from '../photo/photo-scroll-view';
import { usePhotoSelection } from '../photo/use-photo-selection';

const motionInput = [-2, -1, 0, 1] as const;
const opacityInput = [-3, -2, -1, 0, 1] as const;
const opacityOutput = [0, 1, 1, 1, 1] as const;
const scaleOutput = [0.86, 0.93, 1, 1.12] as const;
const rotationOutput = [32, 16, 0, 0] as const;

export type StackedCarouselProps = {
  /** Unique, stable IDs; an empty list renders nothing. */
  items: readonly PhotoItem[];
  /** Available viewport dimensions in native points/dp, supplied by the parent. */
  width: number;
  height?: number;
  itemWidth?: number;
  accessibilityLabel: string;
  /** Format a zero-based index for both the visible caption and screen reader. */
  getPositionLabel?: (index: number, total: number) => string;
  /** Fires once when a user selects a different item, never on initial render. */
  onIndexChange?: (index: number, item: PhotoItem) => void;
  showIndicators?: boolean;
  testID?: string;
};

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/stacked-carousel
export function StackedCarousel(props: Readonly<StackedCarouselProps>) {
  if (props.items.length === 0 || !Number.isFinite(props.width) || props.width <= 0) return null;
  // A changed data order starts a fresh selection; resizing keeps the current item.
  return (
    <StackedCarouselContent key={JSON.stringify(props.items.map((item) => item.id))} {...props} />
  );
}

function StackedCarouselContent({
  items,
  width: availableWidth,
  height: requestedHeight,
  itemWidth: requestedItemWidth,
  showIndicators = true,
  accessibilityLabel,
  getPositionLabel,
  onIndexChange,
  testID = 'stacked-carousel',
}: Readonly<StackedCarouselProps>) {
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();
  const colors = useThemeColors(useHostColorScheme());
  const width = Math.max(1, availableWidth);
  const cardWidth = Math.max(
    1,
    Math.min(width, requestedItemWidth ?? Math.min(width - spacing.xs * 2, 480)),
  );
  const height = Math.max(spacing.xl * 3 + 1, requestedHeight ?? cardWidth * 0.9 + spacing.xl * 3);
  const cardHeight = height - spacing.xl * 3;
  const {
    scrollRef,
    selectedIndex,
    activeIndex,
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

  const firstIndicator = Math.max(0, Math.min(activeIndex - 3, items.length - 7));

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
                rtl={rtl}
                reducedMotion={reducedMotion}
                testID={`${testID}-photo-${item.id}`}
              />
            )}
            testID={`${testID}-scroll`}
          />
        </View>
      </RNHostView>
      {showIndicators ? (
        <Column alignment="center" modifiers={nativeFillWidthCenter}>
          <Row spacing={spacing.sm}>
            {items.slice(firstIndicator, firstIndicator + 7).map((item, offset) => (
              <Column
                key={item.id}
                testID={`${testID}-dot-${firstIndicator + offset}`}
                style={{
                  width: spacing.sm,
                  height: spacing.sm,
                  borderRadius: radii.pill,
                  backgroundColor:
                    firstIndicator + offset === activeIndex ? colors.tint : colors.surfaceVariant,
                }}
              />
            ))}
          </Row>
        </Column>
      ) : null}
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

  rtl: boolean;
  reducedMotion: boolean;
  testID: string;
}>) {
  const colors = useThemeColors(useHostColorScheme());
  const insetX = inset;
  const translateYOutput = useMemo(
    // Clear the viewport before hiding the outgoing card, including its scaled edge.
    () => [65, 35, 0, -height * scaleOutput[3] - spacing.xl],
    [height],
  );
  const positionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (scrollOffset.get() - index * width) * (rtl ? -1 : 1) }],
  }));
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollOffset.get() / width;
    if (reducedMotion) {
      return {
        opacity: index === Math.round(position) ? 1 : 0,
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }, { rotateX: '0deg' }],
      };
    }
    const distance = position - index;
    // Hidden cards must settle to a constant style rather than keep committing
    // transforms while the visible cards move.
    if (distance <= -3 || distance >= 1) return { opacity: 0 };
    return {
      // Only fade the farthest card into the stack. Overlapping cards stay
      // opaque so the outgoing photo conceals the next one until it moves away.
      opacity: interpolatePhotoMotion(distance, opacityInput, opacityOutput),
      transform: [
        { perspective: 600 },
        {
          translateY: interpolatePhotoMotion(distance, motionInput, translateYOutput),
        },
        { scale: interpolatePhotoMotion(distance, motionInput, scaleOutput) },
        { rotateX: `${interpolatePhotoMotion(distance, motionInput, rotationOutput)}deg` },
      ],
    };
  });
  return (
    // Keep the stacking planes flat. Tilting these siblings directly lets their
    // 3D surfaces intersect on iOS, drawing rear artwork over the front card.
    <Animated.View
      collapsable={false}
      style={[
        {
          position: 'absolute',
          top: spacing.xl,
          left: rtl ? undefined : insetX,
          right: rtl ? insetX : undefined,
          width,
          height,
        },
        positionStyle,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radii.card,
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
    </Animated.View>
  );
}
