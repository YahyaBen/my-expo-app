import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, type ThemeId } from '@/constants/themes/index';
import type { AppColorScheme } from '@/constants/themes/tokens';
import {
  DEFAULT_HEADER_SHAPE,
  isHeaderStyle,
  type PageHeaderStyle,
} from '@/constants/header-motion';
import { DEFAULT_HEADER_BLUR, isHeaderBlur } from '@/constants/header-blur';

const HEADER_STORAGE_KEY = 'appHeaderMotion';
const HEADER_BLUR_STORAGE_KEY = 'appHeaderBlur';
const REDUCED_MOTION_STORAGE_KEY = 'appReducedMotion';
const APPEARANCE_STORAGE_KEY = 'appColorScheme';
let preferencePersistence = Promise.resolve();

export type ColorSchemePreference = AppColorScheme | 'system';

function isColorSchemePreference(value: unknown): value is ColorSchemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

interface ThemeSettings {
  themeId: ThemeId;
  colorScheme: ColorSchemePreference;
  setThemeId: (theme: ThemeId) => void;
  setColorScheme: (scheme: ColorSchemePreference) => void;
  appearanceReady: boolean;
  headerShape: PageHeaderStyle;
  setHeaderShape: (shape: PageHeaderStyle) => void;
  headerBlur: number;
  setHeaderBlur: (blur: number) => void;
  headerMotionReady: boolean;
  reducedMotion: boolean | null;
  setReducedMotion: (reduced: boolean) => void;
}

const ThemeContext = createContext<ThemeSettings | undefined>(undefined);

