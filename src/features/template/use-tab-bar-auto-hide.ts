import { useMotionSettings } from '@/context/theme.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform, useWindowDimensions } from 'react-native';
import {
  useNativeGesture,
  usePanGesture,
  useSimultaneousGestures,
} from 'react-native-gesture-handler';
import { cancelAnimation, useSharedValue, withTiming } from 'react-native-reanimated';
import type { PageScreenProps, TabNavigationItemId } from '@components/ui';

/** Follow native iOS scrolling or Android content swipes without replacing scroll owners. */
export function useTabBarAutoHide(activeId: TabNavigationItemId, menuOpen: boolean) {
  const { tabBarAutoHideEnabled } = useMotionSettings();
  const motionEnabled = useMotionEnabled();
  const { width, height } = useWindowDimensions();
  // Keep navigation available until the initial accessibility query has completed.
  const [screenReader, setScreenReader] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(() => Keyboard.isVisible());
  const progress = useSharedValue(0);
  const hidden = useSharedValue(false);
  const previousY = useSharedValue(0);
  const travel = useSharedValue(0);
  const scrollSize = useSharedValue({ viewport: 0, content: 0 });
  const enabled =
    tabBarAutoHideEnabled &&
    motionEnabled &&
    !screenReader &&
    !keyboardVisible &&
    !menuOpen &&
    activeId !== 'more';

  const reset = useCallback(() => {
    hidden.set(false);
    cancelAnimation(progress);
    progress.set(0);
    scrollSize.set({ viewport: 0, content: 0 });
  }, [hidden, progress, scrollSize]);

  useEffect(() => {
    let active = true;
    let changed = false;
    const reader = AccessibilityInfo.addEventListener('screenReaderChanged', (value) => {
      changed = true;
      setScreenReader(value);
    });
    void AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (active && !changed) setScreenReader(value);
      })
      .catch(() => {
        /* Keep the dock visible when accessibility state is unavailable. */
      });
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      active = false;
      reader.remove();
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(reset, [activeId, enabled, height, reset, width]);
  useFocusEffect(
    useCallback(() => {
      reset();
      return reset;
    }, [reset]),
  );

  const updateVisibility = (delta: number) => {
    'worklet';
    // Require deliberate travel in the new direction; small reversals do not flicker the dock.
    const distance = travel.get() * delta < 0 ? delta : travel.get() + delta;
    travel.set(distance);
    if (Math.abs(distance) < 16) return;
    const nextHidden = distance < 0;
    if (hidden.get() === nextHidden) return;
    hidden.set(nextHidden);
    progress.set(withTiming(nextHidden ? 1 : 0, { duration: 520 }));
  };

  const onScrollGeometryChange: NonNullable<PageScreenProps['onScrollGeometryChange']> = (
    geometry,
  ) => {
    'worklet';
    if (!enabled) return;
    const offset = Math.max(
      0,
      Math.min(geometry.contentOffsetY, geometry.contentHeight - geometry.containerHeight),
    );
    const previousSize = scrollSize.get();
    if (
      previousSize.viewport !== geometry.containerHeight ||
      previousSize.content !== geometry.contentHeight
    ) {
      // Dock/viewport resizing and content updates are not changes of scroll direction.
      scrollSize.set({ viewport: geometry.containerHeight, content: geometry.contentHeight });
      previousY.set(offset);
      travel.set(0);
      return;
    }
    const delta = previousY.get() - offset;
    previousY.set(offset);
    if (offset <= 0 && hidden.get()) {
      hidden.set(false);
      progress.set(withTiming(0, { duration: 520 }));
      travel.set(0);
    } else {
      updateVisibility(delta);
    }
  };

  // Compose's universal scroll view has no offset callback. Its native handler continues
  // delivering touches to hosted content alongside the Android direction-observation pan.
  const gestureEnabled = enabled && Platform.OS === 'android';
  const native = useNativeGesture({ enabled: gestureEnabled, shouldActivateOnStart: true });
  const pan = usePanGesture({
    enabled: gestureEnabled,
    activeOffsetY: [-12, 12],
    failOffsetX: [-12, 12],
    maxPointers: 1,
    cancelsTouchesInView: false,
    cancelsJSResponder: false,
    onBegin: () => {
      'worklet';
      previousY.set(0);
      travel.set(0);
    },
    onUpdate: (event) => {
      'worklet';
      const delta = event.translationY - previousY.get();
      previousY.set(event.translationY);
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) return;
      updateVisibility(delta);
    },
  });
  const gesture = useSimultaneousGestures(native, pan);

  return {
    gesture,
    hideProgress: enabled ? progress : undefined,
    onScrollGeometryChange: enabled && Platform.OS === 'ios' ? onScrollGeometryChange : undefined,
  };
}
