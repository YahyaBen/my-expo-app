import { useAppearanceSettings, type AppearanceTransitionStyle } from '@/context/theme.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { Canvas, Group, Image, Skia, type SkImage } from '@shopify/react-native-skia';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { StyleSheet, View, type ViewInstance, type ViewProps } from 'react-native';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import type { PickerLayout } from '../picker/picker';
import { captureAppearance } from './capture-appearance';
import { PatternSnapshotReveal } from './pattern-snapshot-reveal';

export type SnapshotRevealFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  shrinking: boolean;
};
type Transition = {
  owner: ReturnType<typeof useAppearanceSettings>['setColorScheme'];
  origin: RefObject<ViewInstance | null>;
  busy: boolean;
  run: (apply: () => void, origin: PickerLayout | null, shrinking: boolean) => void;
};
const TransitionContext = createContext<Transition | null>(null);

/** Only coordinates presentation. The existing provider still owns saved preferences. */
export function AppearanceTransition({
  enabled,
  children,
  ...props
}: Readonly<ViewProps & { enabled: boolean }>) {
  const { setColorScheme, transitionStyle } = useAppearanceSettings();
  const animate = useMotionEnabled(enabled);
  const capture = useRef<ViewInstance>(null);
  const navigationOrigin = useRef<ViewInstance>(null);
  const frame = useRef<PickerLayout | null>(null);
  const mounted = useRef(false);
  const operation = useRef(0);
  const pending = useRef<(() => void) | null>(null);
  const snapshot = useRef<SkImage | null>(null);
  const image = useSharedValue<SkImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState<
    (SnapshotRevealFrame & { style: AppearanceTransitionStyle }) | null
  >(null);

  const applyPending = useCallback(() => {
    const apply = pending.current;
    pending.current = null;
    apply?.();
  }, []);

  const finish = useCallback(() => {
    operation.current += 1;
    const previous = snapshot.current;
    snapshot.current = null;
    image.set(null);
    // Wait for the UI runtime to stop drawing the full-screen texture before releasing it.
    if (previous) {
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

  const run = useCallback<Transition['run']>(
    (apply, origin, shrinking) => {
      if (pending.current || snapshot.current) return;
      const bounds = frame.current;
      const circular = transitionStyle === 'circular';
      if (
        !animate ||
        (circular && !origin && !navigationOrigin.current) ||
        !bounds ||
        bounds.width <= 0 ||
        bounds.height <= 0
      ) {
        apply();
        return;
      }
      const id = ++operation.current;
      pending.current = apply;
      setBusy(true);
      // Capture only on selection, after the native picker has received its dismissal.
      requestAnimationFrame(async () => {
        if (id !== operation.current || !mounted.current) return;
        try {
          const target = circular
            ? ((await measureAppearanceOrigin(navigationOrigin.current)) ?? origin)
            : null;
          if (id !== operation.current || !mounted.current) return;
          if (circular && !target) {
            finish();
            return;
          }
          const captured = await captureAppearance(capture);
          if (id !== operation.current || !mounted.current) {
            captured?.dispose();
            return;
          }
          if (!captured) {
            finish();
            return;
          }
          snapshot.current = captured;
          image.set(captured);
          setReveal({
            x: target
              ? Math.max(0, Math.min(bounds.width, target.x + target.width / 2 - bounds.x))
              : bounds.width / 2,
            y: target
              ? Math.max(0, Math.min(bounds.height, target.y + target.height / 2 - bounds.y))
              : bounds.height,
            width: bounds.width,
            height: bounds.height,
            shrinking,
            style: transitionStyle,
          });
        } catch (error) {
          // A failed snapshot must never prevent changing or saving appearance.
          if (id === operation.current) {
            if (__DEV__) console.warn('[AppearanceTransition] Theme reveal failed.', error);
            finish();
          }
        }
      });
    },
    [animate, finish, image, transitionStyle],
  );
  const transition = useMemo(
    () => ({ owner: setColorScheme, origin: navigationOrigin, busy, run }),
    [setColorScheme, busy, run],
  );

  return (
    <TransitionContext.Provider value={transition}>
      <View style={styles.fill}>
        <View
          {...props}
          ref={capture}
          collapsable={false}
          onLayout={(event) => {
            props.onLayout?.(event);
            const { width, height } = event.nativeEvent.layout;
            if (frame.current?.width !== width || frame.current.height !== height) finish();
            capture.current?.measureInWindow((x, y, measuredWidth, measuredHeight) => {
              frame.current = { x, y, width: measuredWidth, height: measuredHeight };
            });
          }}
        >
          {children}
        </View>
        {reveal ? (
          reveal.style !== 'circular' ? (
            <PatternSnapshotReveal
              variant={reveal.style}
              width={reveal.width}
              height={reveal.height}
              image={image}
              onCovered={applyPending}
              onComplete={finish}
            />
          ) : (
            <SnapshotReveal
              reveal={reveal}
              image={image}
              onCovered={applyPending}
              onComplete={finish}
            />
          )
        ) : null}
      </View>
    </TransitionContext.Provider>
  );
}

export function useAppearanceTransition() {
  const transition = useContext(TransitionContext);
  const { setColorScheme } = useAppearanceSettings();
  // A nested preview must never capture or change the app root's presentation.
  return transition?.owner === setColorScheme ? transition : null;
}

/** The app shell supplies the native frame centered on its floating navigation action. */
export function useAppearanceTransitionOrigin() {
  return useAppearanceTransition()?.origin;
}

function measureAppearanceOrigin(view: ViewInstance | null): Promise<PickerLayout | null> {
  if (!view) return Promise.resolve(null);
  return new Promise((resolve) => {
    // A detached native view may not call back; retain the picker's origin in that case.
    const timeout = setTimeout(() => resolve(null), 100);
    try {
      view.measureInWindow((x, y, width, height) => {
        clearTimeout(timeout);
        resolve(width > 0 && height > 0 ? { x, y, width, height } : null);
      });
    } catch {
      clearTimeout(timeout);
      resolve(null);
    }
  });
}

/** Shared circular reveal; callers own snapshot capture, changes and image disposal. */
export function SnapshotReveal({
  reveal: { x, y, width, height, shrinking },
  image,
  onCovered,
  onComplete,
  testID = 'app-appearance-reveal',
}: Readonly<{
  reveal: SnapshotRevealFrame;
  image: SharedValue<SkImage | null>;
  onCovered: () => void;
  onComplete: () => void;
  testID?: string;
}>) {
  const maxRadius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 1;
  const radius = useSharedValue(shrinking ? maxRadius : 0);
  const clip = useDerivedValue(() => Skia.PathBuilder.Make().addCircle(x, y, radius.get()).build());

  useEffect(() => {
    // Cover the old content before applying the change, then give native content a commit.
    let frameId = requestAnimationFrame(() => {
      onCovered();
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => {
          radius.set(
            withTiming(
              shrinking ? 0 : maxRadius,
              {
                duration: 1200,
                easing: Easing.bezier(0.215, 0.61, 0.355, 1),
                reduceMotion: ReduceMotion.Never,
              },
              (finished) => {
                if (finished) scheduleOnRN(onComplete);
              },
            ),
          );
        });
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimation(radius);
    };
  }, [maxRadius, onComplete, onCovered, radius, shrinking]);

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID={testID}
    >
      <Canvas style={styles.fill} pointerEvents="none">
        <Group clip={clip} invertClip={!shrinking}>
          <Image image={image} x={0} y={0} width={width} height={height} fit="fill" />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
