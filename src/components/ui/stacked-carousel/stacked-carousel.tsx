import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Column, RNHostView, Row } from '@expo/ui';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillWidth, nativeFillWidthCenter } from '../native/native-fill-width';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';

import { radii, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

import type { PhotoItem } from '../photo-item';
import { interpolatePhotoMotion } from '../photo-motion';

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
export function StackedCarousel(props: StackedCarouselProps) {
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
}: StackedCarouselProps) {
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();
  const colors = useThemeColors(useHostColorScheme());
  const width = Math.max(1, availableWidth);
  const cardWidth = Math.max(
    1,
    Math.min(width, requestedItemWidth ?? Math.min(width - spacing.sm * 2, 320)),
  );
  const height = Math.max(
    spacing.xl * 3 + 1,
    requestedHeight ?? cardWidth * 0.625 + spacing.xl * 3,
  );
  const cardHeight = height - spacing.xl * 3;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const selectedIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollOffset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.set(event.contentOffset.x);
  });

  useEffect(() => {
    // Keep the selected photo when rotating or changing the app's direction.
    const x = selectedIndex.current * cardWidth;
    scrollRef.current?.scrollTo({ x, animated: false });
    scrollOffset.set(x);
  }, [cardWidth, rtl, scrollOffset]);

  function updateSelection(index: number) {
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    if (nextIndex === selectedIndex.current) return;
    selectedIndex.current = nextIndex;
    setActiveIndex(nextIndex);
    onIndexChange?.(nextIndex, items[nextIndex]);
  }

  function selectPhoto(index: number) {
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    updateSelection(nextIndex);
    scrollRef.current?.scrollTo({ x: nextIndex * cardWidth, animated: !reducedMotion });
  }
  const positionLabel = getPositionLabel?.(activeIndex, items.length);

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <RNHostView matchContents>
        <View
          style={{ width, height, overflow: 'hidden', direction: 'ltr' }}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{
            min: 1,
            max: items.length,
            now: activeIndex + 1,
            text: positionLabel ?? items[activeIndex].label,
          }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={({ nativeEvent }) => {
            if (nativeEvent.actionName === 'increment') selectPhoto(activeIndex + 1);
            if (nativeEvent.actionName === 'decrement') selectPhoto(activeIndex - 1);
          }}
          testID={`${testID}-cards`}
        >
          {/* Expo UI's ScrollView has no offset/snap API; this boundary only drives the artwork. */}
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            scrollEnabled={items.length > 1}
            accessible={false}
            onScroll={onScroll}
            onMomentumScrollEnd={({ nativeEvent }) => {
              const index = Math.max(
                0,
                Math.min(Math.round(nativeEvent.contentOffset.x / cardWidth), items.length - 1),
              );
              updateSelection(index);
            }}
            snapToInterval={cardWidth}
            decelerationRate="fast"
            directionalLockEnabled
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={[styles.scroll, rtl && styles.mirrored]}
            testID={`${testID}-scroll`}
          >
            <View style={{ width: cardWidth * (items.length - 1) + width, height }} />
          </Animated.ScrollView>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {items.map((item, index) => (
              <PhotoCard
                key={item.id}
                item={item}
                count={items.length}
                index={index}
                width={cardWidth}
                height={cardHeight}
                inset={(width - cardWidth) / 2}
                scrollOffset={scrollOffset}
                rtl={rtl}
                reducedMotion={reducedMotion}
                testID={`${testID}-photo-${item.id}`}
              />
            ))}
          </View>
        </View>
      </RNHostView>
      {showIndicators ? (
        <Column alignment="center" modifiers={nativeFillWidthCenter}>
          <Row spacing={spacing.sm}>
            {items.map((item, index) => (
              <Column
                key={item.id}
                testID={`${testID}-dot-${index}`}
                style={{
                  width: spacing.sm,
                  height: spacing.sm,
                  borderRadius: radii.pill,
                  backgroundColor: index === activeIndex ? colors.tint : colors.surfaceVariant,
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
  count,
  index,
  width,
  height,
  inset,
  scrollOffset,
  rtl,
  reducedMotion,
  testID,
}: {
  item: PhotoItem;
  count: number;
  index: number;
  width: number;
  height: number;
  inset: number;
  scrollOffset: SharedValue<number>;

  rtl: boolean;
  reducedMotion: boolean;
  testID: string;
}) {
  const colors = useThemeColors(useHostColorScheme());
  const insetX = inset;
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollOffset.get() / width;
    if (reducedMotion) {
      return {
        opacity: interpolate(
          position,
          [index - 1, index, index + 1],
          [0, 1, 0],
          Extrapolation.CLAMP,
        ),
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }, { rotateX: '0deg' }],
      };
    }
    const distance = position - index;
    // Hidden cards must settle to a constant style rather than keep committing
    // transforms while the visible cards move.
    if (distance <= -3 || distance >= 1) return { opacity: 0 };
    const range = [-2, -1, 0, 1];
    return {
      // Fade throughout the outgoing step; negative opacity targets made the
      // front card disappear halfway through a swipe.
      opacity: interpolatePhotoMotion(distance, [-3, -2, -1, 0, 1], [0, 0.2, 0.8, 1, 0]),
      transform: [
        { perspective: 600 },
        {
          translateY: interpolatePhotoMotion(distance, range, [65, 35, 0, -height * 0.2]),
        },
        { scale: interpolatePhotoMotion(distance, range, [0.86, 0.93, 1, 1.12]) },
        { rotateX: `${interpolatePhotoMotion(distance, range, [32, 16, 0, 0])}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: spacing.xl,
          left: rtl ? undefined : insetX,
          right: rtl ? insetX : undefined,
          width: width,
          height: height,
          zIndex: count - index,
          borderRadius: radii.card,
          borderWidth: 0,
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

const styles = StyleSheet.create({
  scroll: { flex: 1, direction: 'ltr' },
  mirrored: { transform: [{ scaleX: -1 }] },
});
