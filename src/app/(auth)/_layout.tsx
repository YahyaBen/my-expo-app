import { router, Stack } from 'expo-router';
import { AuthProvider } from '@/context/auth.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { AppQueryProvider } from '@/context/query-provider';
import { navigationTheme } from '@/constants/navigation-theme';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { AuthFlowProvider } from '@/features/auth/auth-flow.context';
import { SessionRestoreScreen } from '@/features/auth/session-restore-screen';
import { useAuthGuards } from '@/guards/auth-guards';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useAppTheme } from '@/hooks/use-theme';

function openVerification() {
  router.replace('/verify-email');
}

function openAccount() {
  router.replace('/account');
}

/** Session and network integration belong to the authentication examples only. */
export default function AuthExamplesLayout() {
  return (
    <AppQueryProvider>
      <AuthProvider>
        <AuthFlowProvider onVerificationRequired={openVerification} onAuthenticated={openAccount}>
          <AuthNavigator />
        </AuthFlowProvider>
      </AuthProvider>
    </AppQueryProvider>
  );
}

function AuthNavigator() {
  const { restoring } = useAuthGuards();
  const direction = useLayoutDirection();
  const reducedMotion = useAppReducedMotion();
  const colorScheme = useColorScheme();
  const { colors } = useAppTheme(colorScheme);
  // Preserve the requested example/reset link while stored credentials are read.
  if (restoring)
    return (
      <SessionRestoreScreen
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    );
  return (
    <Stack
      activityEnabled
      screenOptions={{
        ...stackMotionOptions(reducedMotion, direction),
        headerShown: false,
        contentStyle: {
          backgroundColor: navigationTheme(colorScheme, colors).colors.background,
          direction,
        },
      }}
    />
  );
}
