import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, type ViewInstance } from 'react-native';
import { Image } from 'expo-image';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Column, RNHostView, Row } from '@expo/ui';
import { UniversalButtonContent, UniversalButton } from '../button/universal-button';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalHost, useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import type { PhotoItem } from '../photo-item';
import { radii, spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

export type IosHomeGridProps = {
  items: readonly PhotoItem[];
  /** Available content width in points/dp; the caller owns page padding and safe areas. */
  width: number;
  closeLabel: string;
  /** Maximum columns; narrow containers reduce the count to keep native targets usable. */
  columns?: number;
  gap?: number;
  borderRadius?: number;
  dismissHint?: string;
  onSelect?: (item: PhotoItem, index: number) => void;
  /** Runs once when Close, drag dismissal or an accessibility dismissal is accepted. */
  onClose?: (item: PhotoItem, index: number) => void;
  testID?: string;
};

const spring = { duration: 400, dampingRatio: 1 };
type Rect = { x: number; y: number; width: number; height: number };
type LoadedImageSize = { source: PhotoItem['source']; width: number; height: number };
type Selection = {
  index: number;
  source: Rect;
  width: number;
  height: number;
  imageSize?: LoadedImageSize;
};
type GridProps = IosHomeGridProps & {
  columns: number;
  gap: number;
  borderRadius: number;
  testID: string;
};

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/ios-home-grid
export function IosHomeGrid({
  columns = 4,
  gap = spacing.sm,
  borderRadius = radii.card,
  testID = 'ios-home-grid',
  ...props
}: Readonly<IosHomeGridProps>) {
  const { fontScale } = useWindowDimensions();
  const direction = useHostLayoutDirection();
  const { width, items } = props;
  if (!Number.isFinite(width) || width <= 0 || items.length === 0) return null;

  const requestedGap = Number.isFinite(gap) ? Math.max(0, gap) : spacing.sm;
  const requestedColumns = Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : 4;
  const fittedColumns = Math.max(1, Math.floor((width + requestedGap) / (48 + requestedGap)));
  const columnCount = Math.min(requestedColumns, fittedColumns);
  const safeGap = columnCount > 1 ? requestedGap : 0;
  const safeRadius = Number.isFinite(borderRadius) ? Math.max(0, borderRadius) : radii.card;
  // Labels can change row height; discard measured geometry when data or layout changes.
  const layoutKey = JSON.stringify([
    width,
    fontScale,
    direction,
    columnCount,
    safeGap,
    safeRadius,
    items.map((item) => [item.id, item.label]),
  ]);

  return (
    <PhotoGrid
      key={layoutKey}
      {...props}
      columns={columnCount}
      gap={safeGap}
      borderRadius={safeRadius}
      testID={testID}
    />
  );
}

function PhotoGrid({
  items,
  width,
  columns,
  gap,
  borderRadius,
  closeLabel,
  dismissHint,
  onSelect,
  onClose,
  testID,
}: Readonly<GridProps>) {
  const scene = useRef<ViewInstance>(null);
  const mounted = useRef(false);
  const busy = useRef(false);
  const closeRequested = useRef(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [closing, setClosing] = useState(false);
  const progress = useSharedValue(0);
  const motionEnabled = useMotionEnabled();
  const tileSize = Math.max(1, (width - gap * (columns - 1)) / columns);
  const rows: (readonly PhotoItem[])[] = [];
  for (let index = 0; index < items.length; index += columns)
    rows.push(items.slice(index, index + columns));
  const selectedItem = selection ? items[selection.index] : undefined;
  const gridStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.get() * 0.5,
    transform: [{ scale: motionEnabled ? 1 - progress.get() * 0.05 : 1 }],
  }));

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancelAnimation(progress);
    };
  }, [progress]);

  const close = useCallback(() => {
    if (!selection || !selectedItem || closeRequested.current) return;
    closeRequested.current = true;
    setClosing(true);
    onClose?.(selectedItem, selection.index);
  }, [onClose, selectedItem, selection]);
  const finish = useCallback(() => {
    if (!mounted.current) return;
    busy.current = false;
    closeRequested.current = false;
    setSelection(null);
  }, []);

  function open(index: number, rect: Rect, imageSize?: LoadedImageSize) {
    if (!mounted.current || busy.current || !scene.current) return;
    busy.current = true;
    scene.current.measureInWindow((x, y, sceneWidth, height) => {
      if (!mounted.current || !scene.current || sceneWidth <= 0 || height <= 0 || rect.width <= 0) {
        busy.current = false;
        return;
      }
      progress.set(0);
      setClosing(false);
      setSelection({
        index,
        source: { ...rect, x: rect.x - x, y: rect.y - y },
        width: sceneWidth,
        height,
        imageSize,
      });
      onSelect?.(items[index], index);
    });
  }

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <RNHostView matchContents>
        {/* This RN boundary owns the expanding artwork above the native grid. */}
        <GestureHandlerRootView style={{ width }}>
          <View ref={scene} collapsable={false} style={{ width }}>
            <Animated.View
              style={gridStyle}
              pointerEvents={selection ? 'none' : 'auto'}
              accessibilityElementsHidden={selection !== null}
              importantForAccessibility={selection ? 'no-hide-descendants' : 'auto'}
            >
              <UniversalHost>
                <Column spacing={gap} modifiers={nativeFillWidth}>
                  {rows.map((row, rowIndex) => (
                    <Row key={rowIndex} spacing={gap} modifiers={nativeFillWidth}>
                      {Array.from({ length: columns }, (_, columnIndex) => {
                        const item = row[columnIndex];
                        return (
                          <Column
                            key={item?.id ?? `empty-${columnIndex}`}
                            modifiers={nativeRowWeight}
                          >
                            {item ? (
                              <PhotoTile
                                item={item}
                                index={rowIndex * columns + columnIndex}
                                size={tileSize}
                                borderRadius={borderRadius}
                                disabled={selection !== null}
                                onOpen={open}
                                testID={`${testID}-photo-${item.id}`}
                              />
                            ) : null}
                          </Column>
                        );
                      })}
                    </Row>
                  ))}
                </Column>
              </UniversalHost>
            </Animated.View>
            {selection && selectedItem ? (
              <ExpandedPhoto
                item={selectedItem}
                selection={selection}
                progress={progress}
                closing={closing}
                borderRadius={borderRadius}
                closeLabel={closeLabel}
                dismissHint={dismissHint}
                onClose={close}
                onClosed={finish}
                testID={`${testID}-expanded`}
              />
            ) : null}
          </View>
        </GestureHandlerRootView>
      </RNHostView>
      <UniversalButtonContent
        variant="secondary"
        label={closeLabel}
        onPress={close}
        disabled={!selection || closing}
        testID={`${testID}-close`}
      />
    </Column>
  );
}

