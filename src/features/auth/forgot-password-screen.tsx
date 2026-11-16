import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { AuthScreenFrame, ButtonContent, FormSubmit, FormTextInput } from '@components/ui';
import { authRepository } from '@/services/auth/auth.repository';
import { getAuthErrorMessage } from '@/services/auth/auth.error-message';
import { forgotPasswordResolver } from '@/validation/resolvers/auth';
import { useAuthForm } from './hooks/use-auth-form';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const auth = useAuthForm(forgotPasswordResolver, { email: '' }, async (request) => {
    await authRepository.forgotPassword(request);
    setSent(true);
  });
  return (
    <AuthScreenFrame
      testID="auth-forgot"
      title={t('auth.forgotPasswordTitle')}
      description={t('auth.forgotSubtitle')}
    >
      <FormTextInput
        control={auth.form.control}
        name="email"
        label={t('auth.email')}
        autoComplete="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        disabled={auth.pending}
        onSubmitEditing={() => void auth.submit()}
        onEdited={() => {
          auth.clearError();
          setSent(false);
        }}
        testID="auth-forgot-email"
      />
      <FormSubmit
        testID="auth-forgot-submit"
        label={t('auth.sendRecovery')}
        pending={auth.pending}
        error={auth.error ? getAuthErrorMessage(auth.error) : undefined}
        notice={sent ? t('auth.recoveryEmailSent') : undefined}
        onPress={() => void auth.submit()}
      />
      <ButtonContent
        variant="link"
        label={t('auth.backToSignIn')}
        disabled={auth.pending}
        fullWidth
        onPress={() => router.dismissTo('/components/login')}
        testID="auth-forgot-back"
      />
    </AuthScreenFrame>
  );
}
