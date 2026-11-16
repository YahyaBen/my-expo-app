import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  AuthScreenFrame,
  Button,
  ButtonContent,
  Column,
  FormSubmit,
  FormTextInput,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { getAuthErrorMessage } from '@/services/auth/auth.error-message';
import { loginResolver } from '@/validation/resolvers/auth';
import { useAuthFlow } from './auth-flow.context';
import { GoogleSignInButton } from './google-sign-in-button';
import { useAuthForm } from './hooks/use-auth-form';
import { useGoogleSignIn } from './hooks/use-google-sign-in';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuthFlow();
  const auth = useAuthForm(loginResolver, { login: '', password: '' }, signIn);
  const google = useGoogleSignIn();
  const pending = auth.pending || google.pending;
  const error = auth.error ?? google.error;
  const clearError = () => {
    auth.clearError();
    google.clearError();
  };
  return (
    <AuthScreenFrame
      testID="auth-login"
      title={t('auth.welcomeBack')}
      description={t('auth.loginDescription')}
      topBar={
        <Button
          variant="tertiary"
          label={t('common.goBack')}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          testID="component-login-back"
        />
      }
    >
      <GoogleSignInButton
        pending={google.pending}
        disabled={pending}
        onPress={() => {
          clearError();
          google.submit();
        }}
      />
      <Text variant="caption" tone="muted">
        {t('auth.or')}
      </Text>
      <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
        <FormTextInput
          control={auth.form.control}
          name="login"
          label={t('auth.identity')}
          autoComplete="username"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => auth.form.setFocus('password')}
          onEdited={clearError}
          disabled={pending}
          testID="auth-login-email"
        />
        <FormTextInput
          control={auth.form.control}
          name="password"
          label={t('auth.password')}
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect={false}
          password
          passwordToggle="icon"
          returnKeyType="go"
          onSubmitEditing={() => {
            if (!pending) void auth.submit();
          }}
          onEdited={clearError}
          disabled={pending}
          testID="auth-login-password"
        />
        <ButtonContent
          variant="link"
          label={t('auth.forgotPassword')}
          disabled={pending}
          onPress={() => router.push('/forgot-password')}
          testID="auth-forgot-password"
        />
        <FormSubmit
          testID="auth-login-submit"
          label={t('auth.signIn')}
          pending={pending}
          error={error ? getAuthErrorMessage(error) : undefined}
          onPress={() => {
            clearError();
            void auth.submit();
          }}
        />
      </Column>
      <ButtonContent
        variant="link"
        label={t('auth.noAccountLink')}
        disabled={pending}
        fullWidth
        onPress={() => router.push('/components/register')}
        testID="auth-open-register"
      />
      <ButtonContent
        variant="tertiary"
        label={t('auth.exploreComponents')}
        disabled={pending}
        fullWidth
        onPress={() => router.dismissTo('/')}
        testID="auth-explore-components"
      />
    </AuthScreenFrame>
  );
}
