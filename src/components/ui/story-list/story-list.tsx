import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Column, RNHostView } from '@expo/ui';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillWidth } from '../native/native-fill-width';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';

import { radii, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

import type { PhotoItem } from '../photo-item';
import { interpolatePhotoMotion } from '../photo-motion';
import { PhotoScrollView } from '../photo-scroll-view';

const opacityInput = [-3, -2, 0, 1] as const;
const opacityOutput = [0, 1, 1, 1] as const;
const scaleOutput = [0.88, 0.94, 1, 1] as const;
const reducedOpacityOutput = [0, 1, 0] as const;

export type StoryListProps = {
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

  testID?: string;
};

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/story-list
export function StoryList(props: Readonly<StoryListProps>) {
  if (props.items.length === 0 || !Number.isFinite(props.width) || props.width <= 0) return null;
  // A changed data order starts a fresh selection; resizing keeps the current item.
  return <StoryListContent key={JSON.stringify(props.items.map((item) => item.id))} {...props} />;
}

function StoryListContent({
  items,
  width: availableWidth,
  height: requestedHeight,
  itemWidth: requestedItemWidth,

  accessibilityLabel,
  getPositionLabel,
  onIndexChange,
  testID = 'story-list',
}: Readonly<StoryListProps>) {
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();

  const width = Math.max(1, availableWidth);
  const cardWidth = Math.max(1, Math.min(width, requestedItemWidth ?? width * 0.78));
  const height = Math.max(1, requestedHeight ?? Math.min(width * 1.05, 420));
  const cardHeight = height;
  const scrollRef = useRef<FlatList<PhotoItem>>(null);
  const selectedIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollOffset = useSharedValue(0);

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
    scrollRef.current?.scrollToOffset({ offset: nextIndex * cardWidth, animated: !reducedMotion });
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
                inset={(width - cardWidth) / 4}
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
  // Stable captures avoid both per-frame arrays and mapper restarts after selection changes.
  const { range, reducedRange, translateXOutput } = useMemo(
    () => ({
      range: [index - 2, index - 1, index, index + 1],
      reducedRange: [index - 1, index, index + 1],
      translateXOutput: [inset * 4, inset * 2, 0, -width - inset * 2],
    }),
    [index, inset, width],
  );
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollOffset.get() / width;
    const distance = position - index;
    if (reducedMotion) {
      return {
        opacity: interpolate(position, reducedRange, reducedOpacityOutput, Extrapolation.CLAMP),
        transform: [
          { translateX: distance * width * (rtl ? -1 : 1) },
          { translateY: 0 },
          { scale: 1 },
          { rotateX: '0deg' },
        ],
      };
    }
    // Cards outside the visible stack keep a constant style instead of receiving
    // new native transforms on every scroll frame.
    if (distance <= -3 || distance >= 1) return { opacity: 0 };
    return {
      opacity: interpolatePhotoMotion(distance, opacityInput, opacityOutput),
      transform: [
        {
          translateX:
            (distance * width + interpolatePhotoMotion(position, range, translateXOutput)) *
            (rtl ? -1 : 1),
        },
        { scale: interpolatePhotoMotion(position, range, scaleOutput) },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: rtl ? undefined : insetX,
          right: rtl ? insetX : undefined,
          width: width,
          height: height,
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
