import { useEffect, useRef, type RefObject } from 'react';
import {
  I18nManager,
  View,
  type FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
} from 'react-native';
import Animated, { useAnimatedScrollHandler, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { PhotoItem } from './photo-item';

type PhotoScrollViewProps<T extends { id: string }> = {
  ref: RefObject<FlatList<T> | null>;
  items: readonly T[];
  width: number;
  height: number;
  itemWidth: number;
  rtl: boolean;
  selectedIndex: RefObject<number>;
  scrollOffset: SharedValue<number>;
  renderItem: ListRenderItem<T>;
  onIndexChange: (index: number) => void;
  onPreviewIndexChange?: (index: number) => void;
  interactive?: boolean;
  onScrollBeginDrag?: () => void;
  testID: string;
};

const mirrored = { transform: [{ scaleX: -1 }] };
const photoKey = (item: { id: string }) => item.id;
const photoCellStyle = ({ index }: { index: number }) => ({ zIndex: -index });
const nativeRtl = I18nManager.isRTL;

type ScrollPreviewContext = { previewActive?: boolean; previewIndex?: number };

/** FlatList metrics follow native direction; artwork uses an index increasing from zero. */
function photoScrollOffset(event: NativeScrollEvent) {
  'worklet';
  return Math.max(
    0,
    nativeRtl
      ? event.contentSize.width - event.layoutMeasurement.width - event.contentOffset.x
      : event.contentOffset.x,
  );
}

/** Virtualized artwork only; native controls and selection remain with each carousel. */
export function PhotoScrollView<T extends { id: string } = PhotoItem>({
  ref,
  items,
  width,
  height,
  itemWidth,
  rtl,
  selectedIndex,
  scrollOffset,
  renderItem,
  onIndexChange,
  onPreviewIndexChange,
  interactive = false,
  onScrollBeginDrag,
  testID,
}: Readonly<PhotoScrollViewProps<T>>) {
  const contentGeometry = useRef({ width: 0, itemWidth: 0 });
  const itemCount = items.length;
  const onScroll = useAnimatedScrollHandler<ScrollPreviewContext>({
    onScroll(event, context) {
      const offset = photoScrollOffset(event);
      scrollOffset.set(offset);
      if (!onPreviewIndexChange || !context.previewActive) return;
      const next = Math.max(0, Math.min(itemCount - 1, Math.round(offset / itemWidth)));
      if (next === context.previewIndex) return;
      context.previewIndex = next;
      // Cross to React only for a new centered item, never for every frame.
      scheduleOnRN(onPreviewIndexChange, next);
    },
    onBeginDrag(event, context) {
      if (onScrollBeginDrag) scheduleOnRN(onScrollBeginDrag);
      if (!onPreviewIndexChange) return;
      const next = Math.max(
        0,
        Math.min(itemCount - 1, Math.round(photoScrollOffset(event) / itemWidth)),
      );
      context.previewActive = true;
      context.previewIndex = next;
      // Show the current name as soon as dragging starts, including same-item drags.
      scheduleOnRN(onPreviewIndexChange, next);
    },
    onEndDrag(event, context) {
      if (event.velocity?.x === 0) context.previewActive = false;
    },
    onMomentumBegin(_event, context) {
      // A zero-velocity release can still snap to its nearest item.
      if (onPreviewIndexChange && context.previewIndex !== undefined) context.previewActive = true;
    },
    onMomentumEnd(_event, context) {
      context.previewActive = false;
    },
  });
  useEffect(() => {
    const offset = selectedIndex.current * itemWidth;
    // Native RTL metrics are unavailable until the first content layout.
    if (contentGeometry.current.width > 0) ref.current?.scrollToOffset({ offset, animated: false });
    scrollOffset.set(offset);
  }, [itemWidth, width, rtl, selectedIndex, scrollOffset, ref]);

  return (
    <Animated.FlatList
      ref={ref}
      data={items}
      horizontal
      keyExtractor={photoKey}
      renderItem={(info) => (
        <View
          pointerEvents={interactive ? 'box-none' : 'none'}
          style={[{ width: itemWidth, height }, rtl !== nativeRtl && mirrored]}
        >
          {renderItem(info)}
        </View>
      )}
      CellRendererComponentStyle={photoCellStyle}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: index * itemWidth + (interactive ? (width - itemWidth) / 2 : 0),
        index,
      })}
      contentContainerStyle={
        interactive ? { paddingHorizontal: (width - itemWidth) / 2 } : undefined
      }
      ListFooterComponent={
        interactive ? undefined : <View style={{ width: width - itemWidth, height }} />
      }
      initialNumToRender={Math.ceil(width / itemWidth) + 3}
      windowSize={5}
      // Transformed cards extend beyond their logical cells. Virtualization, rather
      // than native clipping, releases distant cells without cutting off the stack.
      removeClippedSubviews={false}
      scrollEnabled={items.length > 1}
      accessible={false}
      onScroll={onScroll}
      onMomentumScrollEnd={({ nativeEvent }) =>
        onIndexChange(Math.round(photoScrollOffset(nativeEvent) / itemWidth))
      }
      onContentSizeChange={() => {
        // Window changes can remeasure content without changing its geometry.
        if (
          contentGeometry.current.width === width &&
          contentGeometry.current.itemWidth === itemWidth
        )
          return;
        contentGeometry.current = { width, itemWidth };
        const offset = selectedIndex.current * itemWidth;
        ref.current?.scrollToOffset({ offset, animated: false });
        scrollOffset.set(offset);
      }}
      snapToInterval={itemWidth}
      decelerationRate="fast"
      directionalLockEnabled
      bounces={false}
      overScrollMode="never"
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      style={[
        { width, height, direction: nativeRtl ? 'rtl' : 'ltr' },
        rtl !== nativeRtl && mirrored,
      ]}
      testID={testID}
    />
  );
}
