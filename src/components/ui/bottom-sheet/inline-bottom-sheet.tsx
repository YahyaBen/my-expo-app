import { Column, ScrollView } from '@expo/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { screenContentMaxWidth } from '@/constants/layout';
import { navigationTheme } from '@/constants/navigation-theme';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import type { InlineBottomSheetProps } from './bottom-sheet.types';

const handleHeight = 40;

/** An in-screen surface: no modal window, portal, backdrop or navigation owner. */
export function InlineBottomSheet({
  children,
  isPresented,
  onDismiss,
  height,
  collapsedHeight,
  expanded,
  onExpandedChange,
  expandAccessibilityLabel,
  collapseAccessibilityLabel,
  bottomClearance = 0,
  dismissOnCollapse = false,
  collapsedContent,
  testID,
}: Readonly<InlineBottomSheetProps>) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const defaults = navigationTheme(scheme, colors).colors;
  const [rendered, setRendered] = useState(isPresented);
  if (isPresented && !rendered) setRendered(true);
  const presented = useRef(isPresented);
  const motionEnabled = useMotionEnabled(rendered);
  const sheetHeight = Math.max(1, Number.isFinite(height) ? height : 1);
  const clearance = Math.max(0, bottomClearance);
  const peekHeight = Math.min(
    sheetHeight,
    Math.max(Number.isFinite(collapsedHeight) ? collapsedHeight : 0, handleHeight + clearance + 64),
  );
  const travel = sheetHeight - peekHeight;
  const dragDistance = dismissOnCollapse ? sheetHeight : travel;
  const collapseThreshold = dismissOnCollapse ? Math.min(sheetHeight * 0.25, 120) : travel / 2;
  const translateY = useSharedValue(sheetHeight);
  const targetY = useSharedValue(Number.NaN);
  const startY = useSharedValue(0);
  const startExpanded = useSharedValue(expanded);
  const dragging = useSharedValue(false);
  // Keep the native scroll viewport stable throughout a drag; the screen clips the peek.
  const bodyHeight = Math.max(1, sheetHeight - handleHeight - clearance);
  const hideWhenClosed = useCallback(() => {
    if (!presented.current) setRendered(false);
  }, []);

  useEffect(() => {
    presented.current = isPresented;
  }, [isPresented]);

  useEffect(() => {
    if (!rendered) return;
    const target = isPresented ? (expanded ? 0 : travel) : sheetHeight;
    if (!motionEnabled) {
      cancelAnimation(translateY);
      targetY.set(target);
      translateY.set(target);
      if (!isPresented) hideWhenClosed();
      return;
    }
    if (dragging.get() && isPresented) return;
    // Preserve the velocity-carrying spring started by a completed drag.
    if (targetY.get() === target) {
      if (!isPresented) hideWhenClosed();
      return;
    }
    targetY.set(target);
    translateY.set(
      withSpring(
        target,
        { duration: 300, dampingRatio: 1, overshootClamping: true },
        (finished) => {
          if (finished && !isPresented) scheduleOnRN(hideWhenClosed);
        },
      ),
    );
  }, [
    dragging,
    expanded,
    hideWhenClosed,
    isPresented,
    motionEnabled,
    rendered,
    sheetHeight,
    targetY,
    translateY,
    travel,
  ]);

  useEffect(
    () => () => {
      cancelAnimation(translateY);
      targetY.set(Number.NaN);
      dragging.set(false);
    },
    [dragging, targetY, translateY],
  );

  useEffect(() => {
    if (!isPresented) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (expanded && !dismissOnCollapse) onExpandedChange(false);
      else onDismiss();
      return true;
    });
    return () => subscription.remove();
  }, [dismissOnCollapse, expanded, isPresented, onDismiss, onExpandedChange]);

  function settle(nextExpanded: boolean, velocity = 0) {
    'worklet';
    const dismissing = !nextExpanded && dismissOnCollapse;
    const target = nextExpanded ? 0 : dismissing ? sheetHeight : travel;
    cancelAnimation(translateY);
    targetY.set(target);
    if (nextExpanded) scheduleOnRN(onExpandedChange, true);
    if (!motionEnabled) {
      translateY.set(target);
      if (!nextExpanded) {
        if (dismissing) scheduleOnRN(onDismiss);
        else scheduleOnRN(onExpandedChange, false);
      }
      return;
    }
    translateY.set(
      withSpring(
        target,
        {
          duration: 300,
          dampingRatio: 0.8,
          velocity,
          overshootClamping: true,
        },
        (finished) => {
          // Keep expanded content in place until the closing motion has completed.
          if (finished && !nextExpanded) {
            if (dismissing) scheduleOnRN(onDismiss);
            else scheduleOnRN(onExpandedChange, false);
          }
        },
      ),
    );
  }

  const pan = usePanGesture({
    enabled: isPresented && dragDistance > 0,
    activeOffsetY: [-8, 8],
    failOffsetX: [-24, 24],
    maxPointers: 1,
    onBegin: () => {
      // Catch an opening/closing sheet on touch-down, before the pan threshold.
      // A tap or failed pan resumes the same target in onFinalize.
      cancelAnimation(translateY);
      dragging.set(true);
      startExpanded.set(targetY.get() === 0);
    },
    onActivate: (event) => {
      // Activation already includes the recognition distance. Start tracking at
      // the current spring position instead of jumping by that distance.
      startY.set(translateY.get() - event.translationY);
    },
    onUpdate: (event) => {
      translateY.set(Math.max(0, Math.min(dragDistance, startY.get() + event.translationY)));
    },
    onDeactivate: (event) => {
      dragging.set(false);
      if (!isPresented) return;
      const nextExpanded = event.canceled
        ? startExpanded.get()
        : translateY.get() + event.velocityY * 0.2 < collapseThreshold;
      settle(nextExpanded, event.canceled ? 0 : event.velocityY);
    },
    onFinalize: () => {
      if (!dragging.get()) return;
      dragging.set(false);
      if (isPresented) settle(startExpanded.get());
    },
  });
  const tap = useTapGesture({
    enabled: isPresented,
    maxDistance: 8,
    requireToFail: pan,
    onDeactivate: (event) => {
      if (!event.canceled) settle(targetY.get() !== 0);
    },
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));
  const hasPreview = collapsedContent !== undefined;
  const contentStyle = useAnimatedStyle(() => ({
    opacity: hasPreview && targetY.get() !== 0 && translateY.get() >= travel - 1 ? 0 : 1,
  }));
  const previewStyle = useAnimatedStyle(() => ({
    opacity: targetY.get() !== 0 && translateY.get() >= travel - 1 ? 1 : 0,
  }));

  if (!rendered) return null;
  return (
    <GestureHandlerRootView
      pointerEvents={isPresented ? 'box-none' : 'none'}
      accessibilityElementsHidden={!isPresented}
      importantForAccessibility={isPresented ? 'auto' : 'no-hide-descendants'}
      style={[styles.root, { height: sheetHeight }]}
    >
      <Animated.View
        testID={testID}
        style={[
          styles.sheet,
          { height: sheetHeight, backgroundColor: colors.surface ?? defaults.card },
          animatedStyle,
        ]}
      >
        <GestureDetector gesture={pan}>
          <View collapsable={false}>
            <GestureDetector gesture={tap}>
              <View
                collapsable={false}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel={
                  expanded ? collapseAccessibilityLabel : expandAccessibilityLabel
                }
                accessibilityState={{ expanded }}
                accessibilityActions={[
                  { name: 'increment', label: expandAccessibilityLabel },
                  { name: 'decrement', label: collapseAccessibilityLabel },
                  { name: 'activate' },
                ]}
                onAccessibilityAction={({ nativeEvent }) =>
                  onExpandedChange(
                    nativeEvent.actionName === 'increment'
                      ? true
                      : nativeEvent.actionName === 'decrement'
                        ? false
                        : !expanded,
                  )
                }
                testID={testID ? `${testID}-toggle` : undefined}
                hitSlop={{ bottom: 8 }}
                style={{
                  width: 96,
                  height: handleHeight,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  pointerEvents="none"
                  style={{
                    width: 32,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.muted ?? defaults.text,
                  }}
                />
              </View>
            </GestureDetector>
          </View>
        </GestureDetector>
        <View style={{ height: bodyHeight }}>
          <Animated.View
            pointerEvents={!hasPreview || expanded ? 'auto' : 'none'}
            accessibilityElementsHidden={hasPreview && !expanded}
            importantForAccessibility={hasPreview && !expanded ? 'no-hide-descendants' : 'auto'}
            style={[StyleSheet.absoluteFill, contentStyle]}
          >
            <UniversalHost
              viewportHeight={bodyHeight}
              ignoreSafeArea="all"
              useViewportSizeMeasurement
            >
              <ScrollView
                modifiers={nativeFillWidth}
                style={{ height: bodyHeight }}
                testID={testID ? `${testID}-scroll` : undefined}
              >
                <Column
                  spacing={12}
                  modifiers={nativeFillWidth}
                  style={{ paddingHorizontal: 16, paddingVertical: 12 }}
                >
                  {children}
                </Column>
              </ScrollView>
            </UniversalHost>
          </Animated.View>
          {hasPreview ? (
            <Animated.View
              pointerEvents={expanded ? 'none' : 'auto'}
              accessibilityElementsHidden={expanded}
              importantForAccessibility={expanded ? 'no-hide-descendants' : 'auto'}
              style={[StyleSheet.absoluteFill, previewStyle]}
            >
              <UniversalHost ignoreSafeArea="all">
                <Column
                  spacing={4}
                  modifiers={nativeFillWidth}
                  style={{ paddingHorizontal: 16, paddingVertical: 12 }}
                >
                  {collapsedContent}
                </Column>
              </UniversalHost>
            </Animated.View>
          ) : null}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxWidth: screenContentMaxWidth,
    alignSelf: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
});
