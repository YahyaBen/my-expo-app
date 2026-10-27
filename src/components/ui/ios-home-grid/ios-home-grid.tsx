import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, type ViewInstance } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { radii, screenContentMaxWidth, spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

const photos = [1018, 1015, 1016, 1025, 1039, 1043, 1011, 1020, 1024, 1035, 1040, 1042];
const rows = [photos.slice(0, 4), photos.slice(4, 8), photos.slice(8, 12)];
const spring = { duration: 400, dampingRatio: 1 };
type Rect = { x: number; y: number; width: number; height: number };
type Selection = { id: number; number: number; source: Rect; width: number; height: number };
const photoUri = (id: number) => `https://picsum.photos/id/${id}/600/600`;

// Motion reference: https://github.com/enzomanuelmangano/demos/tree/main/src/animations/ios-home-grid
export function IosHomeGrid() {
  const { t } = useTranslation();
  const { width: windowWidth, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const direction = useHostLayoutDirection();
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-ios-home-grid">
      <UniversalTextContent variant="subtitle">{t('starter.homeGridTitle')}</UniversalTextContent>
      <UniversalTextContent tone="muted">{t('starter.homeGridHint')}</UniversalTextContent>
      <PhotoGrid key={`${width}-${fontScale}-${direction}`} width={width} />
    </Column>
  );
}

function PhotoGrid({ width }: { width: number }) {
  const { t } = useTranslation();
  const scene = useRef<ViewInstance>(null);
  const busy = useRef(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [closing, setClosing] = useState(false);
  const progress = useSharedValue(0);
  const motionEnabled = useMotionEnabled();
  const tileSize = Math.max(1, (width - spacing.sm * 3) / 4);
  const gridStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.get() * 0.5,
    transform: [{ scale: motionEnabled ? 1 - progress.get() * 0.05 : 1 }],
  }));
  const close = useCallback(() => setClosing(true), []);
  const finish = useCallback(() => {
    busy.current = false;
    setSelection(null);
  }, []);

  function open(id: number, number: number, rect: Rect) {
    if (busy.current || !scene.current) return;
    busy.current = true;
    scene.current.measureInWindow((x, y, sceneWidth, height) => {
      if (!scene.current || sceneWidth <= 0 || height <= 0 || rect.width <= 0) {
        busy.current = false;
        return;
      }
      progress.set(0);
      setClosing(false);
      setSelection({
        id,
        number,
        source: { ...rect, x: rect.x - x, y: rect.y - y },
        width: sceneWidth,
        height,
      });
    });
  }

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <RNHostView matchContents>
        {/* This RN boundary owns the expanding artwork overlay above the native grid. */}
        <GestureHandlerRootView style={{ width }}>
          <View ref={scene} collapsable={false} style={{ width }}>
            <Animated.View
              style={gridStyle}
              pointerEvents={selection ? 'none' : 'auto'}
              accessibilityElementsHidden={selection !== null}
              importantForAccessibility={selection ? 'no-hide-descendants' : 'auto'}
            >
              <UniversalHost>
                <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
                  {rows.map((row, rowIndex) => (
                    <Row key={rowIndex} spacing={spacing.sm} modifiers={nativeFillWidth}>
                      {row.map((id, columnIndex) => (
                        <Column key={id} modifiers={nativeRowWeight}>
                          <PhotoTile
                            id={id}
                            number={rowIndex * 4 + columnIndex + 1}
                            size={tileSize}
                            disabled={selection !== null}
                            onOpen={open}
                          />
                        </Column>
                      ))}
                    </Row>
                  ))}
                </Column>
              </UniversalHost>
            </Animated.View>
            {selection ? (
              <ExpandedPhoto
                selection={selection}
                progress={progress}
                closing={closing}
                onClose={close}
                onClosed={finish}
              />
            ) : null}
          </View>
        </GestureHandlerRootView>
      </RNHostView>
      <UniversalButtonContent
        variant="secondary"
        label={t('common.close')}
        onPress={close}
        disabled={!selection || closing}
        testID="home-ios-home-grid-close"
      />
    </Column>
  );
}

