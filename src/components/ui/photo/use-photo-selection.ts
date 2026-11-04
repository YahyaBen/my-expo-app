import { useRef, useState } from 'react';
import type { FlatList, ViewProps } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { PhotoItem } from './photo-item';

type PhotoSelectionOptions<T extends { id: string; label: string }> = {
  items: readonly T[];
  itemWidth: number;
  reducedMotion: boolean;
  accessibilityLabel: string;
  getPositionLabel?: (index: number, total: number) => string;
  onIndexChange?: (index: number, item: T) => void;
  onItemPress?: (index: number, item: T) => void;
  onSelectionFeedback?: () => void;
};

/** Each carousel's ordered-ID key owns resets; resizing never emits selection events. */
export function usePhotoSelection<T extends { id: string; label: string } = PhotoItem>({
  items,
  itemWidth,
  reducedMotion,
  accessibilityLabel,
  getPositionLabel,
  onIndexChange,
  onItemPress,
  onSelectionFeedback,
}: Readonly<PhotoSelectionOptions<T>>) {
  const scrollRef = useRef<FlatList<T>>(null);
  const selectedIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollOffset = useSharedValue(0);

  function updateSelection(index: number) {
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    if (nextIndex === selectedIndex.current) return;
    selectedIndex.current = nextIndex;
    setActiveIndex(nextIndex);
    onSelectionFeedback?.();
    onIndexChange?.(nextIndex, items[nextIndex]);
  }

  function selectPhoto(index: number) {
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    updateSelection(nextIndex);
    scrollRef.current?.scrollToOffset({ offset: nextIndex * itemWidth, animated: !reducedMotion });
  }

  const positionLabel = getPositionLabel?.(activeIndex, items.length);
  const accessibilityProps = {
    accessible: true,
    accessibilityRole: 'adjustable',
    accessibilityLabel,
    accessibilityValue: {
      min: 1,
      max: items.length,
      now: activeIndex + 1,
      text: positionLabel ?? items[activeIndex].label,
    },
    accessibilityActions: [
      { name: 'increment' },
      { name: 'decrement' },
      ...(onItemPress ? [{ name: 'activate' as const }] : []),
    ],
    onAccessibilityTap: onItemPress
      ? () => onItemPress(activeIndex, items[activeIndex])
      : undefined,
    onAccessibilityAction: ({ nativeEvent }) => {
      if (nativeEvent.actionName === 'increment') selectPhoto(activeIndex + 1);
      if (nativeEvent.actionName === 'decrement') selectPhoto(activeIndex - 1);
      if (nativeEvent.actionName === 'activate') onItemPress?.(activeIndex, items[activeIndex]);
    },
  } satisfies ViewProps;

  return {
    scrollRef,
    selectedIndex,
    activeIndex,
    scrollOffset,
    updateSelection,
    positionLabel,
    accessibilityProps,
  };
}
