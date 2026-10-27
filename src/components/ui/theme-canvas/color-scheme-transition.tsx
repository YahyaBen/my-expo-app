import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View, type ViewInstance } from 'react-native';
import { Canvas, Group, Image, Skia, type SkImage } from '@shopify/react-native-skia';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useThemeSettings, type ColorSchemePreference } from '@/context/theme.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { ColorSchemeControl } from '../appearance/color-scheme-control';

type Snapshot = { image: SkImage; scheme: ColorSchemePreference; width: number; height: number };
const AppearanceControlContext = createContext<{
  onValueChange: (scheme: ColorSchemePreference) => void;
  disabled: boolean;
} | null>(null);

export function ColorSchemeTransitionControl() {
  const control = useContext(AppearanceControlContext);
  if (!control) throw new Error('ColorSchemeTransitionControl requires ColorSchemeTransition.');
  return <ColorSchemeControl {...control} />;
}

/** Reveal live screen content beneath a temporary image of its previous appearance. */
export function ColorSchemeTransition({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme, appearanceReady } = useThemeSettings();
  const motionEnabled = useMotionEnabled();
  const view = useRef<ViewInstance>(null);
  const bounds = useRef({ width: 0, height: 0 });
  const mounted = useRef(false);
  const busy = useRef(false);
  const generation = useRef(0);
  const requested = useRef<ColorSchemePreference | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const radius = useSharedValue(0);
  const width = snapshot?.width ?? 0;
  const height = snapshot?.height ?? 0;
  const clip = useDerivedValue(() =>
    Skia.PathBuilder.Make()
      .addCircle(width / 2, height / 2, radius.get())
      .build(),
  );
  const finish = useCallback(() => {
    busy.current = false;
    requested.current = null;
    if (!mounted.current) return;
    setSnapshot(null);
    setCapturing(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      generation.current += 1;
      cancelAnimation(radius);
    };
  }, [radius]);

  useEffect(() => {
    if (!snapshot) return;
    let revealFrame = 0;
    // Mount the old image first, then let the new native theme render beneath it.
    const themeFrame = requestAnimationFrame(() => {
      setColorScheme(snapshot.scheme);
      if (!motionEnabled) {
        finish();
        return;
      }
      revealFrame = requestAnimationFrame(() => {
        radius.set(
          withTiming(
            Math.hypot(snapshot.width, snapshot.height) / 2,
            {
              duration: 300,
              easing: Easing.bezier(0.23, 1, 0.32, 1),
            },
            (finished) => {
              if (finished) scheduleOnRN(finish);
            },
          ),
        );
      });
    });
    return () => {
      cancelAnimationFrame(themeFrame);
      cancelAnimationFrame(revealFrame);
      cancelAnimation(radius);
    };
  }, [snapshot, motionEnabled, setColorScheme, radius, finish]);

  async function changeScheme(next: ColorSchemePreference) {
    if (busy.current || !appearanceReady || next === colorScheme) return;
    if (!motionEnabled || !view.current || bounds.current.width === 0) {
      setColorScheme(next);
      return;
    }
    busy.current = true;
    requested.current = next;
    setCapturing(true);
    const current = ++generation.current;
    try {
      // Load on demand so older development builds can still apply the preference directly.
      const { captureRef, releaseCapture } = await import('react-native-view-shot');
      const uri = await captureRef(view, {
        format: 'png',
        result: 'tmpfile',
        handleGLSurfaceViewOnAndroid: true,
      });
      try {
        if (!mounted.current || generation.current !== current) return;
        const image = Skia.Image.MakeImageFromEncoded(await Skia.Data.fromURI(uri));
        if (!mounted.current || generation.current !== current) return;
        if (!image) {
          setColorScheme(next);
          finish();
          return;
        }
        radius.set(0);
        setSnapshot({ image, scheme: next, ...bounds.current });
      } finally {
        releaseCapture(uri);
      }
    } catch {
      if (!mounted.current || generation.current !== current) return;
      // A capture failure must never prevent changing the saved appearance.
      setColorScheme(next);
      finish();
    }
  }

  return (
    <AppearanceControlContext.Provider
      value={{
        onValueChange: (next) => {
          void changeScheme(next);
        },
        disabled: capturing || Boolean(snapshot),
      }}
    >
      <View
        ref={view}
        collapsable={false}
        style={{ flex: 1 }}
        onLayout={({ nativeEvent: { layout } }) => {
          if (bounds.current.width === layout.width && bounds.current.height === layout.height)
            return;
          bounds.current = { width: layout.width, height: layout.height };
          if (busy.current) {
            generation.current += 1;
            cancelAnimation(radius);
            if (requested.current) setColorScheme(requested.current);
            finish();
          }
        }}
        testID="app-settings-theme-transition"
      >
        {children}
        {snapshot ? (
          <Canvas
            style={StyleSheet.absoluteFill}
            android={{ surfaceType: 'TextureView' }}
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            testID="app-settings-theme-reveal"
          >
            <Group clip={clip} invertClip>
              <Image image={snapshot.image} x={0} y={0} width={width} height={height} fit="fill" />
            </Group>
          </Canvas>
        ) : null}
      </View>
    </AppearanceControlContext.Provider>
  );
}
