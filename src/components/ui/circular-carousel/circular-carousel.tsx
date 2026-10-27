import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Column, RNHostView } from '@expo/ui';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillWidth } from '../native/native-fill-width';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import { Switch } from '../switch/switch';
import { radii, screenContentMaxWidth, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

const photos = [1018, 1015, 1016, 1025, 1039, 1043];

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/circular-carousel
export function CircularCarousel() {
  const { t } = useTranslation();
  const testID = 'home-circular-carousel';
  const title = t('starter.circularCarouselTitle');
  const [scaleEnabled, setScaleEnabled] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const reducedMotion = useAppReducedMotion();
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );

  const cardWidth = width / 4;
  const cardHeight = cardWidth;
  const height = cardWidth * 3;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const selectedIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollOffset = useSharedValue(0);

  const scaleProgress = useDerivedValue<number>(() => {
    if (reducedMotion) return 0;
    return withSpring(scaleEnabled ? 1 : 0, { duration: 400, dampingRatio: 1 });
  });
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
      <Switch
        label={t('starter.circularCarouselScale')}
        value={scaleEnabled}
        onValueChange={setScaleEnabled}
        disabled={reducedMotion}
        testID={`${testID}-scale`}
      />
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
                scaleProgress={scaleProgress}
                rtl={rtl}
                reducedMotion={reducedMotion}
                testID={`${testID}-photo-${id}`}
              />
            ))}
          </View>
        </View>
      </RNHostView>

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
  scaleProgress,
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
  scaleProgress: SharedValue<number>;
  rtl: boolean;
  reducedMotion: boolean;
  testID: string;
}) {
  const colors = useThemeColors(useHostColorScheme());
  const insetX = inset + spacing.sm;
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollOffset.get() / width;
    const distance = position - index;
    const range = [-2, -1, 0, 1, 2];
    const scale = interpolate(distance, range, [0.5, 0.9, 1.2, 0.9, 0.5], Extrapolation.CLAMP);
    return {
      opacity: reducedMotion
        ? 1
        : interpolate(distance, range, [0.5, 1, 1, 1, 0.5], Extrapolation.CLAMP),
      transform: [
        { translateX: (index - position) * width * (rtl ? -1 : 1) },
        {
          translateY: reducedMotion
            ? 0
            : interpolate(
                distance,
                range,
                [0, -width / 3, -width / 2, -width / 3, 0],
                Extrapolation.CLAMP,
              ),
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
          top: width + spacing.sm,
          left: rtl ? undefined : insetX,
          right: rtl ? insetX : undefined,
          width: Math.max(1, width - spacing.lg),
          height: Math.max(1, height - spacing.lg),
          zIndex: photos.length - index,
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
        source={{ uri: `https://picsum.photos/id/${id}/400/400` }}
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