function PhotoTile({
  item,
  index,
  size,
  borderRadius,
  disabled,
  onOpen,
  testID,
}: Readonly<{
  item: PhotoItem;
  index: number;
  size: number;
  borderRadius: number;
  disabled: boolean;
  onOpen: (index: number, rect: Rect, imageSize?: LoadedImageSize) => void;
  testID: string;
}>) {
  const image = useRef<ViewInstance>(null);
  const imageSize = useRef<LoadedImageSize | undefined>(undefined);
  const colors = useThemeColors(useHostColorScheme());

  return (
    <RNHostView matchContents>
      <View style={{ width: size }}>
        <UniversalButton
          variant="tertiary"
          contentPadding={0}
          fullWidth
          borderRadius={borderRadius}
          disabled={disabled}
          testID={testID}
          onPress={() =>
            image.current?.measureInWindow((x, y, width, height) =>
              onOpen(index, { x, y, width, height }, imageSize.current),
            )
          }
        >
          <Column spacing={spacing.xs} alignment="center">
            <Column style={{ width: size, height: size }} />
            <UniversalTextContent variant="caption">{item.label}</UniversalTextContent>
          </Column>
        </UniversalButton>
        {/* A sibling overlay keeps the native button's entire photo area tappable. */}
        <View
          ref={image}
          collapsable={false}
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}
        >
          <Image
            source={item.source}
            contentFit="cover"
            cachePolicy="memory-disk"
            onLoad={({ source }) => {
              if (source.width > 0 && source.height > 0) {
                imageSize.current = {
                  source: item.source,
                  width: source.width,
                  height: source.height,
                };
              }
            }}
            accessible={false}
            style={{
              width: size,
              height: size,
              borderRadius,
              backgroundColor: colors.surfaceVariant,
            }}
          />
        </View>
      </View>
    </RNHostView>
  );
}

