import { useCallback, useEffect } from 'react';
import { useFrameCallback, useSharedValue, type FrameInfo } from 'react-native-reanimated';
import { useMotionEnabled } from './use-motion-enabled';

/** Active seconds shared by decorative animation; pausing preserves its phase. */
export function useActiveMotionTime(animate: boolean) {
  const enabled = useMotionEnabled(animate);
  const time = useSharedValue(0);
  const advance = useCallback(
    ({ timeSincePreviousFrame }: FrameInfo) => {
      'worklet';
      // Activation has no delta; neither paused time nor a long frame creates a jump.
      if (timeSincePreviousFrame === null) return;
      const elapsed = Math.min(timeSincePreviousFrame, 64);
      time.set((value) => (value + elapsed / 1000) % 120);
    },
    [time],
  );
  const { setActive } = useFrameCallback(advance, false);
  useEffect(() => {
    setActive(enabled);
    return () => setActive(false);
  }, [enabled, setActive]);

  return time;
}
