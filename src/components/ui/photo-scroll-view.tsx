import { useEffect, useRef, type RefObject } from 'react';
import {
  I18nManager,
  View,
  type FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type ScrollViewProps,
} from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import type { PhotoItem } from './photo-item';

type PhotoScrollViewProps = {
  ref: RefObject<FlatList<PhotoItem> | null>;
  items: readonly PhotoItem[];
  width: number;
  height: number;
  itemWidth: number;
  rtl: boolean;
  selectedIndex: RefObject<number>;
  scrollOffset: SharedValue<number>;
  renderItem: ListRenderItem<PhotoItem>;
  onScroll: ScrollViewProps['onScroll'];
  onMomentumScrollEnd: ScrollViewProps['onMomentumScrollEnd'];
  testID: string;
};

const mirrored = { transform: [{ scaleX: -1 }] };
const photoKey = (item: PhotoItem) => item.id;
const photoCellStyle = ({ index }: { index: number }) => ({ zIndex: -index });
const nativeRtl = I18nManager.isRTL;

/** FlatList metrics follow native direction; artwork uses an index increasing from zero. */
export function photoScrollOffset(event: NativeScrollEvent) {
  'worklet';
  return Math.max(
    0,
    nativeRtl
      ? event.contentSize.width - event.layoutMeasurement.width - event.contentOffset.x
      : event.contentOffset.x,
  );
}

/** Virtualized artwork only; native controls and selection remain with each carousel. */
export function PhotoScrollView({
  ref,
  items,
  width,
  height,
  itemWidth,
  rtl,
  selectedIndex,
  scrollOffset,
  renderItem,
  onScroll,
  onMomentumScrollEnd,
  testID,
}: Readonly<PhotoScrollViewProps>) {
  const contentGeometry = useRef({ width: 0, itemWidth: 0 });
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
          pointerEvents="none"
          style={[{ width: itemWidth, height }, rtl !== nativeRtl && mirrored]}
        >
          {renderItem(info)}
        </View>
      )}
      CellRendererComponentStyle={photoCellStyle}
      getItemLayout={(_, index) => ({ length: itemWidth, offset: index * itemWidth, index })}
      ListFooterComponent={<View style={{ width: width - itemWidth, height }} />}
      initialNumToRender={Math.ceil(width / itemWidth) + 3}
      windowSize={5}
      // Transformed cards extend beyond their logical cells. Virtualization, rather
      // than native clipping, releases distant cells without cutting off the stack.
      removeClippedSubviews={false}
      scrollEnabled={items.length > 1}
      accessible={false}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
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
