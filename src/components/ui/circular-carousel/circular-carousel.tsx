import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Column, RNHostView, Spacer } from '@expo/ui';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { UniversalTextContent } from '../text/universal-text';
import { ButtonContent } from '../button/button';
import { Icon, type IconName } from '../icon/icon';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalHost, useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import { radii, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';

import type { PhotoItem } from '../photo/photo-item';
import { interpolatePhotoMotion } from '../photo/photo-motion';
import { PhotoScrollView } from '../photo/photo-scroll-view';
import { usePhotoSelection } from '../photo/use-photo-selection';

const motionInput = [-2, -1, 0, 1, 2] as const;
const selectedScale = 1.2;
const scaleOutput = [0.5, 0.9, selectedScale, 0.9, 0.5] as const;
const opacityOutput = [0.5, 1, 1, 1, 0.5] as const;

export type CircularCarouselIconItem = { id: string; label: string; icon: IconName };
export type CircularCarouselItem = PhotoItem | CircularCarouselIconItem;

export type CircularCarouselProps<T extends CircularCarouselItem = PhotoItem> = {
  /** Unique, stable IDs; an empty list renders nothing. */
  items: readonly T[];
  /** Available viewport dimensions in native points/dp, supplied by the parent. */
  width: number;
  height?: number;
  itemSize?: number;
  accessibilityLabel: string;
  /** Format a zero-based index for both the visible caption and screen reader. */
  getPositionLabel?: (index: number, total: number) => string;
  /** Fires once when a user selects a different item, never on initial render. */
  onIndexChange?: (index: number, item: T) => void;
  /** Reports drag start and nearest-item changes while swiping, without committing selection. */
  onPreviewIndexChange?: (index: number, item: T) => void;
  /** Explicit activation is separate from swipe selection. */
  onItemPress?: (index: number, item: T) => void;
  onScrollBeginDrag?: () => void;
  /** Runs when a user scroll settles, including a return to the same item. */
  onSelectionSettled?: (index: number, item: T) => void;
  testID?: string;
};

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/circular-carousel
export function CircularCarousel<T extends CircularCarouselItem = PhotoItem>(
  props: Readonly<CircularCarouselProps<T>>,
) {
  if (props.items.length === 0 || !Number.isFinite(props.width) || props.width <= 0) return null;
  // A changed data order starts a fresh selection; resizing keeps the current item.
  return (
    <CircularCarouselContent key={JSON.stringify(props.items.map((item) => item.id))} {...props} />
  );
}

function CircularCarouselContent<T extends CircularCarouselItem>({
  items,
  width: availableWidth,
  height: requestedHeight,
  itemSize: requestedItemSize,

  accessibilityLabel,
  getPositionLabel,
  onIndexChange,
  onPreviewIndexChange,
  onItemPress,
  onScrollBeginDrag,
  onSelectionSettled,
  testID = 'circular-carousel',
}: Readonly<CircularCarouselProps<T>>) {
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();

  const width = Math.max(1, availableWidth);
  const cardWidth = Math.max(1, Math.min(width, requestedItemSize ?? width / 4));
  const height = Math.max(1, requestedHeight ?? cardWidth * 3);
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
    onItemPress,
    onSelectionFeedback: () => triggerHaptic('selection'),
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
            onIndexChange={(index) => {
              const next = Math.max(0, Math.min(index, items.length - 1));
              updateSelection(next);
              onSelectionSettled?.(next, items[next]);
            }}
            onPreviewIndexChange={
              onPreviewIndexChange
                ? (index) => onPreviewIndexChange(index, items[index])
                : undefined
            }
            interactive={Boolean(onItemPress)}
            onScrollBeginDrag={onScrollBeginDrag}
            renderItem={({ item, index }) => (
              <PhotoCard
                item={item}
                index={index}
                width={cardWidth}
                inset={(width - cardWidth) / 2}
                scrollOffset={scrollOffset}
                sceneWidth={width}
                sceneHeight={height}
                isSelected={index === activeIndex}
                rtl={rtl}
                reducedMotion={reducedMotion}
                onPress={onItemPress ? () => onItemPress(index, item) : undefined}
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
  inset,
  scrollOffset,
  sceneWidth,
  sceneHeight,
  isSelected,
  rtl,
  reducedMotion,
  testID,
  onPress,
}: Readonly<{
  item: CircularCarouselItem;
  index: number;
  width: number;
  inset: number;
  scrollOffset: SharedValue<number>;
  sceneWidth: number;
  sceneHeight: number;
  isSelected: boolean;
  rtl: boolean;
  reducedMotion: boolean;
  testID: string;
  onPress?: () => void;
}>) {
  const colors = useThemeColors(useHostColorScheme());
  // Even at the selected scale, interactive circles fit their cell's touch frame.
  const baseDiameter = Math.max(1, width - spacing.lg);
  const diameter = onPress ? Math.min(baseDiameter, width / selectedScale) : baseDiameter;
  const padding = (width - diameter) / 2;
  const insetX = (onPress ? 0 : inset) + padding;
  const viewportInset = inset + padding;
  const left = rtl ? sceneWidth - viewportInset - diameter : viewportInset;
  const radius = (diameter * selectedScale) / 2;
  const settledScale = isSelected ? selectedScale : 1;
  const translateYOutput = useMemo(() => [0, -width / 3, -width / 2, -width / 3, 0], [width]);
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollOffset.get() / width;
    const distance = position - index;
    const translateX = -distance * width * (rtl ? -1 : 1);
    // Include the largest possible scale so a card is never hidden while any
    // of its artwork can still enter the viewport.
    const centerX = left + diameter / 2 + translateX;
    if (centerX + radius <= 0 || centerX - radius >= sceneWidth) return { opacity: 0 };
    return {
      opacity: reducedMotion ? 1 : interpolatePhotoMotion(distance, motionInput, opacityOutput),
      transform: [
        {
          translateY: reducedMotion
            ? 0
            : interpolatePhotoMotion(distance, motionInput, translateYOutput),
        },
        {
          scale: reducedMotion
            ? settledScale
            : interpolatePhotoMotion(distance, motionInput, scaleOutput),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: (sceneHeight - diameter) / 2,
          left: rtl ? undefined : insetX,
          right: rtl ? insetX : undefined,
          width: diameter,
          height: diameter,
          borderRadius: radii.pill,
          borderWidth: onPress ? 0 : 2,
          borderColor: colors.background,
          overflow: 'hidden',
          backgroundColor: colors.surfaceVariant,
        },
        animatedStyle,
      ]}
    >
      {onPress ? (
        <UniversalHost
          matchContents={false}
          ignoreSafeArea="all"
          style={{ width: diameter, height: diameter }}
        >
          <ButtonContent
            variant="tertiary"
            accessibilityLabel={item.label}
            onPress={onPress}
            borderRadius={diameter / 2}
            contentPadding={0}
            color={colors.surfaceVariant}
            contentColor={colors.text}
            testID={`${testID}-action`}
          >
            <Column alignment="center" style={{ width: diameter, height: diameter }}>
              <Spacer flexible />
              {'icon' in item ? (
                <Icon name={item.icon} size={Math.min(28, diameter / 2)} />
              ) : (
                <RNHostView matchContents>
                  <View pointerEvents="none" style={{ width: diameter, height: diameter }}>
                    <Image
                      source={item.source}
                      contentFit="cover"
                      accessible={false}
                      style={StyleSheet.absoluteFill}
                      testID={testID}
                    />
                  </View>
                </RNHostView>
              )}
              <Spacer flexible />
            </Column>
          </ButtonContent>
        </UniversalHost>
      ) : 'source' in item ? (
        <Image
          source={item.source}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessible={false}
          style={StyleSheet.absoluteFill}
          testID={testID}
        />
      ) : (
        <UniversalHost matchContents={false} style={{ width: diameter, height: diameter }}>
          <Column alignment="center" style={{ width: diameter, height: diameter }}>
            <Spacer flexible />
            <Icon name={item.icon} size={Math.min(28, diameter / 2)} />
            <Spacer flexible />
          </Column>
        </UniversalHost>
      )}
    </Animated.View>
  );
}