function ExpandedPhoto({
  item,
  selection,
  progress,
  closing,
  borderRadius,
  closeLabel,
  dismissHint,
  onClose,
  onClosed,
  testID,
}: Readonly<{
  item: PhotoItem;
  selection: Selection;
  progress: SharedValue<number>;
  closing: boolean;
  borderRadius: number;
  closeLabel: string;
  dismissHint?: string;
  onClose: () => void;
  onClosed: () => void;
  testID: string;
}>) {
  const motionEnabled = useMotionEnabled();
  const colors = useThemeColors(useHostColorScheme());
  const drag = useSharedValue(0);
  const { source, width, height } = selection;
  const [imageSize, setImageSize] = useState(selection.imageSize);
  const [displayedSourceKey, setDisplayedSourceKey] = useState<string>();
  // Equivalent source objects can be recreated by the caller without reloading
  // the native image. Keep their measured aspect ratio across those renders.
  const sourceKey = JSON.stringify(item.source);
  const imageReady = displayedSourceKey === sourceKey;
  const intrinsicSize =
    imageSize && JSON.stringify(imageSize.source) === sourceKey ? imageSize : { width, height };
  const coverScale = Math.max(width / intrinsicSize.width, height / intrinsicSize.height);
  const imageWidth = intrinsicSize.width * coverScale;
  const imageHeight = intrinsicSize.height * coverScale;

  useEffect(() => {
    // Keep the existing thumbnail visible until the new native image has pixels.
    if (!imageReady && !closing) return;
    const complete = (finished: boolean | undefined) => {
      'worklet';
      if (finished && closing) scheduleOnRN(onClosed);
    };
    progress.set(
      motionEnabled && imageReady
        ? withSpring(closing ? 0 : 1, spring, complete)
        : withTiming(closing ? 0 : 1, { duration: 0 }, complete),
    );
    if (closing) drag.set(motionEnabled ? withSpring(0, spring) : 0);
    return () => {
      cancelAnimation(progress);
      cancelAnimation(drag);
    };
  }, [closing, drag, imageReady, motionEnabled, onClosed, progress]);

  const pan = usePanGesture({
    enabled: imageReady && !closing,
    activeOffsetY: 8,
    failOffsetX: [-20, 20],
    onUpdate: (event) => {
      drag.set(Math.max(0, event.translationY));
    },
    onDeactivate: (event) => {
      if (!event.canceled && (event.translationY > height * 0.25 || event.velocityY > 800)) {
        scheduleOnRN(onClose);
      } else {
        drag.set(
          motionEnabled
            ? withSpring(0, {
                ...spring,
                dampingRatio: 0.8,
                velocity: event.velocityY,
                overshootClamping: true,
              })
            : 0,
        );
      }
    },
  });
  const imageStyle = useAnimatedStyle(() => {
    const p = motionEnabled ? progress.get() : 1;
    return {
      opacity: imageReady ? 1 : 0,
      width: interpolate(p, [0, 1], [source.width, width]),
      height: interpolate(p, [0, 1], [source.height, height]),
      borderRadius,
      transform: [
        { translateX: source.x * (1 - p) },
        {
          translateY: source.y * (1 - p) + (motionEnabled ? Math.min(drag.get(), height) * 0.3 : 0),
        },
        { scale: motionEnabled ? 1 - Math.min(drag.get() / height, 1) * 0.15 : 1 },
      ],
    };
  });

  const bitmapStyle = useAnimatedStyle(() => {
    const p = motionEnabled ? progress.get() : 1;
    const currentWidth = interpolate(p, [0, 1], [source.width, width]);
    const currentHeight = interpolate(p, [0, 1], [source.height, height]);
    return {
      transform: [
        { translateX: (currentWidth - width) / 2 },
        { translateY: (currentHeight - height) / 2 },
        { scale: Math.max(currentWidth / imageWidth, currentHeight / imageHeight) },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={StyleSheet.absoluteFill}
        accessible
        accessibilityRole="image"
        accessibilityLabel={item.label}
        accessibilityHint={dismissHint}
        accessibilityActions={[{ name: 'dismiss', label: closeLabel }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === 'dismiss') onClose();
        }}
        onAccessibilityEscape={onClose}
        testID={testID}
      >
        <Animated.View
          style={[styles.expanded, { backgroundColor: colors.surfaceVariant }, imageStyle]}
        >
          {/* Only the clipping frame changes size. The bitmap keeps fixed native
              dimensions and scales uniformly, preserving cover cropping. */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: (width - imageWidth) / 2,
                top: (height - imageHeight) / 2,
                width: imageWidth,
                height: imageHeight,
              },
              bitmapStyle,
            ]}
          >
            <Image
              key={sourceKey}
              source={item.source}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={0}
              onDisplay={() => setDisplayedSourceKey(sourceKey)}
              onError={() => {
                progress.set(0);
                onClosed();
              }}
              onLoad={({ source: loadedSource }) => {
                if (loadedSource.width <= 0 || loadedSource.height <= 0) return;
                setImageSize((current) =>
                  current &&
                  JSON.stringify(current.source) === sourceKey &&
                  current.width === loadedSource.width &&
                  current.height === loadedSource.height
                    ? current
                    : {
                        source: item.source,
                        width: loadedSource.width,
                        height: loadedSource.height,
                      },
                );
              }}
              style={StyleSheet.absoluteFill}
              accessible={false}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  expanded: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
});
