import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthScreenFrame, ButtonContent, FormSubmit, FormTextInput } from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { authRepository } from '@/services/auth/auth.repository';
import { getAuthErrorMessage } from '@/services/auth/auth.error-message';
import {
  isValidPasswordResetChallengeId,
  passwordResetSchema,
} from '@/validation/schemas/password-reset';
import { useAuthForm } from './hooks/use-auth-form';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { challengeId } = useLocalSearchParams<{ challengeId?: string | string[] }>();
  const validChallenge = isValidPasswordResetChallengeId(challengeId);
  const [complete, setComplete] = useState(false);
  const auth = useAuthForm(
    zodResolver(passwordResetSchema),
    { code: '', newPassword: '', confirmPassword: '' },
    async ({ code, newPassword }) => {
      if (!isValidPasswordResetChallengeId(challengeId))
        throw new Error('auth.recoveryLinkMissing');
      await authRepository.resetPassword({ challengeId, code, newPassword });
      setComplete(true);
    },
  );
  return (
    <AuthScreenFrame
      testID="auth-reset"
      title={t(complete ? 'auth.passwordResetTitle' : 'auth.resetPasswordTitle')}
      description={t(
        complete
          ? 'auth.resetComplete'
          : validChallenge
            ? 'auth.resetDescription'
            : 'auth.missingRecoveryDescription',
      )}
    >
      {validChallenge && !complete ? (
        <>
          <FormTextInput
            control={auth.form.control}
            name="code"
            label={t('auth.recoveryCode')}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            maxLength={6}
            returnKeyType="next"
            onSubmitEditing={() => auth.form.setFocus('newPassword')}
            onEdited={auth.clearError}
            disabled={auth.pending}
            testID="auth-reset-code"
          />
          <FormTextInput
            control={auth.form.control}
            name="newPassword"
            label={t('auth.newPassword')}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect={false}
            password
            passwordToggle="icon"
            returnKeyType="next"
            onSubmitEditing={() => auth.form.setFocus('confirmPassword')}
            onEdited={auth.clearError}
            disabled={auth.pending}
            testID="auth-reset-password"
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
            onSubmitEditing={() => void auth.submit()}
            onEdited={auth.clearError}
            disabled={auth.pending}
            testID="auth-reset-confirm-password"
          />
          <FormSubmit
            testID="auth-reset-submit"
            label={t('auth.updatePassword')}
            pending={auth.pending}
            error={auth.error ? getAuthErrorMessage(auth.error) : undefined}
            onPress={() => void auth.submit()}
          />
        </>
      ) : null}
      {!validChallenge ? (
        <ButtonContent
          variant="secondary"
          label={t('auth.requestRecovery')}
          fullWidth
          onPress={() => router.replace('/forgot-password')}
          testID="auth-reset-request-link"
        />
      ) : null}
      <ButtonContent
        variant="link"
        label={t('auth.backToSignIn')}
        disabled={auth.pending}
        fullWidth
        onPress={() => router.dismissTo('/components/login')}
        testID="auth-reset-back"
      />
    </AuthScreenFrame>
  );
}