/** Preferences belong to the app; each page only renders its own controls. */
export function ThemePreferencesProvider({
  children,
  initialTheme = 'ux',
  initialColorScheme = 'system',
  initialHeaderShape = DEFAULT_HEADER_SHAPE,
  initialHeaderBlur = DEFAULT_HEADER_BLUR,
  initialReducedMotion = null,
  persistHeaderMotion = false,
  persistAppearance = false,
  allowThemeSelection = false,
}: PropsWithChildren<{
  initialTheme?: ThemeId;
  initialColorScheme?: ColorSchemePreference;
  initialHeaderShape?: PageHeaderStyle;
  initialHeaderBlur?: number;
  initialReducedMotion?: boolean | null;
  persistHeaderMotion?: boolean;
  /** Only the app root persists appearance; isolated previews stay in memory. */
  persistAppearance?: boolean;
  /** Explicit opt-in for local component previews, never the app root. */
  allowThemeSelection?: boolean;
}>) {
  const [themeId, updateThemeId] = useState(initialTheme);
  const [colorScheme, updateColorScheme] = useState(initialColorScheme);
  const [appearanceReady, setAppearanceReady] = useState(!persistAppearance);
  const [headerShape, updateHeaderShape] = useState(initialHeaderShape);
  const [headerBlur, updateHeaderBlur] = useState(() =>
    isHeaderBlur(initialHeaderBlur) ? initialHeaderBlur : DEFAULT_HEADER_BLUR,
  );
  const [reducedMotion, updateReducedMotion] = useState(initialReducedMotion);
  const [headerMotionReady, setHeaderMotionReady] = useState(!persistHeaderMotion);
  const pendingHeaderBlur = useRef<number | undefined>(undefined);
  const headerBlurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flushHeaderBlur = useCallback(() => {
    if (headerBlurTimer.current !== undefined) clearTimeout(headerBlurTimer.current);
    headerBlurTimer.current = undefined;
    const blur = pendingHeaderBlur.current;
    pendingHeaderBlur.current = undefined;
    if (blur === undefined) return;
    preferencePersistence = preferencePersistence
      .then(() => AsyncStorage.setItem(HEADER_BLUR_STORAGE_KEY, String(blur)))
      .catch(() => {
        /* Retain the live blur selection when local storage is unavailable. */
      });
  }, []);
  // Queue the latest selection before a replacement root starts reading preferences.
  useEffect(() => () => flushHeaderBlur(), [flushHeaderBlur]);
  useEffect(() => {
    if (!persistAppearance) return;
    let active = true;
    // A remounted root must read after any previous selection has finished saving.
    void preferencePersistence
      .then(() => AsyncStorage.getItem(APPEARANCE_STORAGE_KEY))
      .then((stored) => {
        if (active && isColorSchemePreference(stored)) updateColorScheme(stored);
      })
      .catch(() => {
        /* Retain the initial appearance when local storage is unavailable. */
      })
      .finally(() => {
        if (active) setAppearanceReady(true);
      });
    return () => {
      active = false;
    };
  }, [persistAppearance]);
  useEffect(() => {
    if (!persistHeaderMotion) return;
    let active = true;
    void preferencePersistence
      .then(() =>
        Promise.all([
          AsyncStorage.getItem(HEADER_STORAGE_KEY),
          AsyncStorage.getItem(REDUCED_MOTION_STORAGE_KEY),
          AsyncStorage.getItem(HEADER_BLUR_STORAGE_KEY),
        ]),
      )
      .then(([stored, reduced, blur]) => {
        if (!active) return;
        if (isHeaderStyle(stored)) updateHeaderShape(stored);
        if (reduced === 'true' || reduced === 'false') updateReducedMotion(reduced === 'true');
        const restoredBlur = Number(blur);
        if (isHeaderBlur(restoredBlur)) updateHeaderBlur(restoredBlur);
      })
      .catch(() => {
        /* Retain the default when local storage is unavailable. */
      })
      .finally(() => {
        if (active) setHeaderMotionReady(true);
      });
    return () => {
      active = false;
    };
  }, [persistHeaderMotion]);
  const setThemeId = useCallback(
    (theme: ThemeId) => {
      if (allowThemeSelection && Object.hasOwn(themes, theme)) updateThemeId(theme);
    },
    [allowThemeSelection],
  );
  const setColorScheme = useCallback(
    (scheme: ColorSchemePreference) => {
      if (!appearanceReady || !isColorSchemePreference(scheme)) return;
      updateColorScheme(scheme);
      if (persistAppearance) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(APPEARANCE_STORAGE_KEY, scheme))
          .catch(() => {
            /* The selected appearance remains usable for this session. */
          });
      }
    },
    [appearanceReady, persistAppearance],
  );
  const setHeaderShape = useCallback(
    (shape: PageHeaderStyle) => {
      if (!headerMotionReady || !isHeaderStyle(shape)) return;
      updateHeaderShape(shape);
      if (persistHeaderMotion) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(HEADER_STORAGE_KEY, shape))
          .catch(() => {
            /* The selected effect remains usable for this session. */
          });
      }
    },
    [headerMotionReady, persistHeaderMotion],
  );
  const setHeaderBlur = useCallback(
    (blur: number) => {
      if (!headerMotionReady || !isHeaderBlur(blur)) return;
      updateHeaderBlur(blur);
      if (!persistHeaderMotion) return;
      pendingHeaderBlur.current = blur;
      if (headerBlurTimer.current !== undefined) clearTimeout(headerBlurTimer.current);
      headerBlurTimer.current = setTimeout(flushHeaderBlur, 300);
    },
    [flushHeaderBlur, headerMotionReady, persistHeaderMotion],
  );
  const setReducedMotion = useCallback(
    (reduced: boolean) => {
      if (!headerMotionReady) return;
      updateReducedMotion(reduced);
      if (persistHeaderMotion) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(reduced)))
          .catch(() => {
            /* Retain the preference for this session when storage is unavailable. */
          });
      }
    },
    [headerMotionReady, persistHeaderMotion],
  );
  const value = useMemo(
    () => ({
      themeId,
      colorScheme,
      setThemeId,
      setColorScheme,
      appearanceReady,
      headerShape,
      setHeaderShape,
      headerBlur,
      setHeaderBlur,
      headerMotionReady,
      reducedMotion,
      setReducedMotion,
    }),
    [
      themeId,
      colorScheme,
      setThemeId,
      setColorScheme,
      appearanceReady,
      headerShape,
      setHeaderShape,
      headerBlur,
      setHeaderBlur,
      headerMotionReady,
      reducedMotion,
      setReducedMotion,
    ],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreferences() {
  return useContext(ThemeContext);
}

export function useThemeSettings() {
  const settings = useThemePreferences();
  if (!settings) throw new Error('Theme controls require ThemePreferencesProvider.');
  return settings;
}
