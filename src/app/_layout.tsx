import {
  UniversalTextContent as Text,
  Column,
  AlertHost,
  UniversalHost as Host,
  LaunchScreen,
  LoadingContent,
  nativeFillSize,
  PageFrame,
  PageSection,
  PageMotionOverlay,
  Spacer,
  UniversalButtonContent,
} from '@components/ui';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Appearance, Platform, View } from 'react-native';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { useAppActive, useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigationTheme } from '@/constants/navigation-theme';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { AuthProvider, useAuthContext } from '@/context/auth.context';
import { LanguageProvider, useLanguage } from '@/context/language.context';
import { LoginTransitionContext } from '@/context/login-transition.context';
import { LayoutDirectionProvider, useLayoutDirection } from '@/context/layout-direction.context';
import { AppQueryProvider } from '@/context/query-provider';
import { ThemePreferencesProvider, useThemeSettings } from '@/context/theme.context';
import { useAuthGuards } from '@/guards/auth-guards';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStoreUpdates } from '@/hooks/use-store-updates';
import { useAppTheme, useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import { getBrandFonts } from '@/config/brand-assets';
import { getAppBrand } from '@/config/brand';
import { StartupLayoutContext } from '@/context/startup-layout.context';
import { developerScreensEnabled, storybookEnabled } from '@/config/developer-tools';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { configurePerformance, markStartupMilestone, PerformanceRoot } from '@/lib/performance';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash may already be hidden during a development reload.
});
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

  // Hydrate preferences and restore the session concurrently with font loading.
  // Native content still waits for the font or its existing fallback path.
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
            <AppQueryProvider>
              <AuthProvider>
                <RootLayoutContent fontsReady={fontsReady} />
              </AuthProvider>
            </AppQueryProvider>
          </ThemePreferencesProvider>
        </LanguageProvider>
      </LayoutDirectionProvider>
    </PerformanceRoot>
  );
}

function RootLayoutContent({ fontsReady }: Readonly<{ fontsReady: boolean }>) {
  const {
    colorScheme: appearancePreference,
    appearanceReady,
    headerShape,
    headerMotionReady = true,
  } = useThemeSettings();
  useEffect(() => {
    if (!appearanceReady) return;
    Appearance.setColorScheme(
      appearancePreference === 'system' ? 'unspecified' : appearancePreference,
    );
  }, [appearancePreference, appearanceReady]);
  const colorScheme = useColorScheme();
  const { colors, design } = useAppTheme(colorScheme);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const { restoring, requireAuth } = useAuthGuards();
  const pathname = usePathname();
  const animatedHeader = design.header.artwork && headerShape !== 'default';
  const expanded = animatedHeader && pathname === '/login' && !requireAuth;
  const reducedMotion = useAppReducedMotion();
  const active = useAppActive();
  const [loginWaveComplete, setLoginWaveComplete] = useState(true);
  if (expanded && !reducedMotion && !showLaunchScreen && loginWaveComplete)
    setLoginWaveComplete(false);
  const holdLogin =
    animatedHeader &&
    !reducedMotion &&
    !showLaunchScreen &&
    pathname === '/login' &&
    requireAuth &&
    !loginWaveComplete;
  const finishLoginWave = useCallback(() => setLoginWaveComplete(true), []);
  const { error } = useAuthContext();
  const { ready: languageReady } = useLanguage();
  const animatePageArtwork = !showLaunchScreen;
  const preferencesReady = appearanceReady && languageReady && headerMotionReady;
  const resourcesReady = fontsReady && preferencesReady;
  const startupReady = resourcesReady && !restoring && !error;
  // Restoration failures must expose their retry UI instead of keeping the launch overlay.
  const canReveal = resourcesReady && (!restoring || Boolean(error));
  const layoutPhase = restoring ? (error ? 'recovery' : null) : 'ready';
  const [laidOutPhase, setLaidOutPhase] = useState<typeof layoutPhase>(null);
  if (layoutPhase === null && laidOutPhase !== null) setLaidOutPhase(null);
  const onInitialLayout = useCallback(() => {
    if (layoutPhase) setLaidOutPhase(layoutPhase);
  }, [layoutPhase]);
  const initialLayoutReady = layoutPhase !== null && laidOutPhase === layoutPhase;
  const finishLaunchScreen = useCallback(() => setShowLaunchScreen(false), []);
  const revealLaunchScreen = useCallback(() => {
    SplashScreen.hide();
  }, []);
  useStoreUpdates(startupReady && initialLayoutReady && !showLaunchScreen);
  const interactive = initialLayoutReady && !showLaunchScreen && (startupReady || Boolean(error));
  useEffect(() => {
    if (preferencesReady) markStartupMilestone('preferences_ready');
    if (!restoring && !error) markStartupMilestone('session_ready');
    if (initialLayoutReady) markStartupMilestone('page_layout_ready');
    if (startupReady && initialLayoutReady) markStartupMilestone('content_ready');
    if (interactive && active) markStartupMilestone(error ? 'recovery_interactive' : 'interactive');
  }, [preferencesReady, restoring, error, initialLayoutReady, startupReady, interactive, active]);

  if (!fontsReady) return null;

  return (
    <LoginTransitionContext.Provider value={holdLogin}>
      <View
        testID={
          !showLaunchScreen && initialLayoutReady
            ? startupReady
              ? 'app-ready'
              : error
                ? 'app-recovery'
                : undefined
            : undefined
        }
        collapsable={false}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ReducedMotionConfig mode={reducedMotion ? ReduceMotion.Always : ReduceMotion.Never} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <PageMotionOverlay
          shape={headerShape}
          animate={animatePageArtwork}
          expanded={expanded}
          onCollapseComplete={finishLoginWave}
        >
          <PerformanceReadyContext.Provider value={interactive}>
            <StartupLayoutContext.Provider value={onInitialLayout}>
              {canReveal || !showLaunchScreen ? <RootLayoutNav holdLogin={holdLogin} /> : null}
            </StartupLayoutContext.Provider>
          </PerformanceReadyContext.Provider>
        </PageMotionOverlay>
        {showLaunchScreen && appearanceReady && (
          <LaunchScreen
            mode={error ? 'minimal' : brand.presentation.launch}
            exiting={canReveal && initialLayoutReady}
            onReady={revealLaunchScreen}
            onExitComplete={finishLaunchScreen}
          />
        )}
        {!showLaunchScreen && <AlertHost />}
      </View>
    </LoginTransitionContext.Provider>
  );
}

