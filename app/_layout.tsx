import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';

import { LaunchScreen } from '@/components/launch-screen';
import { useColorScheme } from '@/components/useColorScheme';

const BRAND_SCREEN_DURATION_MS = 5000;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash may already be hidden during a development reload.
});
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [showBrandScreen, setShowBrandScreen] = useState(true);
  const [brandScreenExiting, setBrandScreenExiting] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Inter-Black': require('../assets/fonts/Inter-Black.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) return;

    void SplashScreen.hideAsync();
    const timeout = setTimeout(() => {
      setBrandScreenExiting(true);
    }, BRAND_SCREEN_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [loaded]);

  const finishBrandScreen = useCallback(() => {
    setShowBrandScreen(false);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#E6F4FE' }}>
      <RootLayoutNav />
      {showBrandScreen && (
        <LaunchScreen exiting={brandScreenExiting} onExitComplete={finishBrandScreen} />
      )}
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
