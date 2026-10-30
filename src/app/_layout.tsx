import { AlertHost, LaunchScreen, PageMotionOverlay } from '@components/ui';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Appearance, Platform, View } from 'react-native';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { getAppBrand } from '@/config/brand';
import { getBrandFonts } from '@/config/brand-assets';
import { storybookEnabled } from '@/config/developer-tools';
import { navigationTheme } from '@/constants/navigation-theme';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { LanguageProvider, useLanguage } from '@/context/language.context';
import { LayoutDirectionProvider, useLayoutDirection } from '@/context/layout-direction.context';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { StartupLayoutContext } from '@/context/startup-layout.context';
import {
  ThemePreferencesProvider,
  useAppearanceSettings,
  useHeaderMotionReady,
  useHeaderSettings,
} from '@/context/theme.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppActive, useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useAppTheme } from '@/hooks/use-theme';
import { useDevicePreferencesReady } from '@/lib/device-preferences';
import { configurePerformance, markStartupMilestone, PerformanceRoot } from '@/lib/performance';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { anchor: 'index' };

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 0, fade: false });
const brand = getAppBrand();
const brandFonts = getBrandFonts(brand);
configurePerformance(brand.variant);

export default function RootLayout() {
  const [loaded, error] = useFonts(brandFonts);
  const fontsReady = loaded || Boolean(error);
  useEffect(() => {
    if (fontsReady) markStartupMilestone('fonts_ready');
  }, [fontsReady]);

  return (
    <PerformanceRoot>
      <LayoutDirectionProvider>
        <LanguageProvider>
          <ThemePreferencesProvider
            initialTheme={brand.presentation.palette}
            initialHeaderShape={brand.presentation.header}
            persistHeaderMotion
            persistAppearance
          >
            <RootLayoutContent fontsReady={fontsReady} />
          </ThemePreferencesProvider>
        </LanguageProvider>
      </LayoutDirectionProvider>
    </PerformanceRoot>
  );
}

function RootLayoutContent({ fontsReady }: Readonly<{ fontsReady: boolean }>) {
  const devicePreferencesReady = useDevicePreferencesReady();
  const { colorScheme: appearance, appearanceReady } = useAppearanceSettings();
  const headerMotionReady = useHeaderMotionReady();
  const { ready: languageReady } = useLanguage();
  const colorScheme = useColorScheme();
  const { colors } = useAppTheme(colorScheme);
  const active = useAppActive();
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [initialLayoutReady, setInitialLayoutReady] = useState(false);
  const onInitialLayout = useCallback(() => setInitialLayoutReady(true), []);
  const finishLaunchScreen = useCallback(() => setShowLaunchScreen(false), []);
  const revealLaunchScreen = useCallback(() => SplashScreen.hide(), []);
  const preferencesReady =
    appearanceReady && languageReady && headerMotionReady && devicePreferencesReady;
  const resourcesReady = fontsReady && preferencesReady;
  const interactive = resourcesReady && initialLayoutReady && !showLaunchScreen;

  useEffect(() => {
    if (appearanceReady)
      Appearance.setColorScheme(appearance === 'system' ? 'unspecified' : appearance);
  }, [appearance, appearanceReady]);
  useEffect(() => {
    if (preferencesReady) markStartupMilestone('preferences_ready');
    if (initialLayoutReady) markStartupMilestone('page_layout_ready');
    if (resourcesReady && initialLayoutReady) markStartupMilestone('content_ready');
    if (interactive && active) markStartupMilestone('interactive');
  }, [preferencesReady, initialLayoutReady, resourcesReady, interactive, active]);

  if (!fontsReady) return null;

  return (
    <View
      testID={interactive ? 'app-ready' : undefined}
      collapsable={false}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AppPageMotionOverlay animate={!showLaunchScreen}>
        <PerformanceReadyContext.Provider value={interactive}>
          <StartupLayoutContext.Provider value={onInitialLayout}>
            <AppNavigator ready={resourcesReady} />
          </StartupLayoutContext.Provider>
        </PerformanceReadyContext.Provider>
      </AppPageMotionOverlay>
      {showLaunchScreen && appearanceReady ? (
        <LaunchScreen
          mode={brand.presentation.launch}
          exiting={resourcesReady && initialLayoutReady}
          onReady={revealLaunchScreen}
          onExitComplete={finishLaunchScreen}
        />
      ) : null}
      {!showLaunchScreen && <AlertHost />}
    </View>
  );
}

/** Header choices update decoration without rebuilding the navigation children. */
function AppPageMotionOverlay({
  children,
  animate,
}: Readonly<PropsWithChildren<{ animate: boolean }>>) {
  const { headerShape } = useHeaderSettings();
  return (
    <PageMotionOverlay shape={headerShape} animate={animate}>
      {children}
    </PageMotionOverlay>
  );
}

/** Motion preferences belong to the native transition owner, below startup layout. */
function AppNavigator({ ready }: Readonly<{ ready: boolean }>) {
  const colorScheme = useColorScheme();
  const { colors } = useAppTheme(colorScheme);
  const direction = useLayoutDirection();
  const reducedMotion = useAppReducedMotion();
  const theme = useMemo(() => navigationTheme(colorScheme, colors), [colorScheme, colors]);
  return (
    <>
      <ReducedMotionConfig mode={reducedMotion ? ReduceMotion.Always : ReduceMotion.Never} />
      {ready ? (
        <ThemeProvider value={theme}>
          <Stack
            activityEnabled={Platform.OS === 'android' ? 1 : false}
            screenOptions={{
              ...stackMotionOptions(reducedMotion),
              contentStyle: { backgroundColor: colors.background, direction },
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Protected guard={storybookEnabled}>
              <Stack.Screen name="storybook" />
            </Stack.Protected>
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      ) : null}
    </>
  );
}