function RootLayoutNav({ holdLogin }: Readonly<{ holdLogin: boolean }>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = useThemeColors(colorScheme);
  const direction = useLayoutDirection();
  const reducedMotion = useAppReducedMotion();
  const { requireAuth, requireNoAuth, restoring } = useAuthGuards();
  const { error, retryRestore } = useAuthContext();

  if (restoring)
    return (
      <PageFrame title={t('session.title')}>
        <View
          style={{
            flex: 1,
            ...screenInsets(insets, { headerShown: true }),
          }}
        >
          <Host
            style={{ flex: 1 }}
            colorScheme={colorScheme}
            seedColor={colors.tint}
            matchContents={false}
            ignoreSafeArea="all"
          >
            <Column spacing={16} alignment="center" modifiers={nativeFillSize}>
              <Spacer flexible />
              <PageSection alignment="center">
                {error ? <Text>{error}</Text> : <LoadingContent label={t('session.restoring')} />}
                {error ? (
                  <UniversalButtonContent
                    variant="secondary"
                    testID="session-restore-retry"
                    label={t('common.tryAgain')}
                    onPress={retryRestore}
                  />
                ) : null}
              </PageSection>
              <Spacer flexible />
            </Column>
          </Host>
        </View>
      </PageFrame>
    );

  return (
    <ThemeProvider value={navigationTheme(colorScheme, colors)}>
      <Stack
        activityEnabled={Platform.OS === 'android' ? 1 : false}
        screenOptions={{
          ...stackMotionOptions(reducedMotion),
          contentStyle: { backgroundColor: colors.background, direction },
          headerShown: false,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Protected guard={developerScreensEnabled}>
          <Stack.Screen name="ui" />
          <Stack.Screen name="ui-component/[name]" />
        </Stack.Protected>
        <Stack.Protected guard={storybookEnabled}>
          <Stack.Screen name="storybook" />
        </Stack.Protected>
        <Stack.Protected guard={requireNoAuth || holdLogin}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={requireAuth && !holdLogin}>
          <Stack.Screen name="account" />
        </Stack.Protected>
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
