import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, type ThemeId } from '@/constants/themes/index';
import type { AppColorScheme } from '@/constants/themes/tokens';
const REDUCED_MOTION_STORAGE_KEY = 'appReducedMotion';
const APPEARANCE_STORAGE_KEY = 'appColorScheme';
const THEME_STORAGE_KEY = 'appTheme';
let preferencePersistence = Promise.resolve();

export type ColorSchemePreference = AppColorScheme | 'system';

function isColorSchemePreference(value: unknown): value is ColorSchemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && Object.hasOwn(themes, value);
}

interface ThemeSettings {
  themeId: ThemeId;
  themeSelectionEnabled: boolean;
  colorScheme: ColorSchemePreference;
  setThemeId: (theme: ThemeId) => void;
  setColorScheme: (scheme: ColorSchemePreference) => void;
  appearanceReady: boolean;
  motionReady: boolean;
  reducedMotion: boolean | null;
  setReducedMotion: (reduced: boolean) => void;
}

const PaletteContext = createContext<
  Pick<ThemeSettings, 'themeId' | 'setThemeId' | 'themeSelectionEnabled'> | undefined
>(undefined);
const AppearanceContext = createContext<
  Pick<ThemeSettings, 'colorScheme' | 'setColorScheme' | 'appearanceReady'> | undefined
>(undefined);
const MotionContext = createContext<
  Pick<ThemeSettings, 'reducedMotion' | 'setReducedMotion' | 'motionReady'> | undefined
>(undefined);
const MotionReadyContext = createContext(true);

/** Preferences belong to the app; each page only renders its own controls. */
export function ThemePreferencesProvider({
  children,
  initialTheme = 'ux',
  initialColorScheme = 'system',
  initialReducedMotion = null,
  persistMotion = false,
  persistAppearance = false,
  allowThemeSelection = false,
}: Readonly<
  PropsWithChildren<{
    initialTheme?: ThemeId;
    initialColorScheme?: ColorSchemePreference;
    initialReducedMotion?: boolean | null;
    persistMotion?: boolean;
    /** Only the app root persists palette and appearance; isolated previews stay in memory. */
    persistAppearance?: boolean;
    /** Explicit opt-in for the app root and local component previews. */
    allowThemeSelection?: boolean;
  }>
>) {
  const [themeId, updateThemeId] = useState(initialTheme);
  const [colorScheme, updateColorScheme] = useState(initialColorScheme);
  const [appearanceReady, setAppearanceReady] = useState(!persistAppearance);
  const [reducedMotion, updateReducedMotion] = useState(initialReducedMotion);
  const [motionReady, setMotionReady] = useState(!persistMotion);
  const themeSelectionEnabled = allowThemeSelection && appearanceReady;
  useEffect(() => {
    if (!persistAppearance) return;
    let active = true;
    // A remounted root must read after any previous selection has finished saving.
    void preferencePersistence
      .then(() => AsyncStorage.multiGet([APPEARANCE_STORAGE_KEY, THEME_STORAGE_KEY]))
      .then(([appearance, palette]) => {
        if (!active) return;
        const storedScheme = appearance?.[1];
        const storedTheme = palette?.[1];
        if (isColorSchemePreference(storedScheme)) updateColorScheme(storedScheme);
        if (allowThemeSelection && isThemeId(storedTheme)) updateThemeId(storedTheme);
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
  }, [allowThemeSelection, persistAppearance]);
  useEffect(() => {
    if (!persistMotion) return;
    let active = true;
    void preferencePersistence
      .then(() => AsyncStorage.getItem(REDUCED_MOTION_STORAGE_KEY))
      .then((reduced) => {
        if (!active) return;
        if (reduced === 'true' || reduced === 'false') updateReducedMotion(reduced === 'true');
      })
      .catch(() => {
        /* Retain the default when local storage is unavailable. */
      })
      .finally(() => {
        if (active) setMotionReady(true);
      });
    return () => {
      active = false;
    };
  }, [persistMotion]);
  const setThemeId = useCallback(
    (theme: ThemeId) => {
      if (!themeSelectionEnabled || !isThemeId(theme)) return;
      updateThemeId(theme);
      if (persistAppearance) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(THEME_STORAGE_KEY, theme))
          .catch(() => {
            /* The selected palette remains usable for this session. */
          });
      }
    },
    [themeSelectionEnabled, persistAppearance],
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
  const setReducedMotion = useCallback(
    (reduced: boolean) => {
      if (!motionReady) return;
      updateReducedMotion(reduced);
      if (persistMotion) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(reduced)))
          .catch(() => {
            /* Retain the preference for this session when storage is unavailable. */
          });
      }
    },
    [motionReady, persistMotion],
  );
  // Each subscription changes only with the preference group it renders.
  const palette = useMemo(
    () => ({ themeId, setThemeId, themeSelectionEnabled }),
    [themeId, setThemeId, themeSelectionEnabled],
  );
  const appearance = useMemo(
    () => ({ colorScheme, setColorScheme, appearanceReady }),
    [colorScheme, setColorScheme, appearanceReady],
  );
  const motion = useMemo(
    () => ({ reducedMotion, setReducedMotion, motionReady }),
    [reducedMotion, setReducedMotion, motionReady],
  );
  return (
    <PaletteContext.Provider value={palette}>
      <AppearanceContext.Provider value={appearance}>
        <MotionContext.Provider value={motion}>
          <MotionReadyContext.Provider value={motionReady}>{children}</MotionReadyContext.Provider>
        </MotionContext.Provider>
      </AppearanceContext.Provider>
    </PaletteContext.Provider>
  );
}

/** Full snapshots are for preview seeding; rendering hooks subscribe to a group below. */
export function useThemePreferences() {
  const palette = useContext(PaletteContext);
  const appearance = useContext(AppearanceContext);
  const motion = useContext(MotionContext);
  return useMemo(
    () => (palette && appearance && motion ? { ...palette, ...appearance, ...motion } : undefined),
    [palette, appearance, motion],
  );
}

export function useThemeSettings() {
  const settings = useThemePreferences();
  if (!settings) throw new Error('Theme controls require ThemePreferencesProvider.');
  return settings;
}

export function useThemePalette() {
  return useContext(PaletteContext);
}

export function usePaletteSettings() {
  const settings = useThemePalette();
  if (!settings) throw new Error('Theme controls require ThemePreferencesProvider.');
  return settings;
}

export function useAppearancePreferences() {
  return useContext(AppearanceContext);
}

export function useAppearanceSettings() {
  const settings = useAppearancePreferences();
  if (!settings) throw new Error('Theme controls require ThemePreferencesProvider.');
  return settings;
}

export function useMotionPreferences() {
  return useContext(MotionContext);
}

export function useMotionSettings() {
  const settings = useMotionPreferences();
  if (!settings) throw new Error('Theme controls require ThemePreferencesProvider.');
  return settings;
}

export function useMotionReady() {
  return useContext(MotionReadyContext);
}
