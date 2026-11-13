import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import type { SnapshotRevealFrame } from '@components/ui';
import { Skia, type SkImage } from '@shopify/react-native-skia';
import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type MapView from 'react-native-maps';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

type MapType = 'standard' | 'satellite';

/** Capture the native map on selection; keep one live map and its camera throughout. */
export function useMapTypeTransition(
  map: RefObject<MapView | null>,
  ready: boolean,
  originBottom: number,
) {
  const focused = useIsFocused();
  const animate = useMotionEnabled(focused && ready);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState<SnapshotRevealFrame | null>(null);
  const image = useSharedValue<SkImage | null>(null);
  const snapshot = useRef<SkImage | null>(null);
  const frame = useRef<{ width: number; height: number } | null>(null);
  const pending = useRef<MapType | null>(null);
  const capturing = useRef(false);
  const mounted = useRef(false);
  const operation = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyPending = useCallback(() => {
    const next = pending.current;
    pending.current = null;
    if (next) setMapType(next);
  }, []);

  const finish = useCallback(() => {
    operation.current += 1;
    capturing.current = false;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    const previous = snapshot.current;
    snapshot.current = null;
    image.set(null);
    if (previous) {
      // Match the theme transition's UI handoff before releasing a drawn texture.
      const dispose = () => previous.dispose();
      scheduleOnUI(() => {
        'worklet';
        scheduleOnRN(dispose);
      });
    }
    if (mounted.current) {
      applyPending();
      setReveal(null);
      setBusy(false);
    }
  }, [applyPending, image]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current = null;
      finish();
    };
  }, [finish]);

  useEffect(() => {
    if (!animate) finish();
  }, [animate, finish]);

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const { width, height } = nativeEvent.layout;
      if (frame.current?.width !== width || frame.current.height !== height) finish();
      frame.current = { width, height };
    },
    [finish],
  );

  async function selectMapType(next: MapType) {
    if (capturing.current || next === mapType) return;
    const bounds = frame.current;
    const target = map.current;
    if (!animate || !target || !bounds || bounds.width <= 0 || bounds.height <= 0) {
      setMapType(next);
      return;
    }
    const id = ++operation.current;
    capturing.current = true;
    pending.current = next;
    setBusy(true);
    // A missing native snapshot callback must never leave map controls disabled.
    timeout.current = setTimeout(finish, 2000);
    try {
      // Generic view capture can miss Google Maps' native rendering surface.
      const encoded = await target.takeSnapshot({ format: 'png', result: 'base64' });
      if (id !== operation.current || !mounted.current) return;
      const data = Skia.Data.fromBase64(encoded);
      let captured: SkImage | null;
      try {
        captured = Skia.Image.MakeImageFromEncoded(data);
      } finally {
        data.dispose();
      }
      if (!captured) {
        finish();
        return;
      }
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
      snapshot.current = captured;
      image.set(captured);
      setReveal({
        x: bounds.width / 2,
        y: Math.max(0, Math.min(bounds.height, bounds.height - originBottom)),
        width: bounds.width,
        height: bounds.height,
        shrinking: false,
      });
    } catch (error) {
      if (id === operation.current) {
        if (__DEV__) console.warn('[GoogleMap] Map type reveal failed.', error);
        finish();
      }
    }
  }

  return { mapType, busy, reveal, image, selectMapType, onLayout, applyPending, finish };
}