function PhotoTile({
  id,
  number,
  size,
  disabled,
  onOpen,
}: {
  id: number;
  number: number;
  size: number;
  disabled: boolean;
  onOpen: (id: number, number: number, rect: Rect) => void;
}) {
  const { t } = useTranslation();
  const image = useRef<ViewInstance>(null);
  const colors = useThemeColors(useHostColorScheme());

  return (
    <RNHostView matchContents>
      <View style={{ width: size }}>
        <UniversalButton
          variant="tertiary"
          contentPadding={0}
          fullWidth
          borderRadius={radii.card}
          disabled={disabled}
          testID={`home-ios-home-grid-photo-${id}`}
          onPress={() =>
            image.current?.measureInWindow((x, y, width, height) =>
              onOpen(id, number, { x, y, width, height }),
            )
          }
        >
          <Column spacing={spacing.xs} alignment="center">
            <Column style={{ width: size, height: size }} />
            <UniversalTextContent variant="caption">
              {t('starter.homeGridPhoto', { number })}
            </UniversalTextContent>
          </Column>
        </UniversalButton>
        {/* A sibling artwork overlay lets the native button receive image-area taps. */}
        <View
          ref={image}
          collapsable={false}
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}
        >
          <Image
            source={photoUri(id)}
            contentFit="cover"
            accessible={false}
            style={{
              width: size,
              height: size,
              borderRadius: radii.card,
              backgroundColor: colors.surfaceVariant,
            }}
          />
        </View>
      </View>
    </RNHostView>
  );
}

function ExpandedPhoto({
  selection,
  progress,
  closing,
  onClose,
  onClosed,
}: {
  selection: Selection;
  progress: SharedValue<number>;
  closing: boolean;
  onClose: () => void;
  onClosed: () => void;
}) {
  const { t } = useTranslation();
  const motionEnabled = useMotionEnabled();
  const colors = useThemeColors(useHostColorScheme());
  const drag = useSharedValue(0);
  const { source, width, height } = selection;

  useEffect(() => {
    const complete = (finished: boolean | undefined) => {
      'worklet';
      if (finished && closing) scheduleOnRN(onClosed);
    };
    progress.set(
      motionEnabled
        ? withSpring(closing ? 0 : 1, spring, complete)
        : withTiming(closing ? 0 : 1, { duration: 0 }, complete),
    );
    if (closing) drag.set(motionEnabled ? withSpring(0, spring) : 0);
    return () => {
      cancelAnimation(progress);
      cancelAnimation(drag);
    };
  }, [closing, drag, motionEnabled, onClosed, progress]);

  const pan = usePanGesture({
    enabled: !closing,
    activeOffsetY: 8,
    failOffsetX: [-20, 20],
    onUpdate: (event) => {
      drag.set(Math.max(0, event.translationY));
    },
    onDeactivate: (event) => {
      if (!event.canceled && (event.translationY > height * 0.25 || event.velocityY > 800)) {
        scheduleOnRN(onClose);
      } else {
        drag.set(motionEnabled ? withSpring(0, { ...spring, velocity: event.velocityY }) : 0);
      }
    },
  });
  const imageStyle = useAnimatedStyle(() => {
    const p = motionEnabled ? progress.get() : 1;
    return {
      width: interpolate(p, [0, 1], [source.width, width]),
      height: interpolate(p, [0, 1], [source.height, height]),
      borderRadius: radii.card,
      transform: [
        { translateX: source.x * (1 - p) },
        {
          translateY: source.y * (1 - p) + (motionEnabled ? Math.min(drag.get(), height) * 0.3 : 0),
        },
        { scale: motionEnabled ? 1 - Math.min(drag.get() / height, 1) * 0.15 : 1 },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={StyleSheet.absoluteFill}
        accessible
        accessibilityRole="image"
        accessibilityLabel={t('starter.homeGridPhoto', { number: selection.number })}
        accessibilityHint={t('starter.homeGridDismiss')}
        accessibilityActions={[{ name: 'dismiss', label: t('common.close') }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === 'dismiss') onClose();
        }}
        onAccessibilityEscape={onClose}
        testID="home-ios-home-grid-expanded"
      >
        <Animated.View
          style={[styles.expanded, { backgroundColor: colors.surfaceVariant }, imageStyle]}
        >
          <Image
            source={photoUri(selection.id)}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
            accessible={false}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  expanded: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
});
