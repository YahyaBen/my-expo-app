import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

import { radii, screenContentMaxWidth, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

const photos = [1018, 1015, 1016, 1025, 1039, 1043];

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/stacked-carousel
export function StackedCarousel() {
  const { t } = useTranslation();
  const testID = 'home-stacked-carousel';
  const title = t('starter.stackedCarouselTitle');

  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();
  const colors = useThemeColors(useHostColorScheme());
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );

  const cardWidth = Math.max(1, Math.min(width - spacing.sm * 2, 320));
  const cardHeight = cardWidth * 0.625;
  const height = cardHeight + spacing.xl * 3;
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

  function selectPhoto(index: number) {
    const nextIndex = Math.max(0, Math.min(index, photos.length - 1));
    selectedIndex.current = nextIndex;
    setActiveIndex(nextIndex);
    scrollRef.current?.scrollTo({ x: nextIndex * cardWidth, animated: !reducedMotion });
  }

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <UniversalTextContent variant="subtitle">{title}</UniversalTextContent>
      <UniversalTextContent tone="muted">{t('starter.storyListHint')}</UniversalTextContent>

      <RNHostView matchContents>
        <View
          style={{ width, height, overflow: 'hidden', direction: 'ltr' }}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={title}
          accessibilityValue={{
            min: 1,
            max: photos.length,
            now: activeIndex + 1,
            text: t('starter.storyListPosition', { number: activeIndex + 1, total: photos.length }),
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
            accessible={false}
            onScroll={onScroll}
            onMomentumScrollEnd={({ nativeEvent }) => {
              const index = Math.max(
                0,
                Math.min(Math.round(nativeEvent.contentOffset.x / cardWidth), photos.length - 1),
              );
              selectedIndex.current = index;
              setActiveIndex(index);
            }}
            snapToInterval={cardWidth}
            decelerationRate="fast"
            disableIntervalMomentum
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={[styles.scroll, rtl && styles.mirrored]}
            testID={`${testID}-scroll`}
          >
            <View style={{ width: cardWidth * (photos.length - 1) + width, height }} />
          </Animated.ScrollView>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {photos.map((id, index) => (
              <PhotoCard
                key={id}
                id={id}
                index={index}
                width={cardWidth}
                height={cardHeight}
                inset={(width - cardWidth) / 2}
                scrollOffset={scrollOffset}
                rtl={rtl}
                reducedMotion={reducedMotion}
                testID={`${testID}-photo-${id}`}
              />
            ))}
          </View>
        </View>
      </RNHostView>
      <Column alignment="center" modifiers={nativeFillWidthCenter}>
        <Row spacing={spacing.sm}>
          {photos.map((id, index) => (
            <Column
              key={id}
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
      <UniversalTextContent variant="caption" tone="muted" testID={`${testID}-position`}>
        {t('starter.storyListPosition', { number: activeIndex + 1, total: photos.length })}
      </UniversalTextContent>
    </Column>
  );
}

function PhotoCard({
  id,
  index,
  width,
  height,
  inset,
  scrollOffset,
  rtl,
  reducedMotion,
  testID,
}: {
  id: number;
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
    const range = [-2, -1, 0, 1, 2];
    return {
      opacity: Math.max(
        0,
        Math.min(
          1,
          interpolate(distance, [-3, ...range], [0, 0.2, 0.8, 1, -1, -2], Extrapolation.CLAMP),
        ),
      ),
      transform: [
        {
          translateY: interpolate(distance, range, [65, 35, 0, -100, -100], Extrapolation.CLAMP),
        },
        { scale: interpolate(distance, range, [0.7, 0.8, 1, 1.5, 1.5], Extrapolation.CLAMP) },
        { perspective: 600 },
        { rotateX: `${interpolate(distance, range, [45, 30, 0, 0, 0], Extrapolation.CLAMP)}deg` },
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
          zIndex: photos.length - index,
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
        source={{ uri: `https://picsum.photos/id/${id}/600/800` }}
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
