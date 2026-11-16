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
import { useLanguage } from '@/context/language.context';
import { getAuthErrorMessage } from '@/services/auth/auth.error-message';
import { registerResolver } from '@/validation/resolvers/auth';
import { useAuthFlow } from './auth-flow.context';
import { GoogleSignInButton } from './google-sign-in-button';
import { useAuthForm } from './hooks/use-auth-form';
import { useGoogleSignIn } from './hooks/use-google-sign-in';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { register } = useAuthFlow();
  const auth = useAuthForm(
    registerResolver,
    { userName: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    (values) =>
      register({
        userName: values.userName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        preferredLanguage: language,
      }),
  );
  const google = useGoogleSignIn();
  const pending = auth.pending || google.pending;
  const error = auth.error ?? google.error;
  const clearError = () => {
    auth.clearError();
    google.clearError();
  };
  return (
    <AuthScreenFrame
      testID="auth-register"
      title={t('auth.createAccountTitle')}
      description={t('auth.registerDescription')}
      topBar={
        <Button
          variant="tertiary"
          label={t('common.goBack')}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          testID="component-register-back"
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
          name="userName"
          label={t('auth.username')}
          autoComplete="username-new"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => auth.form.setFocus('email')}
          onEdited={clearError}
          disabled={pending}
          testID="auth-register-username"
        />
        <FormTextInput
          control={auth.form.control}
          name="email"
          label={t('auth.email')}
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => auth.form.setFocus('firstName')}
          onEdited={clearError}
          disabled={pending}
          testID="auth-register-email"
        />
        <Text variant="caption" tone="muted">
          {t('auth.optionalNames')}
        </Text>
        <FormTextInput
          control={auth.form.control}
          name="firstName"
          label={t('auth.firstName')}
          autoComplete="given-name"
          returnKeyType="next"
          onSubmitEditing={() => auth.form.setFocus('lastName')}
          onEdited={clearError}
          disabled={pending}
          testID="auth-register-first-name"
        />
        <FormTextInput
          control={auth.form.control}
          name="lastName"
          label={t('auth.lastName')}
          autoComplete="family-name"
          returnKeyType="next"
          onSubmitEditing={() => auth.form.setFocus('password')}
          onEdited={clearError}
          disabled={pending}
          testID="auth-register-last-name"
        />
        <FormTextInput
          control={auth.form.control}
          name="password"
          label={t('auth.password')}
          helperText={t('auth.passwordMinLength')}
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          password
          passwordToggle="icon"
          returnKeyType="next"
          onSubmitEditing={() => auth.form.setFocus('confirmPassword')}
          onEdited={clearError}
          disabled={pending}
          testID="auth-register-password"
        />
        <FormTextInput
          control={auth.form.control}
          name="confirmPassword"
          label={t('auth.confirmPassword')}
          autoComplete="new-password"
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
          testID="auth-register-confirm-password"
        />
        <Text variant="caption" tone="muted">
          {t('auth.registrationVerificationHelp')}
        </Text>
        <FormSubmit
          testID="auth-register-submit"
          label={t('auth.signUp')}
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
        label={t('auth.haveAccountLink')}
        fullWidth
        disabled={pending}
        onPress={() => router.dismissTo('/components/login')}
        testID="auth-back-to-login"
      />
    </AuthScreenFrame>
  );
}
