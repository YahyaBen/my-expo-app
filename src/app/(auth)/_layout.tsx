import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { AuthFlowProvider } from '@/features/auth/auth-flow.context';
import { useThemeColors } from '@/hooks/use-theme';

export const unstable_settings = { anchor: 'login' };

export default function AuthLayout() {
  const colors = useThemeColors();
  const reducedMotion = useAppReducedMotion();
  return (
    <AuthFlowProvider>
      <Stack
        activityEnabled={Platform.OS === 'android' ? 1 : false}
        screenOptions={{
          ...stackMotionOptions(reducedMotion),
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="verify-email" />
      </Stack>
    </AuthFlowProvider>
  );
}
